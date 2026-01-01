/**
 * File handling utilities for loading and saving Hoopland save files
 * Hoopland saves don't have .json extension but are JSON formatted
 * Supports both Steam and Mobile save formats
 */

import { HooplandSave, MobileHooplandSave, NormalizedSave } from '../types/hoopland';

export async function loadSaveFile(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);
        resolve(json);
      } catch (error) {
        reject(new Error('Failed to parse JSON file: ' + error));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Normalize save file to common structure
 * Handles both Steam and Mobile formats
 */
export function normalizeSaveFile(data: any): NormalizedSave {
  // Check if it's a mobile save (has seasonLeagues)
  if (data.seasonLeagues && Array.isArray(data.seasonLeagues) && data.seasonLeagues.length > 0) {
    // Mobile format - extract first league
    const league = data.seasonLeagues[0];
    return {
      ...league,
      isMobile: true,
      originalData: data, // Keep original for saving
      allLeagues: data.seasonLeagues, // Keep all leagues for switching
      currentLeagueIndex: 0, // Track which league we're editing
    };
  } else {
    // Steam format - use as-is
    return {
      ...data,
      isMobile: false,
      originalData: data,
      allLeagues: null,
      currentLeagueIndex: 0,
    };
  }
}

/**
 * Get all leagues from mobile save
 */
export function getAllLeagues(data: any): Array<{ leagueName: string; leagueType: number; index: number }> | null {
  if (data.seasonLeagues && Array.isArray(data.seasonLeagues)) {
    return data.seasonLeagues.map((league: any, index: number) => ({
      leagueName: league.leagueName || 'Unknown',
      leagueType: league.leagueType ?? 0,
      index,
    }));
  }
  return null;
}

/**
 * Switch to a different league in mobile save
 */
export function switchLeague(originalData: any, leagueIndex: number): NormalizedSave {
  if (originalData.seasonLeagues && originalData.seasonLeagues[leagueIndex]) {
    const league = originalData.seasonLeagues[leagueIndex];
    return {
      ...league,
      isMobile: true,
      originalData,
      allLeagues: originalData.seasonLeagues,
      currentLeagueIndex: leagueIndex,
    };
  }
  throw new Error('Invalid league index');
}

/**
 * Denormalize save file back to original format
 */
export function denormalizeSaveFile(normalized: NormalizedSave): any {
  if (normalized.isMobile && normalized.originalData) {
    // Mobile format - update the current league in seasonLeagues
    const updated = { ...normalized.originalData };
    if (updated.seasonLeagues && Array.isArray(updated.seasonLeagues)) {
      // Find which league index we're editing (default to 0)
      const leagueIndex = normalized.currentLeagueIndex ?? 0;
      
      // Remove internal flags before updating
      const { isMobile, originalData, allLeagues, currentLeagueIndex, ...leagueData } = normalized;
      updated.seasonLeagues[leagueIndex] = leagueData;
    }
    return updated;
  } else {
    // Steam format - return as-is (remove internal flags)
    const { isMobile, originalData, allLeagues, currentLeagueIndex, ...saveData } = normalized;
    return saveData;
  }
}

export function downloadSaveFile(data: any, filename: string): void {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
}
