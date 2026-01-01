# How to Update College Rosters with 2025-26 Season Data

## Current Situation

You're correct - the previous roster data was from the 2024-25 season. The script has been updated to use **2025-26 season data**, but getting complete rosters for all 64 teams is challenging because:

1. **The 2025-26 season is currently ongoing** (started November 3, 2025)
2. **Rosters change** throughout the season (transfers, injuries, etc.)
3. **Complete roster data** may not be publicly available for all teams yet

## Solution

The script now:
- ✅ Uses 2025-26 season data where available
- ✅ Generates realistic rosters for teams without real data
- ✅ Provides a framework to easily add more real rosters

## How to Add Real 2025-26 Rosters

### Step 1: Find Current Roster Data

**Best Sources:**
- **ESPN**: https://www.espn.com/mens-college-basketball/teams
  - Search for team → View roster → Get player names, positions, jersey numbers
- **Official Team Websites**: Each school's athletics website
- **Basketball Reference**: https://www.sports-reference.com/cbb/
- **NCAA Official**: https://www.ncaa.com/sports/basketball-men/d1

### Step 2: Get Player Statistics

For each player, you'll need:
- Points per game (PPG)
- Rebounds per game (RPG)
- Assists per game (APG)
- Field goal percentage
- 3-point percentage
- Free throw percentage
- Steals per game
- Blocks per game

### Step 3: Edit the Script

Open `/scripts/update_all_rosters.py` and add rosters to the `REAL_ROSTERS` dictionary:

```python
REAL_ROSTERS = {
    "Alabama Crimson Tide": [
        {
            "first_name": "Player",
            "last_name": "Name",
            "position": 0,  # 0=PG, 1=SG, 2=SF, 3=PF, 4=C
            "jersey": 1,
            "height": "6'1\"",
            "weight": "185",
            "age": 20,
            "rating": 85,  # Overall (0-99)
            "stats": {
                "ppg": 15.5,
                "rpg": 5.2,
                "apg": 3.8,
                "fg_pct": 0.465,
                "three_pct": 0.385,
                "ft_pct": 0.820,
                "spg": 1.8,
                "bpg": 0.4
            }
        },
        # Add more players...
    ],
}
```

### Step 4: Run the Update

```bash
python3 scripts/update_all_rosters.py NBA_CAREER_Y1_2025_SAVE_FILE_09.json
```

## Position Codes

- `0` = Point Guard (PG)
- `1` = Shooting Guard (SG)
- `2` = Small Forward (SF)
- `3` = Power Forward (PF)
- `4` = Center (C)
- `5` = Guard (G)
- `6` = Forward (F)
- `7` = Forward-Center (FC)
- `8` = Guard-Forward (GF)

## Teams in Your Save File

The save file contains these 64 college teams:
1. Alabama Crimson Tide
2. Arizona State Sun Devils
3. Arkansas Razorbacks
4. Auburn Tigers
5. Texas Longhorns
... (and 59 more)

All teams currently have **realistic generated rosters** until you add real 2025-26 roster data.

## Notes

- **Attributes are auto-calculated** from stats (no need to set them manually)
- **Ratings are calculated** based on performance stats
- **Teams without real data** get realistic generated rosters based on team quality
- **All rosters maintain** 10-11 players per team

## Quick Start

To quickly add a few teams:
1. Pick 2-3 teams you want real rosters for
2. Look up their 2025-26 rosters on ESPN
3. Add 5-10 key players to `REAL_ROSTERS`
4. Run the script
5. Repeat for more teams as needed

The script will automatically fill remaining roster spots with generated players.

