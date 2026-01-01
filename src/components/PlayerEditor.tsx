import { useState, memo, useMemo } from 'react';
import { Player, SkillCategory, PlayerSkill } from '../types/hoopland';
import SkillEditor from './SkillEditor';
import { getSkillsForCategory, getSkillCategory } from '../utils/skills';
import { getPositionAbbr, getPositionName } from '../utils/positions';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PlayerEditorProps {
  player: Player;
  onChange: (player: Player) => void;
}

function PlayerEditor({ player, onChange }: PlayerEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['stats', 'attributes', 'skills'])
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

  const updatePlayer = (updates: Partial<Player>) => {
    onChange({ ...player, ...updates });
  };

  const updateAttributes = (attrs: Partial<Player['attributes']>) => {
    updatePlayer({
      attributes: { ...player.attributes, ...attrs },
    });
  };

  // Organize skills by category for display
  const skillsByCategory = useMemo(() => {
    const categorized: Record<SkillCategory, PlayerSkill[]> = {
      finishing: [],
      shooting: [],
      creating: [],
      defense: [],
    };
    
    if (player.skills) {
      for (const skill of player.skills) {
        const category = getSkillCategory(skill.id);
        categorized[category].push(skill);
      }
    }
    
    return categorized;
  }, [player.skills]);

  const updateSkills = (category: SkillCategory, newSkills: PlayerSkill[]) => {
    // Merge with skills from other categories
    const otherCategorySkills = (player.skills || []).filter(
      (s) => getSkillCategory(s.id) !== category
    );
    const allSkills = [...otherCategorySkills, ...newSkills];
    updatePlayer({ skills: allSkills });
  };

  const skillCategories: SkillCategory[] = ['finishing', 'shooting', 'creating', 'defense'];

  return (
    <div className="card">
      <div className="border-b-4 border-hoopland-border pb-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-pixel text-hoopland-text">
              {player.fn && player.ln ? `${player.fn} ${player.ln}` : `PLAYER ${player.id}`}
            </h2>
            <p className="text-xs font-pixel-alt text-hoopland-dark mt-1">ID: {player.id}</p>
          </div>
        </div>
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
          <div className="pl-4 space-y-3">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={player.fn || ''}
                onChange={(e) => updatePlayer({ fn: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={player.ln || ''}
                onChange={(e) => updatePlayer({ ln: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Position</label>
              <select
                value={player.pos !== undefined ? player.pos.toString() : ''}
                onChange={(e) => {
                  const posValue = e.target.value ? parseInt(e.target.value) : undefined;
                  updatePlayer({ pos: posValue });
                }}
                className="input-field"
              >
                <option value="">-- SELECT POSITION --</option>
                <option value="0">Point Guard (PG)</option>
                <option value="1">Shooting Guard (SG)</option>
                <option value="2">Small Forward (SF)</option>
                <option value="3">Power Forward (PF)</option>
                <option value="4">Center (C)</option>
                <option value="5">Guard (G)</option>
                <option value="6">Forward (F)</option>
                <option value="7">Forward-Center (FC)</option>
                <option value="8">Guard-Forward (GF)</option>
              </select>
              {player.pos !== undefined && (
                <p className="text-xs font-pixel-alt text-hoopland-dark mt-1">
                  Current: {getPositionName(player.pos)} ({getPositionAbbr(player.pos)})
                </p>
              )}
            </div>
            <div>
              <label className="label">Jersey Number</label>
              <input
                type="number"
                value={player.num !== undefined && player.num !== null ? player.num : ''}
                onChange={(e) => {
                  const numValue = e.target.value === '' ? undefined : parseInt(e.target.value) || 0;
                  updatePlayer({ num: numValue });
                }}
                className="input-field"
                placeholder="Enter jersey number"
              />
              {player.num !== undefined && player.num !== null && (
                <p className="text-xs font-pixel-alt text-hoopland-dark mt-1">
                  Current: #{player.num}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('stats')}
          className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
        >
          <span>PLAYER STATS</span>
          {expandedSections.has('stats') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('stats') && (
          <div className="pl-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {player.stats &&
              Object.entries(player.stats).map(([key, value]) => (
                <div key={key}>
                  <label className="label capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    type={typeof value === 'number' ? 'number' : 'text'}
                    value={value as string | number}
                    onChange={(e) => {
                      const newStats = { ...player.stats };
                      newStats[key] =
                        typeof value === 'number'
                          ? parseFloat(e.target.value) || 0
                          : e.target.value;
                      updatePlayer({ stats: newStats });
                    }}
                    className="input-field"
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Attributes */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('attributes')}
          className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
        >
          <span>ATTRIBUTES</span>
          {expandedSections.has('attributes') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('attributes') && (
          <div className="pl-4 space-y-4">
            {/* Attribute categories */}
            <div>
              <h4 className="text-xs font-pixel text-hoopland-text mb-2 uppercase">Finishing</h4>
              <div className="grid grid-cols-3 gap-3">
                {['LAY', 'DNK', 'INS'].map((attr) => {
                  const value = player.attributes?.[attr] || [0, 0];
                  return (
                    <div key={attr} className="category-finishing card p-3">
                      <label className="label text-xs">{attr}</label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Current (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[0] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [parseInt(e.target.value) || 0, value[1] || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Max (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[1] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [value[0] || 0, parseInt(e.target.value) || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                        </div>
                        <div className="text-xs font-pixel-alt text-hoopland-dark">
                          {value[0] || 0} / {value[1] || 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-pixel text-hoopland-text mb-2 uppercase">Shooting</h4>
              <div className="grid grid-cols-3 gap-3">
                {['MID', 'TPT', 'FTS'].map((attr) => {
                  const value = player.attributes?.[attr] || [0, 0];
                  return (
                    <div key={attr} className="category-shooting card p-3">
                      <label className="label text-xs">{attr}</label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Current (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[0] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [parseInt(e.target.value) || 0, value[1] || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Max (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[1] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [value[0] || 0, parseInt(e.target.value) || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                        </div>
                        <div className="text-xs font-pixel-alt text-hoopland-dark">
                          {value[0] || 0} / {value[1] || 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-pixel text-hoopland-text mb-2 uppercase">Creating</h4>
              <div className="grid grid-cols-4 gap-3">
                {['DRB', 'PAS', 'ORE', 'DRE'].map((attr) => {
                  const value = player.attributes?.[attr] || [0, 0];
                  return (
                    <div key={attr} className="category-creating card p-3">
                      <label className="label text-xs">{attr}</label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Current (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[0] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [parseInt(e.target.value) || 0, value[1] || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Max (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[1] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [value[0] || 0, parseInt(e.target.value) || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                        </div>
                        <div className="text-xs font-pixel-alt text-hoopland-dark">
                          {value[0] || 0} / {value[1] || 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-pixel text-hoopland-text mb-2 uppercase">Defense</h4>
              <div className="grid grid-cols-2 gap-3">
                {['STL', 'BLK'].map((attr) => {
                  const value = player.attributes?.[attr] || [0, 0];
                  return (
                    <div key={attr} className="category-defense card p-3">
                      <label className="label text-xs">{attr}</label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Current (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[0] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [parseInt(e.target.value) || 0, value[1] || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs font-pixel-alt text-hoopland-dark mb-1 block">Max (Max: 20)</label>
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={value[1] || 0}
                              onChange={(e) =>
                                updateAttributes({
                                  [attr]: [value[0] || 0, parseInt(e.target.value) || 0],
                                })
                              }
                              className="input-field text-xs w-full"
                            />
                          </div>
                        </div>
                        <div className="text-xs font-pixel-alt text-hoopland-dark">
                          {value[0] || 0} / {value[1] || 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-pixel text-hoopland-text mb-2 uppercase">Physicals</h4>
              <div className="grid grid-cols-3 gap-3">
                {['SPD', 'STR', 'STM'].map((attr) => {
                  const value = player.attributes?.[attr] || [0, 0];
                  return (
                    <div key={attr} className="category-physicals card p-3">
                      <label className="label text-xs">{attr}</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={value[0] || 0}
                          onChange={(e) =>
                            updateAttributes({
                              [attr]: [parseInt(e.target.value) || 0, value[1] || 0],
                            })
                          }
                          className="input-field text-xs"
                        />
                        <input
                          type="number"
                          min="0"
                          max="99"
                          value={value[1] || 0}
                          onChange={(e) =>
                            updateAttributes({
                              [attr]: [value[0] || 0, parseInt(e.target.value) || 0],
                            })
                          }
                          className="input-field text-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('skills')}
          className="flex items-center justify-between w-full text-left font-pixel text-sm text-hoopland-text mb-3"
        >
          <span>SKILLS</span>
          {expandedSections.has('skills') ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedSections.has('skills') && (
          <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {skillCategories.map((category) => (
              <SkillEditor
                key={category}
                category={category}
                skills={skillsByCategory[category]}
                availableSkills={getSkillsForCategory(category)}
                onChange={(skills) => updateSkills(category, skills)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(PlayerEditor);
