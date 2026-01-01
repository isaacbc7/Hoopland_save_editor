import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { SkillCategory } from '../../types/hoopland';

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export interface FilterState {
  position?: string;
  minRating?: number;
  maxRating?: number;
  hasSkills?: boolean;
  skillCategory?: SkillCategory;
  teamId?: number;
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-2"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-hoopland-text" />
          <span className="text-sm font-pixel text-hoopland-text">FILTERS</span>
          {hasActiveFilters && (
            <span className="text-xs font-pixel-alt text-hoopland-dark bg-hoopland-border px-2 py-1 border-2 border-hoopland-text">
              {Object.keys(filters).length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-hoopland-text" />
        ) : (
          <ChevronDown className="w-4 h-4 text-hoopland-text" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t-4 border-hoopland-border">
          <div>
            <label className="label">Position</label>
            <select
              value={filters.position || ''}
              onChange={(e) => updateFilter('position', e.target.value || undefined)}
              className="input-field"
            >
              <option value="">All Positions</option>
              <option value="PG">Point Guard (PG)</option>
              <option value="SG">Shooting Guard (SG)</option>
              <option value="SF">Small Forward (SF)</option>
              <option value="PF">Power Forward (PF)</option>
              <option value="C">Center (C)</option>
              <option value="G">Guard (G)</option>
              <option value="F">Forward (F)</option>
              <option value="FC">Forward-Center (FC)</option>
              <option value="GF">Guard-Forward (GF)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label">Min Rating</label>
              <input
                type="number"
                min="0"
                max="99"
                value={filters.minRating || ''}
                onChange={(e) => updateFilter('minRating', e.target.value ? parseInt(e.target.value) : undefined)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Max Rating</label>
              <input
                type="number"
                min="0"
                max="99"
                value={filters.maxRating || ''}
                onChange={(e) => updateFilter('maxRating', e.target.value ? parseInt(e.target.value) : undefined)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label">Skill Category</label>
            <select
              value={filters.skillCategory || ''}
              onChange={(e) => updateFilter('skillCategory', e.target.value || undefined)}
              className="input-field"
            >
              <option value="">All Categories</option>
              <option value="finishing">Finishing</option>
              <option value="shooting">Shooting</option>
              <option value="creating">Creating</option>
              <option value="defense">Defense</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full btn-secondary text-xs"
            >
              CLEAR ALL FILTERS
            </button>
          )}
        </div>
      )}
    </div>
  );
}

