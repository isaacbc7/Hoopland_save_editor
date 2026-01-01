/**
 * Skill definitions for Hoopland
 * Based on save file analysis - 24 unique skill IDs found
 */

import { SkillCategory, SkillID, SkillDefinition } from '../types/hoopland';

// Skill definitions with names and categories
// Note: Skill names and categories are educated guesses based on IDs
// These should be verified/updated with actual game data
export const SKILL_DEFINITIONS: Partial<Record<SkillID, SkillDefinition>> = {
  // Finishing skills
  DUN: { id: 'DUN', name: 'Dunk', category: 'finishing' },
  FOO: { id: 'FOO', name: 'Floater', category: 'finishing' },
  HIG: { id: 'HIG', name: 'High Flyer', category: 'finishing' },
  
  // Shooting skills
  SPA: { id: 'SPA', name: 'Space Creator', category: 'shooting' },
  SPO: { id: 'SPO', name: 'Spot Up', category: 'shooting' },
  HOT: { id: 'HOT', name: 'Hot Hand', category: 'shooting' },
  MAG: { id: 'MAG', name: 'Magician', category: 'shooting' },
  TWO: { id: 'TWO', name: 'Two-Way', category: 'shooting' },
  
  // Creating skills
  CLA: { id: 'CLA', name: 'Clutch', category: 'creating' },
  CRA: { id: 'CRA', name: 'Crafty', category: 'creating' },
  DIM: { id: 'DIM', name: 'Diminutive', category: 'creating' },
  LOC: { id: 'LOC', name: 'Lockdown', category: 'creating' }, // Might be defense
  CLE: { id: 'CLE', name: 'Clever', category: 'creating' },
  CLU: { id: 'CLU', name: 'Clutch Passer', category: 'creating' },
  VOL: { id: 'VOL', name: 'Volatile', category: 'creating' },
  
  // Defense skills
  STE: { id: 'STE', name: 'Steal', category: 'defense' },
  SNA: { id: 'SNA', name: 'Snatch', category: 'defense' },
  SOF: { id: 'SOF', name: 'Soft Touch', category: 'defense' }, // Might be finishing
  BAL: { id: 'BAL', name: 'Balance', category: 'defense' },
  BUL: { id: 'BUL', name: 'Bully', category: 'defense' },
  CHE: { id: 'CHE', name: 'Chef', category: 'defense' }, // Might be creating
  LIM: { id: 'LIM', name: 'Limitless', category: 'defense' }, // Might be shooting
  TEA: { id: 'TEA', name: 'Teammate', category: 'defense' }, // Might be creating
  UNF: { id: 'UNF', name: 'Unfazed', category: 'defense' },
} as Record<SkillID, SkillDefinition>;

// Organized by category for easy access
export const SKILLS_BY_CATEGORY: Record<SkillCategory, SkillDefinition[]> = {
  finishing: ['DUN', 'FOO', 'HIG'].map(id => SKILL_DEFINITIONS[id as SkillID]!).filter(Boolean),
  shooting: ['SPA', 'SPO', 'HOT', 'MAG', 'TWO'].map(id => SKILL_DEFINITIONS[id as SkillID]!).filter(Boolean),
  creating: ['CLA', 'CRA', 'DIM', 'CLE', 'CLU', 'VOL'].map(id => SKILL_DEFINITIONS[id as SkillID]!).filter(Boolean),
  defense: ['STE', 'SNA', 'BAL', 'BUL', 'UNF'].map(id => SKILL_DEFINITIONS[id as SkillID]!).filter(Boolean),
};

/**
 * Get skill definition by ID
 */
export function getSkillDefinition(skillId: SkillID): SkillDefinition {
  return SKILL_DEFINITIONS[skillId] || {
    id: skillId,
    name: `Unknown (${skillId})`,
    category: 'finishing', // Default
  };
}

/**
 * Get skill name by ID
 */
export function getSkillName(skillId: SkillID): string {
  return getSkillDefinition(skillId).name;
}

/**
 * Get all available skills for a category
 */
export function getSkillsForCategory(category: SkillCategory): SkillDefinition[] {
  return SKILLS_BY_CATEGORY[category] || [];
}

/**
 * Get all skills as a flat list
 */
export function getAllSkills(): SkillDefinition[] {
  return Object.values(SKILL_DEFINITIONS);
}

/**
 * Get category for a skill ID
 */
export function getSkillCategory(skillId: SkillID): SkillCategory {
  return getSkillDefinition(skillId).category;
}
