# College Roster Update Guide - 2025-26 Season

## Current Status

The roster update script has been updated to use **2025-26 season data** where available. However, getting complete rosters for all 64 teams is challenging since:

1. The 2025-26 season is currently ongoing (started November 3, 2025)
2. Rosters change throughout the season (transfers, injuries, etc.)
3. Complete roster data may not be publicly available for all teams

## How to Add 2025-26 Rosters

### Step 1: Find Current Roster Data

Sources for 2025-26 rosters:
- **ESPN**: https://www.espn.com/mens-college-basketball/teams
- **Official Team Websites**: Each school's athletics website
- **Basketball Reference**: https://www.sports-reference.com/cbb/
- **NCAA Official Site**: https://www.ncaa.com/sports/basketball-men/d1

### Step 2: Update the REAL_ROSTERS Dictionary

Edit `/scripts/update_all_rosters.py` and add players to the `REAL_ROSTERS` dictionary:

```python
REAL_ROSTERS = {
    "Team Name": [
        {
            "first_name": "First",
            "last_name": "Last",
            "position": 0,  # 0=PG, 1=SG, 2=SF, 3=PF, 4=C
            "jersey": 1,
            "height": "6'1\"",
            "weight": "185",
            "age": 20,
            "rating": 85,  # Overall rating (0-99)
            "stats": {
                "ppg": 15.5,      # Points per game
                "rpg": 5.2,       # Rebounds per game
                "apg": 3.8,       # Assists per game
                "fg_pct": 0.465,  # Field goal percentage
                "three_pct": 0.385, # 3-point percentage
                "ft_pct": 0.820,   # Free throw percentage
                "spg": 1.8,        # Steals per game
                "bpg": 0.4         # Blocks per game
            }
        },
        # Add more players...
    ],
}
```

### Step 3: Run the Update Script

```bash
python3 scripts/update_all_rosters.py NBA_CAREER_Y1_2025_SAVE_FILE_09.json
```

## Current 2025-26 Roster Data

The script currently includes real 2025-26 roster data for:
- **Kansas Jayhawks**: Darryn Peterson (freshman standout)
- **Purdue Boilermakers**: Braden Smith (preseason All-American)
- **Duke Blue Devils**: Cooper Flagg, Khaman Maluach

## Teams That Need 2025-26 Rosters

Most teams currently use generated realistic rosters. To add real rosters:

1. Research the team's current 2025-26 roster
2. Gather player stats from the current season
3. Add to `REAL_ROSTERS` dictionary
4. Run the update script

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

## Notes

- Attributes are automatically calculated from stats
- Ratings are calculated based on performance
- Teams without real roster data get realistic generated rosters
- All rosters maintain 10-11 players per team

