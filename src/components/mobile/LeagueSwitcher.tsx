import { Trophy } from 'lucide-react';

interface League {
  leagueName: string;
  leagueType: number; // 0 = NBA, 1 = College
  index: number;
}

interface LeagueSwitcherProps {
  leagues: League[];
  currentLeagueIndex: number;
  onSelect: (index: number) => void;
}

export default function LeagueSwitcher({
  leagues,
  currentLeagueIndex,
  onSelect,
}: LeagueSwitcherProps) {
  if (leagues.length <= 1) return null;

  return (
    <div className="card mb-6">
      <h3 className="text-sm font-pixel mb-4 text-hoopland-text">SELECT LEAGUE</h3>
      <div className="grid grid-cols-2 gap-3">
        {leagues.map((league) => (
          <button
            key={league.index}
            onClick={() => onSelect(league.index)}
            className={`p-4 border-4 font-pixel text-xs transition-all ${
              currentLeagueIndex === league.index
                ? 'border-hoopland-text bg-hoopland-border text-hoopland-text'
                : 'border-hoopland-border bg-hoopland-frame text-hoopland-text hover:border-hoopland-text'
            }`}
            style={{ boxShadow: '0 4px 0 0 #000' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4" />
              <span className="font-pixel">{league.leagueName.toUpperCase()}</span>
            </div>
            <div className="text-xs font-pixel-alt text-hoopland-dark">
              {league.leagueType === 0 ? 'NBA' : 'COLLEGE'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

