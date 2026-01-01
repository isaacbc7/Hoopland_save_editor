import { useState, memo } from 'react';
import { Team, Player } from '../../types/hoopland';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getPositionAbbr } from '../../utils/positions';
import LogoEditor from './LogoEditor';

interface TeamEditorProps {
  team: Team;
  onChange: (team: Team) => void;
  onPlayerClick?: (playerId: number) => void;
}

function TeamEditor({ team, onChange, onPlayerClick }: TeamEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['logo', 'basic', 'roster'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateTeam = (updates: Partial<Team>) => {
    onChange({ ...team, ...updates });
  };

  return (
    <div className="card">
      <div className="border-b-4 border-hoopland-border pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {(team as any).logoURL && (
              <img
                key={`${team.id}-${(team as any).logoURL}`}
                src={(team as any).logoURL}
                alt={`${team.name} logo`}
                className="w-16 h-16 object-contain border-4 border-hoopland-border bg-hoopland-frame p-2"
                style={{ boxShadow: '0 4px 0 0 #000' }}
                onError={(e) => {
                  console.error('Failed to load team logo:', (team as any).logoURL);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                crossOrigin="anonymous"
              />
            )}
            <div>
              <h2 className="text-lg font-pixel text-hoopland-text">
                {team.city && team.name ? `${team.city} ${team.name}` : team.name || `TEAM ${team.id}`}
              </h2>
              <p className="text-xs font-pixel-alt text-hoopland-dark mt-1">ID: {team.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('logo')}
          className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
        >
          <span>TEAM LOGO</span>
          {expandedSections.has('logo') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('logo') && (
          <div className="pl-4">
            <LogoEditor
              logoURL={(team as any).logoURL}
              logoSize={(team as any).logoSize}
              onLogoChange={(logoURL, logoSize) => {
                updateTeam({ logoURL, logoSize } as any);
              }}
            />
          </div>
        )}
      </div>

      {/* Basic Info */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('basic')}
          className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
        >
          <span>BASIC INFORMATION</span>
          {expandedSections.has('basic') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('basic') && (
          <div className="pl-0 sm:pl-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">City</label>
              <input
                type="text"
                value={team.city || ''}
                onChange={(e) => updateTeam({ city: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                value={team.name || ''}
                onChange={(e) => updateTeam({ name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Short Name</label>
              <input
                type="text"
                value={team.shortName || ''}
                onChange={(e) => updateTeam({ shortName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Arena Name</label>
              <input
                type="text"
                value={(team as any).arenaName || ''}
                onChange={(e) => updateTeam({ arenaName: e.target.value } as any)}
                className="input-field"
              />
            </div>
          </div>
        )}
      </div>

      {/* Roster */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('roster')}
          className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
        >
          <span>ROSTER ({team.roster?.length || 0} PLAYERS)</span>
          {expandedSections.has('roster') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('roster') && (
          <div className="pl-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {team.roster?.map((player: Player) => (
                <button
                  key={player.id}
                  onClick={() => onPlayerClick?.(player.id)}
                  className="p-3 border-4 border-hoopland-border bg-hoopland-frame text-left transition-all hover:border-hoopland-text hover:bg-hoopland-border"
                  style={{ boxShadow: '0 2px 0 0 #000' }}
                >
                  <div className="font-pixel text-xs text-hoopland-text">
                    {player.fn && player.ln ? `${player.fn} ${player.ln}` : `PLAYER ${player.id}`}
                  </div>
                  <div className="text-xs font-pixel-alt text-hoopland-dark mt-1">
                    {getPositionAbbr(player.pos)} | #{player.num || 'N/A'} | Rating: {player.rating !== undefined && player.rating !== null ? Math.round(player.rating) : 'N/A'}
                  </div>
                </button>
              ))}
            </div>
            {(!team.roster || team.roster.length === 0) && (
              <p className="text-xs font-pixel-alt text-hoopland-dark text-center py-4">
                No players in roster
              </p>
            )}
          </div>
        )}
      </div>

      {/* Starting Lineup */}
      {(team as any).startingLineup && Array.isArray((team as any).startingLineup) && (team as any).startingLineup.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('lineup')}
            className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
          >
            <span>STARTING LINEUP ({(team as any).startingLineup.length} PLAYERS)</span>
            {expandedSections.has('lineup') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has('lineup') && (
            <div className="pl-4">
              <div className="space-y-2">
                {(team as any).startingLineup.map((lineupEntry: any, index: number) => {
                  const playerId = lineupEntry.pid;
                  const player = team.roster?.find((p: Player) => p.id === playerId);
                  const linePos = lineupEntry.linePos ?? index;
                  const minutes = lineupEntry.minutes;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => playerId && onPlayerClick?.(playerId)}
                      className="w-full p-3 border-4 border-hoopland-border bg-hoopland-frame text-left transition-all hover:border-hoopland-text hover:bg-hoopland-border"
                      style={{ boxShadow: '0 2px 0 0 #000' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-pixel text-xs text-hoopland-text">
                            {player ? (
                              `${player.fn || ''} ${player.ln || ''}`.trim() || `PLAYER ${playerId}`
                            ) : (
                              `PLAYER ${playerId} (NOT IN ROSTER)`
                            )}
                          </div>
                          {player && (
                            <div className="text-xs font-pixel-alt text-hoopland-dark mt-1">
                              {getPositionAbbr(player.pos)} | #{player.num || 'N/A'} | Rating: {player.rating !== undefined && player.rating !== null ? Math.round(player.rating) : 'N/A'}
                            </div>
                          )}
                        </div>
                        <div className="text-xs font-pixel-alt text-hoopland-dark">
                          Pos: {linePos}
                          {minutes && Array.isArray(minutes) && minutes.length > 0 && (
                            <span className="ml-2">Min: {minutes[0]}/{minutes[1] || minutes[0]}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(TeamEditor);

