import { memo, useState } from 'react';
import { GameMode } from '../types/hoopland';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GameModeEditorProps {
  gameMode: GameMode;
  index: number;
  onChange: (gameMode: GameMode) => void;
}

function GameModeEditor({
  gameMode,
  index,
  onChange,
}: GameModeEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['season', 'draft', 'settings'])
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

  const handleChange = (key: string, value: any) => {
    onChange({ ...gameMode, [key]: value });
  };

  // Group fields by category
  const seasonFields = ['mode', 'currentYear', 'currentDay', 'currentRound', 'phase', 'startingYear', 'totalGames'];
  const draftFields = ['draftRounds', 'lotteryTeams', 'lotteryOdds', 'fantasyDraft', 'expansionDraft', 'customDraftClass'];
  const settingsFields = ['salaryCap', 'playoffTeams', 'seriesLength', 'playInTournament', 'simulationPace'];

  const getFieldCategory = (key: string): string => {
    if (seasonFields.includes(key)) return 'season';
    if (draftFields.includes(key)) return 'draft';
    if (settingsFields.includes(key)) return 'settings';
    return 'other';
  };

  const groupedFields = {
    season: [] as Array<[string, any]>,
    draft: [] as Array<[string, any]>,
    settings: [] as Array<[string, any]>,
    other: [] as Array<[string, any]>,
  };

  Object.entries(gameMode).forEach(([key, value]) => {
    const category = getFieldCategory(key);
    groupedFields[category].push([key, value]);
  });

  const renderField = (key: string, value: any) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div key={key}>
          <label className="label uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(key, parsed);
              } catch {
                // Invalid JSON, skip update
              }
            }}
            className="input-field font-mono text-xs"
            rows={4}
          />
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={key}>
          <label className="label uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
          <textarea
            value={JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleChange(key, parsed);
              } catch {
                // Invalid JSON, skip update
              }
            }}
            className="input-field font-mono text-xs"
            rows={4}
          />
        </div>
      );
    } else {
      return (
        <div key={key}>
          <label className="label uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
          <input
            type={typeof value === 'number' ? 'number' : 'text'}
            value={value as string | number}
            onChange={(e) =>
              handleChange(
                key,
                typeof value === 'number'
                  ? parseFloat(e.target.value) || 0
                  : e.target.value
              )
            }
            className="input-field"
          />
        </div>
      );
    }
  };

  return (
    <div className="card">
      <h3 className="text-sm font-pixel mb-4 text-hoopland-text">
        {gameMode.mode !== undefined ? 'SEASON SETTINGS' : `GAME MODE #${index + 1}`}
      </h3>
      
      {/* Season Fields */}
      {groupedFields.season.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('season')}
            className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
          >
            <span>SEASON</span>
            {expandedSections.has('season') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has('season') && (
            <div className="pl-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {groupedFields.season.map(([key, value]) => renderField(key, value))}
            </div>
          )}
        </div>
      )}

      {/* Draft Fields */}
      {groupedFields.draft.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('draft')}
            className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
          >
            <span>DRAFT SETTINGS</span>
            {expandedSections.has('draft') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has('draft') && (
            <div className="pl-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {groupedFields.draft.map(([key, value]) => renderField(key, value))}
            </div>
          )}
        </div>
      )}

      {/* Settings Fields */}
      {groupedFields.settings.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('settings')}
            className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
          >
            <span>GAME SETTINGS</span>
            {expandedSections.has('settings') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has('settings') && (
            <div className="pl-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {groupedFields.settings.map(([key, value]) => renderField(key, value))}
            </div>
          )}
        </div>
      )}

      {/* Other Fields */}
      {groupedFields.other.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('other')}
            className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
          >
            <span>OTHER SETTINGS</span>
            {expandedSections.has('other') ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedSections.has('other') && (
            <div className="pl-4 space-y-3">
              {groupedFields.other.map(([key, value]) => renderField(key, value))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(GameModeEditor);
