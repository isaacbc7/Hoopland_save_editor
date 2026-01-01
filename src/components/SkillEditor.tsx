import { memo } from 'react';
import { PlayerSkill, SkillCategory, SkillID } from '../types/hoopland';
import { getSkillsForCategory, getSkillName, SkillDefinition } from '../utils/skills';
import { X } from 'lucide-react';

interface SkillEditorProps {
  category: SkillCategory;
  skills: PlayerSkill[]; // Array of equipped skills for this category
  availableSkills: SkillDefinition[]; // All available skills for this category
  onChange: (skills: PlayerSkill[]) => void;
}

const categoryLabels: Record<SkillCategory, string> = {
  finishing: 'Finishing',
  shooting: 'Shooting',
  creating: 'Creating',
  defense: 'Defense',
};

function SkillEditor({
  category,
  skills,
  availableSkills,
  onChange,
}: SkillEditorProps) {
  const handleSkillChange = (index: number, skillId: SkillID | null) => {
    const newSkills = [...skills];
    if (skillId) {
      // Create new skill object or update existing
      const existingSkill = newSkills[index];
      if (existingSkill && existingSkill.id === skillId) {
        // Same skill, keep it
        return;
      }
      newSkills[index] = {
        id: skillId,
        xp: 0,
        level: 1,
        equipped: true,
      };
    } else {
      // Remove skill
      newSkills.splice(index, 1);
    }
    onChange(newSkills);
  };

  const handleRemove = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    onChange(newSkills);
  };

  const handleAdd = () => {
    if (skills.length < 4 && availableSkills.length > 0) {
      const newSkill: PlayerSkill = {
        id: availableSkills[0].id,
        xp: 0,
        level: 1,
        equipped: true,
      };
      onChange([...skills, newSkill]);
    }
  };

  const canAdd = skills.length < 4;

  // Ensure we have slots for up to 4 skills
  const skillSlots = Array.from({ length: 4 }, (_, i) => skills[i] || null);

  return (
    <div className={`card category-${category}`}>
      <h3 className="text-sm font-pixel mb-4 text-hoopland-text uppercase">
        {categoryLabels[category]} SKILLS
      </h3>
      <div className="space-y-3">
        {skillSlots.map((skill, index) => {
          const skillId = skill?.id || null;
          
          return (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1">
                <select
                  value={skillId || ''}
                  onChange={(e) =>
                    handleSkillChange(
                      index,
                      e.target.value ? (e.target.value as SkillID) : null
                    )
                  }
                  className="input-field"
                >
                  <option value="">-- SELECT SKILL --</option>
                  {availableSkills.map((skillDef) => (
                    <option key={skillDef.id} value={skillDef.id}>
                      {skillDef.name} ({skillDef.id})
                    </option>
                  ))}
                </select>
              </div>
              {skill && (
                <>
                  <div className="flex gap-2 items-end">
                    <div className="flex flex-col">
                      <label className="text-xs font-pixel-alt text-hoopland-dark mb-1">LVL (Max: 10)</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={skill.level}
                        onChange={(e) => {
                          const newSkills = [...skills];
                          newSkills[index] = {
                            ...skill,
                            level: parseInt(e.target.value) || 0,
                          };
                          onChange(newSkills);
                        }}
                        className="input-field w-16 text-xs"
                        title="Skill Level (0-10, 0 = not unlocked)"
                      />
                      <div className="text-xs font-pixel-alt text-hoopland-dark mt-1 text-center">
                        {skill.level}/10
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs font-pixel-alt text-hoopland-dark mb-1">XP</label>
                      <input
                        type="number"
                        min="0"
                        value={skill.xp}
                        onChange={(e) => {
                          const newSkills = [...skills];
                          newSkills[index] = {
                            ...skill,
                            xp: parseInt(e.target.value) || 0,
                          };
                          onChange(newSkills);
                        }}
                        className="input-field w-20 text-xs"
                        title="Experience Points"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white border-4 border-hoopland-text transition-all"
                    title="Remove skill"
                    style={{ boxShadow: '0 2px 0 0 #000' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          );
        })}
        {canAdd && (
          <button
            onClick={handleAdd}
            className="w-full btn-secondary text-xs"
          >
            + ADD SKILL
          </button>
        )}
      </div>
      <p className="text-xs font-pixel-alt text-hoopland-dark mt-3">
        {skills.length} / 4 SKILLS EQUIPPED
      </p>
    </div>
  );
}

export default memo(SkillEditor);
