# VSCode Family Switcher

English | [中文](README-ZH.md)

A VSCode extension that helps you quickly preview and switch fonts.

## Why This Extension?

Have you ever encountered these issues when installing a new font:
- Don't know how the font looks in VSCode
- Font names are too long or too technical to remember
- Want to try different fonts but need to modify settings manually
- Want to set different fonts for editor and terminal

This extension is designed to solve these problems. It allows you to:
- Quickly preview all available fonts in your system
- See font effects in real-time
- Easily switch fonts for both editor and terminal
- Manage font whitelist to filter out unused fonts

## Features

- 🎨 Real-time Preview: See font effects immediately when selecting
- 🔄 Multiple Font Support: Set different fonts for editor and terminal
- 📝 Font Positions: Support 5 fallback font positions
- ⚫ Blacklist: Set font whitelist to filter out unused fonts
- 🔍 Search Support: Quickly find the font you want
- 💾 Persistent Settings: Settings are saved and persist after VSCode restart

### Font Management
- **Switch Font Family**: Quickly change fonts for your editor with real-time preview.
- **Switch Terminal Font Family**: Change font family for the integrated terminal.
- **Manage Font Whitelist**: Create a custom list of your favorite fonts for quicker access.

## Usage

### Loading Fonts
1. Run the command **VFS: Load and Cache Fonts** from the command palette.
2. Wait for the fonts to load (a progress notification will be displayed).
3. Once loaded, you can quickly access your fonts for other operations.

### Switch Editor Font

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Type "VFS: Switch Font Family"
3. Select font position (Primary to Quinary)
4. Choose or search for desired font in the list
5. Preview effect in real-time
6. Press Enter to confirm

### Switch Terminal Font

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Type "VFS: Switch Terminal Font Family"
3. Select font position
4. Choose or search for desired font in the list
5. Preview effect in real-time
6. Press Enter to confirm

### Manage Font Whitelist

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Type "VFS: Manage Font Whitelist"
3. Use Space key to select fonts to include in whitelist
4. Press Enter to confirm

## Configuration

<!-- configs -->

| Key             | Description                                            | Type    | Default |
| --------------- | ------------------------------------------------------ | ------- | ------- |
| `vfs.whitelist` | List of font families to include in the font selection | `array` | `[]`    |
| `vfs.fontCache` | Cached list of font families                           | `array` | `[]`    |

<!-- configs -->

## Commands
<!-- commands -->

| Command                                   | Title                            |
| ----------------------------------------- | -------------------------------- |
| `familySwitcher.switchFontFamily`         | VFS: Switch Font Family          |
| `familySwitcher.switchTerminalFontFamily` | VFS: Switch Terminal Font Family |
| `familySwitcher.manageFontWhitelist`      | VFS: Manage Font Whitelist       |
| `familySwitcher.loadFonts`                | VFS: Load and Cache Fonts        |

<!-- commands -->

## Notes

- Font preview is real-time, you can cancel selection if the effect is not ideal
- Only whitelisted fonts will appear in the font selection list
- Editor and terminal font settings are independent

## Contributing

Issues and Pull Requests are welcome!

## License

MIT
