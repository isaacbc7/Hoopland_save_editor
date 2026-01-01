import { useState, useCallback, useMemo } from 'react';
import { Download, FileText, Users, Trophy, Target, Code } from 'lucide-react';
import FileLoader from './components/FileLoader';
import PlayerEditor from './components/PlayerEditor';
import GameModeEditor from './components/GameModeEditor';
import DraftEditor from './components/draft/DraftEditor';
import TeamEditor from './components/team/TeamEditor';
import LeagueSwitcher from './components/mobile/LeagueSwitcher';
import SearchBar from './components/search/SearchBar';
import FilterPanel, { FilterState } from './components/search/FilterPanel';
import ExportToUrl from './components/ExportToUrl';
import { ErrorBoundary } from './components/ErrorBoundary';
import { loadSaveFile, downloadSaveFile, normalizeSaveFile, denormalizeSaveFile, getAllLeagues, switchLeague } from './utils/fileHandler';
import { searchPlayers, searchTeams } from './utils/search';
import { getPositionAbbr } from './utils/positions';
import { NormalizedSave, Player, GameMode, Team } from './types/hoopland';
import { Upload } from 'lucide-react';

function App() {
  const [saveData, setSaveData] = useState<NormalizedSave | null>(null);
  const [currentView, setCurrentView] = useState<'overview' | 'player' | 'modes' | 'drafts' | 'teams'>('overview');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [filename, setFilename] = useState<string>('save');
  const [isLoading, setIsLoading] = useState(false);
  const [showRawJson, setShowRawJson] = useState<Record<string, boolean>>({});
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [playerFilters, setPlayerFilters] = useState<FilterState>({});
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);

  const processSaveData = useCallback((rawData: any, sourceName: string = 'save') => {
    const normalized = normalizeSaveFile(rawData);
    setSaveData(normalized);
    setFilename(sourceName);
    setShowRawJson({}); // Reset raw JSON view
    setSelectedPlayerId(null); // Reset selected player
    setSelectedTeamId(null);
    setPlayerSearchQuery('');
    setTeamSearchQuery('');
    setPlayerFilters({});
    setCurrentLeagueIndex(0);
    
    // Extract players from teams
    const allPlayers: Player[] = [];
    if (normalized.teams) {
      for (const team of normalized.teams) {
        if (team.roster) {
          allPlayers.push(...team.roster);
        }
      }
    }
    
    // If there's a career player (mobile), add it to the list
    if (normalized.player) {
      allPlayers.push(normalized.player);
      // Auto-select career player
      setSelectedPlayerId(normalized.player.id);
      setCurrentView('player');
    } else {
      setCurrentView('overview');
    }
  }, []);

  const handleFileLoad = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const rawData = await loadSaveFile(file);
      processSaveData(rawData, file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Failed to load save file. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [processSaveData]);

  const handleUrlLoad = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      // Extract filename from URL if possible, or use default
      const urlName = 'season_save';
      processSaveData(data, urlName);
    } catch (error) {
      console.error('Error loading from URL:', error);
      alert('Failed to process data from URL. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [processSaveData]);

  const handleLeagueSwitch = useCallback((leagueIndex: number) => {
    if (!saveData?.originalData) return;
    try {
      const switched = switchLeague(saveData.originalData, leagueIndex);
      setSaveData(switched);
      setCurrentLeagueIndex(leagueIndex);
      setSelectedPlayerId(null);
      setSelectedTeamId(null);
      // Reset search when switching leagues
      setPlayerSearchQuery('');
      setTeamSearchQuery('');
      setPlayerFilters({});
    } catch (error) {
      console.error('Error switching league:', error);
    }
  }, [saveData]);

  const handleUploadAnother = useCallback(() => {
    // Reset state
    setSaveData(null);
    setSelectedPlayerId(null);
    setCurrentView('overview');
    setShowRawJson({});
    // Trigger file input
    fileInputRef?.click();
  }, []);

  const handleSave = useCallback(() => {
    if (!saveData) return;
    // Denormalize back to original format before saving
    const denormalized = denormalizeSaveFile(saveData);
    downloadSaveFile(denormalized, filename);
  }, [saveData, filename]);

  const handlePlayerChange = useCallback((updatedPlayer: Player) => {
    if (!saveData) return;
    
    // Check if it's the career player (mobile)
    if (saveData.player && saveData.player.id === updatedPlayer.id) {
      setSaveData({
        ...saveData,
        player: updatedPlayer,
      });
      return;
    }
    
    // Update player in the team roster
    if (saveData.teams) {
      const updatedTeams = saveData.teams.map((team) => {
        if (team.roster) {
          const updatedRoster = team.roster.map((p: Player) =>
            p.id === updatedPlayer.id ? updatedPlayer : p
          );
          return { ...team, roster: updatedRoster };
        }
        return team;
      });
      
      setSaveData({
        ...saveData,
        teams: updatedTeams,
      });
    }
  }, [saveData]);

  const handleGameModeChange = useCallback((index: number, updatedMode: GameMode) => {
    if (!saveData) return;
    
    setSaveData({
      ...saveData,
      gameModes: saveData.gameModes?.map((mode: GameMode, i: number) =>
        i === index ? updatedMode : mode
      ),
    });
  }, [saveData]);

  // Extract all players from team rosters and career player
  const allPlayers = useMemo(() => {
    try {
      const players: Player[] = [];
      
      // Add career player if it exists (mobile)
      if (saveData?.player && typeof saveData.player === 'object') {
        players.push(saveData.player);
      }
      
      // Add players from team rosters
      if (saveData?.teams && Array.isArray(saveData.teams)) {
        for (const team of saveData.teams) {
          if (team && team.roster && Array.isArray(team.roster)) {
            players.push(...team.roster.filter((p): p is Player => p !== null && p !== undefined));
          }
        }
      }
      
      return players;
    } catch (error) {
      console.error('Error extracting players:', error);
      return [];
    }
  }, [saveData?.teams, saveData?.player]);

  // Filtered players based on search and filters
  const filteredPlayers = useMemo(() => {
    try {
      if (!allPlayers || allPlayers.length === 0) return [];
      return searchPlayers(allPlayers, playerSearchQuery || '', playerFilters);
    } catch (error) {
      console.error('Error filtering players:', error);
      return allPlayers; // Return all players on error
    }
  }, [allPlayers, playerSearchQuery, playerFilters]);

  // Filtered teams based on search
  const filteredTeams = useMemo(() => {
    try {
      if (!saveData?.teams || !Array.isArray(saveData.teams)) return [];
      return searchTeams(saveData.teams, teamSearchQuery || '');
    } catch (error) {
      console.error('Error filtering teams:', error);
      return saveData?.teams || []; // Return all teams on error
    }
  }, [saveData?.teams, teamSearchQuery]);

  // Get available leagues for mobile saves
  const availableLeagues = useMemo(() => {
    if (!saveData?.originalData) return null;
    return getAllLeagues(saveData.originalData);
  }, [saveData?.originalData]);

  const selectedPlayer = useMemo(() => {
    return allPlayers.find((p: Player) => p.id === selectedPlayerId);
  }, [allPlayers, selectedPlayerId]);


  if (!saveData) {
    return (
      <div className="min-h-screen p-8 bg-hoopland-dark">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-hoopland-frame" />
            <h1 className="text-2xl font-pixel mb-2 text-hoopland-text">HOOPLAND SAVE EDITOR</h1>
            <p className="text-sm font-pixel-alt text-hoopland-frame mt-2">
              Comprehensive editor for Hoopland save files
            </p>
          </div>
          {isLoading ? (
            <div className="card text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-hoopland-text mx-auto mb-4" style={{ borderTopColor: 'transparent' }}></div>
              <p className="text-sm font-pixel-alt text-hoopland-dark">Loading save file...</p>
            </div>
          ) : (
            <FileLoader onFileLoad={handleFileLoad} onUrlLoad={handleUrlLoad} />
          )}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-hoopland-dark">
      {/* Header */}
      <header className="bg-hoopland-frame border-b-4 border-hoopland-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-pixel text-hoopland-text">
                HOOPLAND SAVE EDITOR
              </h1>
              <p className="text-xs font-pixel-alt text-hoopland-dark mt-1">
                {filename} {saveData?.isMobile ? '(Mobile)' : '(Steam)'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUploadAnother}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                UPLOAD ANOTHER SAVE
              </button>
              <button
                onClick={handleSave}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                DOWNLOAD SAVE
              </button>
            </div>
            <input
              ref={(el) => setFileInputRef(el)}
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileLoad(file);
                }
                // Reset input so same file can be selected again
                e.target.value = '';
              }}
              accept="*/*"
              className="hidden"
            />
          </div>
        </div>
      </header>

        {/* Export to URL Section - Only for Mobile Saves */}
        {saveData?.isMobile && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ExportToUrl
              filename={filename}
              onDownload={handleSave}
              isMobile={saveData.isMobile}
            />
          </div>
        )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <button
                onClick={() => setCurrentView('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 border-4 font-pixel text-xs transition-all ${
                  currentView === 'overview'
                    ? 'bg-hoopland-border border-hoopland-text text-hoopland-text'
                    : 'bg-hoopland-frame border-hoopland-border text-hoopland-text hover:border-hoopland-text'
                }`}
                style={{ boxShadow: '0 4px 0 0 #000' }}
              >
                <FileText className="w-4 h-4" />
                OVERVIEW
              </button>
              <button
                onClick={() => setCurrentView('player')}
                className={`w-full flex items-center gap-3 px-4 py-3 border-4 font-pixel text-xs transition-all ${
                  currentView === 'player'
                    ? 'bg-hoopland-border border-hoopland-text text-hoopland-text'
                    : 'bg-hoopland-frame border-hoopland-border text-hoopland-text hover:border-hoopland-text'
                }`}
                style={{ boxShadow: '0 4px 0 0 #000' }}
              >
                <Users className="w-4 h-4" />
                PLAYERS
              </button>
              <button
                onClick={() => setCurrentView('modes')}
                className={`w-full flex items-center gap-3 px-4 py-3 border-4 font-pixel text-xs transition-all ${
                  currentView === 'modes'
                    ? 'bg-hoopland-border border-hoopland-text text-hoopland-text'
                    : 'bg-hoopland-frame border-hoopland-border text-hoopland-text hover:border-hoopland-text'
                }`}
                style={{ boxShadow: '0 4px 0 0 #000' }}
              >
                <Trophy className="w-4 h-4" />
                GAME MODES
              </button>
              <button
                onClick={() => setCurrentView('drafts')}
                className={`w-full flex items-center gap-3 px-4 py-3 border-4 font-pixel text-xs transition-all ${
                  currentView === 'drafts'
                    ? 'bg-hoopland-border border-hoopland-text text-hoopland-text'
                    : 'bg-hoopland-frame border-hoopland-border text-hoopland-text hover:border-hoopland-text'
                }`}
                style={{ boxShadow: '0 4px 0 0 #000' }}
              >
                <Target className="w-4 h-4" />
                DRAFTS
              </button>
              <button
                onClick={() => setCurrentView('teams')}
                className={`w-full flex items-center gap-3 px-4 py-3 border-4 font-pixel text-xs transition-all ${
                  currentView === 'teams'
                    ? 'bg-hoopland-border border-hoopland-text text-hoopland-text'
                    : 'bg-hoopland-frame border-hoopland-border text-hoopland-text hover:border-hoopland-text'
                }`}
                style={{ boxShadow: '0 4px 0 0 #000' }}
              >
                <Users className="w-4 h-4" />
                TEAMS
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {currentView === 'overview' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-pixel text-hoopland-text">SAVE FILE OVERVIEW</h2>
                    <div className="flex items-center gap-2">
                      {saveData?.isMobile && saveData.leagueType !== undefined && (
                        <span className="text-xs font-pixel-alt text-hoopland-dark px-3 py-1 bg-hoopland-border border-2 border-hoopland-text">
                          {saveData.leagueType === 0 ? 'NBA' : 'COLLEGE'}
                        </span>
                      )}
                      <span className="text-xs font-pixel-alt text-hoopland-dark px-3 py-1 bg-hoopland-border border-2 border-hoopland-text">
                        {saveData?.isMobile ? 'MOBILE' : 'STEAM'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-hoopland-border border-4 border-hoopland-text p-4">
                      <div className="text-xs font-pixel-alt text-hoopland-dark uppercase">Players</div>
                      <div className="text-xl font-pixel text-hoopland-text mt-2">
                        {allPlayers.length}
                      </div>
                    </div>
                    <div className="bg-hoopland-border border-4 border-hoopland-text p-4">
                      <div className="text-xs font-pixel-alt text-hoopland-dark uppercase">Teams</div>
                      <div className="text-xl font-pixel text-hoopland-text mt-2">
                        {saveData.teams?.length || 0}
                      </div>
                    </div>
                    <div className="bg-hoopland-border border-4 border-hoopland-text p-4">
                      <div className="text-xs font-pixel-alt text-hoopland-dark uppercase">Draft Class</div>
                      <div className="text-xl font-pixel text-hoopland-text mt-2">
                        {saveData.draftClass?.length || 0}
                      </div>
                    </div>
                    <div className="bg-hoopland-border border-4 border-hoopland-text p-4">
                      <div className="text-xs font-pixel-alt text-hoopland-dark uppercase">Free Agents</div>
                      <div className="text-xl font-pixel text-hoopland-text mt-2">
                        {saveData.freeAgents?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-pixel text-hoopland-text">RAW JSON STRUCTURE</h3>
                    <button
                      onClick={() => setShowRawJson({ ...showRawJson, overview: !showRawJson.overview })}
                      className="btn-secondary inline-flex items-center gap-2 text-xs"
                    >
                      <Code className="w-4 h-4" />
                      {showRawJson.overview ? 'HIDE' : 'SHOW'} JSON
                    </button>
                  </div>
                  {showRawJson.overview && (
                    <div className="bg-hoopland-dark p-4 border-4 border-hoopland-border overflow-auto max-h-96">
                      <pre className="text-xs font-mono text-hoopland-text">
                        {JSON.stringify(saveData, null, 2)}
                      </pre>
                    </div>
                  )}
                  {!showRawJson.overview && (
                    <p className="text-xs font-pixel-alt text-hoopland-dark">
                      Click "SHOW JSON" to view the raw save file structure. 
                      Warning: This can be large and may impact performance.
                    </p>
                  )}
                </div>
              </div>
            )}

            {currentView === 'player' && (
              <div className="space-y-6">
                {availableLeagues && availableLeagues.length > 1 && (
                  <LeagueSwitcher
                    leagues={availableLeagues}
                    currentLeagueIndex={currentLeagueIndex}
                    onSelect={handleLeagueSwitch}
                  />
                )}
                <div className="card">
                  <h2 className="text-sm font-pixel mb-4 text-hoopland-text">SELECT PLAYER</h2>
                  <div className="space-y-4 mb-4">
                    <SearchBar
                      value={playerSearchQuery}
                      onChange={setPlayerSearchQuery}
                      placeholder="SEARCH PLAYERS..."
                    />
                    <FilterPanel filters={playerFilters} onChange={setPlayerFilters} />
                  </div>
                  <div className="text-xs font-pixel-alt text-hoopland-dark mb-3">
                    Showing {Array.isArray(filteredPlayers) ? filteredPlayers.length : 0} of {Array.isArray(allPlayers) ? allPlayers.length : 0} players
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                    {Array.isArray(filteredPlayers) && filteredPlayers.length > 0 ? (
                      filteredPlayers.map((player: Player) => {
                        if (!player || !player.id) return null;
                        return (
                          <button
                            key={player.id}
                            onClick={() => setSelectedPlayerId(player.id)}
                            className={`p-3 border-4 font-pixel text-xs transition-all ${
                              selectedPlayerId === player.id
                                ? 'border-hoopland-text bg-hoopland-border text-hoopland-text'
                                : 'border-hoopland-border bg-hoopland-frame text-hoopland-text hover:border-hoopland-text'
                            }`}
                            style={{ boxShadow: '0 4px 0 0 #000' }}
                          >
                        <div className="font-pixel">
                          {player.fn && player.ln ? `${player.fn} ${player.ln}` : `PLAYER ${player.id}`}
                        </div>
                        <div className="text-xs font-pixel-alt text-hoopland-dark mt-1">
                          {player.pos !== undefined ? getPositionAbbr(player.pos) : 'N/A'} | #{player.num || 'N/A'} | ID: {player.id}
                        </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs font-pixel-alt text-hoopland-dark mt-4 text-center col-span-full">
                        No players found matching your search
                      </p>
                    )}
                  </div>
                </div>
                {selectedPlayer && (
                  <PlayerEditor
                    player={selectedPlayer}
                    onChange={handlePlayerChange}
                  />
                )}
              </div>
            )}

            {currentView === 'modes' && (
              <div className="space-y-6">
                {availableLeagues && availableLeagues.length > 1 && (
                  <LeagueSwitcher
                    leagues={availableLeagues}
                    currentLeagueIndex={currentLeagueIndex}
                    onSelect={handleLeagueSwitch}
                  />
                )}
                {saveData.season ? (
                  <GameModeEditor
                    gameMode={saveData.season as GameMode}
                    index={0}
                    onChange={(updated) => {
                      setSaveData({ ...saveData, season: updated });
                    }}
                  />
                ) : saveData.gameModes && saveData.gameModes.length > 0 ? (
                  saveData.gameModes.map((mode: GameMode, index: number) => (
                    <GameModeEditor
                      key={index}
                      gameMode={mode}
                      index={index}
                      onChange={(updated) => handleGameModeChange(index, updated)}
                    />
                  ))
                ) : (
                  <div className="card">
                    <h2 className="text-sm font-pixel mb-4 text-hoopland-text">SEASON SETTINGS</h2>
                    <p className="text-xs font-pixel-alt text-hoopland-dark">
                      No season settings found in this save file.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentView === 'drafts' && (
              <div>
                {(() => {
                  // For mobile saves, check if career player exists - they might be a draft prospect
                  // Also check if draftClass exists and has prospects, or if freeAgents might be prospects
                  const hasDraftClass = saveData.draftClass && saveData.draftClass.length > 0;
                  const hasCareerPlayer = saveData.player && saveData.isMobile;
                  const hasFreeAgents = saveData.freeAgents && saveData.freeAgents.length > 0;
                  
                  // If no draft class but we have a career player or free agents, show them as prospects
                  if (!hasDraftClass && (hasCareerPlayer || hasFreeAgents)) {
                    // Combine career player and free agents as draft prospects
                    const prospects: Player[] = [];
                    if (hasCareerPlayer && saveData.player) {
                      prospects.push(saveData.player);
                    }
                    if (hasFreeAgents && saveData.freeAgents) {
                      prospects.push(...saveData.freeAgents);
                    }
                    
                    return (
                      <DraftEditor
                        draftClass={prospects as any}
                        isProspectsMode={true}
                        onChange={(updated) => {
                          // Update career player if it's in the list
                          const careerPlayer = updated.find((p) => p.id === saveData.player?.id);
                          if (careerPlayer && saveData.player) {
                            setSaveData({ ...saveData, player: careerPlayer });
                          }
                          // Update free agents
                          const freeAgents = updated.filter((p) => p.id !== saveData.player?.id);
                          setSaveData({ ...saveData, freeAgents: freeAgents.length > 0 ? freeAgents : saveData.freeAgents });
                        }}
                      />
                    );
                  }
                  
                  // Normal draft class
                  if (hasDraftClass && saveData.draftClass) {
                    return (
                      <DraftEditor
                        draftClass={saveData.draftClass as any}
                        onChange={(updated) => {
                          setSaveData({ ...saveData, draftClass: updated });
                        }}
                      />
                    );
                  }
                  
                  // No draft data at all
                  return (
                    <div className="card">
                      <h2 className="text-sm font-pixel mb-4 text-hoopland-text">DRAFT CLASS</h2>
                      <p className="text-xs font-pixel-alt text-hoopland-dark mb-4">
                        No draft class found in this save file.
                      </p>
                      <button
                        onClick={() => setShowRawJson({ ...showRawJson, drafts: !showRawJson.drafts })}
                        className="btn-secondary inline-flex items-center gap-2 text-xs"
                      >
                        <Code className="w-4 h-4" />
                        {showRawJson.drafts ? 'HIDE' : 'SHOW'} RAW JSON
                      </button>
                      {showRawJson.drafts && (
                        <div className="bg-hoopland-dark p-4 border-4 border-hoopland-border overflow-auto max-h-96 mt-4">
                          <pre className="text-xs font-mono text-hoopland-text">
                            {JSON.stringify({ draftClass: saveData.draftClass, freeAgents: saveData.freeAgents?.length || 0 }, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {currentView === 'teams' && (
              <div className="space-y-6">
                {availableLeagues && availableLeagues.length > 1 && (
                  <LeagueSwitcher
                    leagues={availableLeagues}
                    currentLeagueIndex={currentLeagueIndex}
                    onSelect={handleLeagueSwitch}
                  />
                )}
                <div className="card">
                  <h2 className="text-sm font-pixel mb-4 text-hoopland-text">SELECT TEAM</h2>
                  <div className="mb-4">
                    <SearchBar
                      value={teamSearchQuery}
                      onChange={setTeamSearchQuery}
                      placeholder="SEARCH TEAMS..."
                    />
                  </div>
                  <div className="text-xs font-pixel-alt text-hoopland-dark mb-3">
                    Showing {filteredTeams.length} of {saveData.teams?.length || 0} teams
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {filteredTeams.map((team: Team) => {
                      const logoURL = (team as any).logoURL;
                      return (
                        <button
                          key={team.id}
                          onClick={() => setSelectedTeamId(team.id)}
                          className={`p-3 border-4 font-pixel text-xs text-left transition-all ${
                            selectedTeamId === team.id
                              ? 'border-hoopland-text bg-hoopland-border text-hoopland-text'
                              : 'border-hoopland-border bg-hoopland-frame text-hoopland-text hover:border-hoopland-text'
                          }`}
                          style={{ boxShadow: '0 4px 0 0 #000' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {logoURL ? (
                              <img
                                key={`${team.id}-${logoURL}`}
                                src={logoURL}
                                alt={`${team.name} logo`}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 border-2 border-hoopland-border bg-hoopland-dark flex items-center justify-center">
                                <span className="text-xs font-pixel text-hoopland-dark">?</span>
                              </div>
                            )}
                            <div className="font-pixel flex-1">
                              {team.city && team.name ? `${team.city} ${team.name}` : team.name || `TEAM ${team.id}`}
                            </div>
                          </div>
                          <div className="text-xs font-pixel-alt text-hoopland-dark">
                            Roster: {team.roster?.length || 0} players
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {filteredTeams.length === 0 && (
                    <p className="text-xs font-pixel-alt text-hoopland-dark mt-4 text-center">
                      No teams found matching your search
                    </p>
                  )}
                </div>
                {selectedTeamId && saveData.teams && (
                  <TeamEditor
                    team={saveData.teams.find((t) => t.id === selectedTeamId)!}
                    onChange={(updatedTeam) => {
                      const updatedTeams = saveData.teams!.map((t) =>
                        t.id === updatedTeam.id ? updatedTeam : t
                      );
                      setSaveData({ ...saveData, teams: updatedTeams });
                    }}
                    onPlayerClick={(playerId) => {
                      setSelectedPlayerId(playerId);
                      setCurrentView('player');
                    }}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App;
