import { useState, useMemo } from 'react';
import { Player } from '../../types/hoopland';
import PlayerEditor from '../PlayerEditor';
import SearchBar from '../search/SearchBar';
import FilterPanel, { FilterState } from '../search/FilterPanel';
import { searchPlayers } from '../../utils/search';

interface DraftProspect extends Player {
  draft?: {
    round?: number;
    pick?: number;
    year?: number;
    tid?: number;
    originalTid?: number;
  };
}

interface DraftEditorProps {
  draftClass: DraftProspect[] | Player[];
  onChange: (draftClass: DraftProspect[] | Player[]) => void;
  isProspectsMode?: boolean; // True if showing free agents/career player instead of actual draft class
}

export default function DraftEditor({ draftClass, onChange, isProspectsMode = false }: DraftEditorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedProspectId, setSelectedProspectId] = useState<number | null>(null);

  const filteredProspects = useMemo(() => {
    return searchPlayers(draftClass, searchQuery, filters);
  }, [draftClass, searchQuery, filters]);

  const handleProspectChange = (updatedProspect: Player) => {
    const updated = draftClass.map((p) =>
      p.id === updatedProspect.id ? updatedProspect : p
    );
    onChange(updated);
  };

  const selectedProspect = draftClass.find((p) => p.id === selectedProspectId);

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-sm font-pixel mb-4 text-hoopland-text">DRAFT CLASS</h2>
        {isProspectsMode && (
          <div className="mb-3 p-3 bg-hoopland-border border-4 border-hoopland-text">
            <p className="text-xs font-pixel-alt text-hoopland-dark">
              ⚠️ No formal draft class found. Showing career player and free agents as draft prospects.
            </p>
          </div>
        )}
        <p className="text-xs font-pixel-alt text-hoopland-dark mb-4">
          {draftClass.length} {isProspectsMode ? 'potential prospects' : 'prospects'} in draft class
        </p>

        <div className="space-y-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="SEARCH PROSPECTS..."
          />
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredProspects.map((prospect) => {
            const draftInfo = (prospect as DraftProspect).draft;
            return (
              <button
                key={prospect.id}
                onClick={() => setSelectedProspectId(prospect.id)}
                className={`p-3 border-4 font-pixel text-xs text-left transition-all ${
                  selectedProspectId === prospect.id
                    ? 'border-hoopland-text bg-hoopland-border text-hoopland-text'
                    : 'border-hoopland-border bg-hoopland-frame text-hoopland-text hover:border-hoopland-text'
                }`}
                style={{ boxShadow: '0 4px 0 0 #000' }}
              >
                <div className="font-pixel">
                  {prospect.fn && prospect.ln
                    ? `${prospect.fn} ${prospect.ln}`
                    : `PROSPECT ${prospect.id}`}
                </div>
                <div className="text-xs font-pixel-alt text-hoopland-dark mt-1">
                  {prospect.pos} | Rating: {prospect.rating || 'N/A'}
                  {draftInfo && (
                    <>
                      {' | '}
                      Round {draftInfo.round || '?'} Pick {draftInfo.pick || '?'}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {filteredProspects.length === 0 && (
          <p className="text-xs font-pixel-alt text-hoopland-dark mt-4 text-center">
            No prospects found matching your search
          </p>
        )}
      </div>

      {selectedProspect && (
        <PlayerEditor
          player={selectedProspect}
          onChange={handleProspectChange}
        />
      )}
    </div>
  );
}

