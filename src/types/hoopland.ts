// Type definitions for Hoopland save file structure
// Based on actual save file analysis

export type SkillCategory = 'finishing' | 'shooting' | 'creating' | 'defense';

// Skill IDs found in save files (24 total)
export type SkillID = 
  | 'BAL' | 'BUL' | 'CHE' | 'CLA' | 'CLE' | 'CLU' | 'CRA' | 'DIM' | 'DUN' | 'FOO'
  | 'HIG' | 'HOT' | 'LIM' | 'LOC' | 'MAG' | 'SNA' | 'SOF' | 'SPA' | 'SPO' | 'STE'
  | 'TEA' | 'TWO' | 'UNF' | 'VOL';

// Skill object as stored in save file
export interface PlayerSkill {
  id: SkillID;
  xp: number;
  level: number;
  equipped: boolean;
}

// Skill definition with name and category (for UI)
export interface SkillDefinition {
  id: SkillID;
  name: string;
  category: SkillCategory;
  description?: string;
}

// Attributes are stored as [current, max] arrays
export type AttributeValue = [number, number];

export interface PlayerAttributes {
  LAY?: AttributeValue;  // Layup
  DNK?: AttributeValue;  // Dunk
  INS?: AttributeValue;  // Inside Scoring
  MID?: AttributeValue;  // Mid-range
  TPT?: AttributeValue;  // 3-point
  FTS?: AttributeValue;  // Free Throw
  DRB?: AttributeValue;  // Dribbling
  PAS?: AttributeValue;  // Passing
  ORE?: AttributeValue;  // Offensive Rebound
  DRE?: AttributeValue;  // Defensive Rebound
  STL?: AttributeValue;  // Steal
  BLK?: AttributeValue;  // Block
  SPD?: AttributeValue;  // Speed
  STR?: AttributeValue;  // Strength
  STM?: AttributeValue;  // Stamina
  [key: string]: AttributeValue | undefined;
}

export interface PlayerStats {
  [key: string]: number | string | boolean | any;
}

// Player as stored in save file
export interface Player {
  id: number;
  fn?: string;  // First name
  ln?: string;  // Last name
  tid?: number;  // Team ID
  pos?: string;  // Position
  age?: number;
  ht?: string;  // Height
  wt?: string;  // Weight
  num?: number;  // Jersey number
  attributes?: PlayerAttributes;
  skills?: PlayerSkill[];  // Flat list of skills
  stats?: PlayerStats;
  season?: any;
  careerStats?: any;
  [key: string]: any; // For other player properties
}

export interface Team {
  id: number;
  name?: string;
  city?: string;
  shortName?: string;
  roster?: Player[];  // Players are in roster, not players
  [key: string]: any;
}

export interface Draft {
  id?: number;
  year?: number;
  picks?: any[];
  [key: string]: any;
}

export interface GameMode {
  type?: string;
  [key: string]: any;
}

// Main save file structure (Steam version)
export interface HooplandSave {
  leagueName?: string;
  shortName?: string;
  leagueType?: string;
  teams?: Team[];
  conferences?: any[];
  divisions?: any[];
  draftClass?: any[];
  freeAgents?: Player[];
  [key: string]: any; // Flexible for unknown structure
}

// Mobile save file structure
export interface MobileHooplandSave {
  seasonLeagues?: Array<{
    leagueName?: string;
    shortName?: string;
    leagueType?: string;
    teams?: Team[];
    player?: Player; // Career mode player
    conferences?: any[];
    divisions?: any[];
    draftClass?: any[];
    freeAgents?: Player[];
    [key: string]: any;
  }>;
  [key: string]: any;
}

// Normalized save structure (internal use)
export interface NormalizedSave {
  leagueName?: string;
  shortName?: string;
  leagueType?: number | string;
  teams?: Team[];
  player?: Player; // Career mode player (mobile)
  season?: any; // Season settings
  conferences?: any[];
  divisions?: any[];
  draftClass?: any[];
  freeAgents?: Player[];
  isMobile?: boolean; // Flag to track format
  originalData?: any; // Keep original for saving
  allLeagues?: any[]; // All leagues for mobile saves
  currentLeagueIndex?: number; // Current league index for mobile saves
  [key: string]: any;
}
