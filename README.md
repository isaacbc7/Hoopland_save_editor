# Hoopland Save Editor

A comprehensive, user-friendly JSON save editor specifically designed for Hoopland game saves. This editor provides an intuitive interface for editing all aspects of your Hoopland save files, including game modes, drafts, teams, player stats, attributes, and skills.

## Features

- 🎮 **Complete Save File Editing**: Edit all game modes, drafts, teams, and player data
- 👤 **Player Management**: Edit player stats, attributes, and skills with an intuitive interface
- 🎯 **Skill System**: Manage up to 4 skills per category (Finishing, Shooting, Creating, Defense) for each player
- 📊 **Attribute Editing**: Easy-to-use editors for all player attributes organized by category
- 🎨 **Beautiful UI/UX**: Modern, clean interface that makes editing JSON saves simple and clear
- 💾 **Save & Load**: Load Hoopland save files (even without .json extension) and export your changes

## 🌐 Live Demo

Visit the live editor at: **https://isaacbc7.github.io/Hoopland_save_editor/**

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Deployment

This project is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

To enable GitHub Pages:
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The site will be available at `https://YOUR_USERNAME.github.io/Hoopland_save_editor/`

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Finding Your Hoopland Save Files

### Windows
1. Press `Win + R` to open Run dialog
2. Type: `%appdata%` and press Enter
3. Navigate back to `AppData` folder
4. Go to: `LocalLow\Hoop Land\SaveGames`
5. Full path: `C:\Users\YourUsername\AppData\LocalLow\Hoop Land\SaveGames`

**Note**: The AppData folder is hidden by default. Enable "Show hidden files" in File Explorer settings.

### Mac
- `~/Library/Application Support/Hoop Land/SaveGames`
- Or: `~/Library/Application Support/unity.Koality Game.Hoop Land`

### Linux
- `~/.config/unity3d/Koality Game/Hoop Land/SaveGames`
- Or: `~/.local/share/Hoop Land/SaveGames`

**Important**: Hoopland save files don't have a `.json` extension but are JSON formatted. You can still load them in this editor.

## Usage

1. **Load a Save File**: Click "Choose File" and select your Hoopland save file (note: Hoopland saves don't have .json extension but are JSON formatted)

2. **Navigate**: Use the sidebar to navigate between different sections:
   - Overview: See a summary of your save file
   - Players: Edit player stats, attributes, and skills
   - Game Modes: Edit game mode data
   - Drafts: Edit draft information
   - Teams: Edit team data

3. **Edit Players**:
   - Select a player from the player list
   - Edit basic information, stats, and attributes
   - Manage skills in each category (Finishing, Shooting, Creating, Defense)
   - Each category supports up to 4 skills

4. **Save Your Changes**: Click "Download Save" to download the modified save file

## Project Structure

```
src/
  components/       # React components
    FileLoader.tsx  # File loading interface
    PlayerEditor.tsx # Player editing interface
    SkillEditor.tsx # Skill management component
    GameModeEditor.tsx # Game mode editor
  types/            # TypeScript type definitions
    hoopland.ts     # Hoopland-specific types
  utils/            # Utility functions
    fileHandler.ts  # File loading/saving utilities
    skills.ts       # Skill definitions and utilities
  App.tsx           # Main application component
  main.tsx          # Application entry point
  index.css         # Global styles
```

## Skill System

The editor supports editing skills for four categories:
- **Finishing**: Up to 4 skills
- **Shooting**: Up to 4 skills
- **Creating**: Up to 4 skills
- **Defense**: Up to 4 skills

Skill IDs and names will be automatically populated once the save file structure is analyzed and researched.

## Notes

- Hoopland save files don't use .json extension but are JSON formatted
- The editor maintains the exact JSON structure while providing a user-friendly interface
- All changes are made in-memory until you download the modified save file

## Future Enhancements

- Complete skill ID/name mappings based on save file analysis
- Enhanced draft and team editors
- Validation and error checking
- Backup functionality
- Undo/redo support

## License

ISC
