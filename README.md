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
- Manage font blacklist to filter out unused fonts

## Features

- 🎨 Real-time Preview: See font effects immediately when selecting
- 🔄 Multiple Font Support: Set different fonts for editor and terminal
- 📝 Font Positions: Support 5 fallback font positions
- ⚫ Blacklist: Set font blacklist to filter out unused fonts
- 🔍 Search Support: Quickly find the font you want
- 💾 Persistent Settings: Settings are saved and persist after VSCode restart

## Usage

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

### Manage Font Blacklist

1. Open Command Palette (Cmd/Ctrl + Shift + P)
2. Type "VFS: Manage Font Blacklist"
3. Use Space key to select fonts to blacklist
4. Press Enter to confirm

## Configuration

<!-- configs -->

| Key             | Description                                              | Type    | Default |
| --------------- | -------------------------------------------------------- | ------- | ------- |
| `vfs.blacklist` | List of font families to exclude from the font selection | `array` | `[]`    |

<!-- configs -->

## Commands
<!-- commands -->

| Command                                           | Title                            |
| ------------------------------------------------- | -------------------------------- |
| `vscode-family-switcher.switchFontFamily`         | VFS: Switch Font Family          |
| `vscode-family-switcher.switchTerminalFontFamily` | VFS: Switch Terminal Font Family |
| `vscode-family-switcher.manageFontBlacklist`      | VFS: Manage Font Blacklist       |

<!-- commands -->

## Notes

- Font preview is real-time, you can cancel selection if the effect is not ideal
- Blacklisted fonts won't appear in the font selection list
- Editor and terminal font settings are independent

## Contributing

Issues and Pull Requests are welcome!

## License

MIT
