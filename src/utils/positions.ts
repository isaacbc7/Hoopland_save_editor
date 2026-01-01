/**
 * Position mapping utilities for Hoopland
 * Positions are stored as numbers in the save file
 */

export const POSITION_MAP: Record<number, string> = {
  0: 'PG',  // Point Guard
  1: 'SG',  // Shooting Guard
  2: 'SF',  // Small Forward
  3: 'PF',  // Power Forward
  4: 'C',   // Center
  5: 'G',   // Guard
  6: 'F',   // Forward
  7: 'FC',  // Forward-Center
  8: 'GF', // Guard-Forward
};

export const POSITION_NAMES: Record<number, string> = {
  0: 'Point Guard',
  1: 'Shooting Guard',
  2: 'Small Forward',
  3: 'Power Forward',
  4: 'Center',
  5: 'Guard',
  6: 'Forward',
  7: 'Forward-Center',
  8: 'Guard-Forward',
};

/**
 * Get position abbreviation from number
 */
export function getPositionAbbr(position: number | string | undefined): string {
  if (position === undefined || position === null) return 'N/A';
  const posNum = typeof position === 'string' ? parseInt(position) : position;
  return POSITION_MAP[posNum] || `POS${posNum}`;
}

/**
 * Get full position name from number
 */
export function getPositionName(position: number | string | undefined): string {
  if (position === undefined || position === null) return 'Unknown';
  const posNum = typeof position === 'string' ? parseInt(position) : position;
  return POSITION_NAMES[posNum] || `Position ${posNum}`;
}

/**
 * Check if query matches position
 */
export function matchesPosition(position: number | string | undefined, query: string): boolean {
  if (position === undefined || position === null) return false;
  const posNum = typeof position === 'string' ? parseInt(position) : position;
  const abbr = getPositionAbbr(posNum).toLowerCase();
  const name = getPositionName(posNum).toLowerCase();
  const lowerQuery = query.toLowerCase();
  return abbr.includes(lowerQuery) || name.includes(lowerQuery) || posNum.toString().includes(query);
}

