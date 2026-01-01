import { Player, Team } from '../types/hoopland';
import { FilterState } from '../components/search/FilterPanel';
import { getPositionAbbr, getPositionName } from './positions';
import { getSkillCategory } from './skills';

/**
 * Search players by query string
 */
export function searchPlayers(players: Player[], query: string, filters?: FilterState): Player[] {
  if (!players || !Array.isArray(players)) {
    return [];
  }

  let results = players;

  // Text search
  if (query && query.trim()) {
    try {
      const lowerQuery = query.toLowerCase();
      const queryNum = query.trim(); // For numeric searches
      results = results.filter((player) => {
        if (!player) return false;
        try {
          const name = `${player.fn || ''} ${player.ln || ''}`.toLowerCase();
          const id = player.id?.toString() || '';
          const posAbbr = getPositionAbbr(player.pos).toLowerCase();
          const posName = getPositionName(player.pos).toLowerCase();
          const num = player.num?.toString() || '';
          const jersey = `#${num}`;
          
          // Search in name, ID, position (abbr and name), jersey number
          return (
            name.includes(lowerQuery) ||
            id.includes(queryNum) ||
            posAbbr.includes(lowerQuery) ||
            posName.includes(lowerQuery) ||
            num.includes(queryNum) ||
            jersey.includes(queryNum)
          );
        } catch {
          return false;
        }
      });
    } catch (error) {
      console.error('Error in text search:', error);
      return players; // Return original list on error
    }
  }

  // Apply filters
  if (filters) {
    try {
      if (filters.position) {
        // Filter by position - handle both string (PG, SG, etc) and number
        results = results.filter((p) => {
          if (!p) return false;
          const posAbbr = getPositionAbbr(p.pos);
          return posAbbr === filters.position || p.pos?.toString() === filters.position;
        });
      }

      if (filters.minRating !== undefined && filters.minRating !== null) {
        results = results.filter((p) => {
          if (!p) return false;
          const rating = p.rating || 0;
          return rating >= filters.minRating!;
        });
      }

      if (filters.maxRating !== undefined && filters.maxRating !== null) {
        results = results.filter((p) => {
          if (!p) return false;
          const rating = p.rating || 0;
          return rating <= filters.maxRating!;
        });
      }

      if (filters.skillCategory) {
        results = results.filter((p) => {
          if (!p || !p.skills || !Array.isArray(p.skills) || p.skills.length === 0) return false;
          try {
            return p.skills.some((skill) => {
              if (!skill || !skill.id) return false;
              return getSkillCategory(skill.id) === filters.skillCategory;
            });
          } catch {
            return false;
          }
        });
      }

      if (filters.teamId !== undefined && filters.teamId !== null) {
        results = results.filter((p) => p && p.tid === filters.teamId);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      // Continue with results so far
    }
  }

  return results;
}

/**
 * Search teams by query string
 */
export function searchTeams(teams: Team[], query: string): Team[] {
  if (!teams || !Array.isArray(teams)) {
    return [];
  }

  if (!query || !query.trim()) return teams;

  try {
    const lowerQuery = query.toLowerCase();
    return teams.filter((team) => {
      if (!team) return false;
      try {
        const name = (team.name || '').toLowerCase();
        const city = (team.city || '').toLowerCase();
        const shortName = (team.shortName || '').toLowerCase();
        const id = team.id?.toString() || '';
        return (
          name.includes(lowerQuery) ||
          city.includes(lowerQuery) ||
          shortName.includes(lowerQuery) ||
          id.includes(lowerQuery)
        );
      } catch {
        return false;
      }
    });
  } catch (error) {
    console.error('Error in team search:', error);
    return teams; // Return original list on error
  }
}

/**
 * Debounce function for search
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

