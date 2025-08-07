# VSCode Family Switcher

English | [中文](README-ZH.md)

A VSCode extension for quickly previewing and switching font families with favorites management.

## Features

- **Quick Font Switching**: Switch between font families for editor and terminal with real-time preview
- **Font Favorites**: Create a curated list of your preferred fonts for faster access
- **Multiple Font Positions**: Support up to 5 fallback font positions
- **Smart Filtering**: Only show favorited fonts in selection list when favorites are configured
- **Persistent Settings**: All configurations are saved and persist across VSCode sessions

## Usage

### Initial Setup

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Run `VFS: Load and Cache Fonts` to scan and cache system fonts
3. Wait for the loading process to complete

### Switch Font Family

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Run `VFS: Switch Font Family` or `VFS: Switch Terminal Font Family`
3. Select font position (Primary to Quinary)
4. Choose desired font from the list
5. Preview changes in real-time and press Enter to confirm

### Manage Font Favorites

1. Open Command Palette (`Cmd/Ctrl + Shift + P`)
2. Run `VFS: Manage Font Favorites`
3. Use Space key to select/deselect fonts
4. Press Enter to save changes

Alternatively, use the sidebar views:
- **Favorite Fonts**: Shows your curated font list
- **All Fonts**: Shows all cached fonts with context menu actions

## Configuration

| Setting | Description | Type | Default |
|---------|-------------|------|---------|
| `vfs.favorites` | List of font families to include in font selection | `array` | `[]` |

## Commands

| Command | Title |
|---------|-------|
| `familySwitcher.switchFontFamily` | VFS: Switch Font Family |
| `familySwitcher.switchTerminalFontFamily` | VFS: Switch Terminal Font Family |
| `familySwitcher.manageFontFavorites` | VFS: Manage Font Favorites |
| `familySwitcher.loadFonts` | VFS: Load and Cache Fonts |

## Notes

- Font preview is applied in real-time during selection
- Only favorited fonts appear in selection list when favorites are configured
- Editor and terminal font settings are independent
- Font cache is stored globally and persists between sessions

## License

MIT
