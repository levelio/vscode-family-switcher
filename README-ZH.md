# VSCode Family Switcher

[English](README.md) | 中文

一个用于快速预览和切换字体的 VSCode 扩展，支持收藏夹管理。

## 功能特点

- **快速字体切换**: 为编辑器和终端切换字体，支持实时预览
- **字体收藏夹**: 创建常用字体列表，快速访问
- **多字体位置**: 支持最多 5 个备选字体位置
- **智能过滤**: 配置收藏夹后，选择列表中只显示收藏的字体
- **设置持久化**: 所有配置自动保存，重启后保持不变

## 使用方法

### 初始设置

1. 打开命令面板 (`Cmd/Ctrl + Shift + P`)
2. 运行 `VFS: Load and Cache Fonts` 扫描并缓存系统字体
3. 等待加载完成

### 切换字体

1. 打开命令面板 (`Cmd/Ctrl + Shift + P`)
2. 运行 `VFS: Switch Font Family` 或 `VFS: Switch Terminal Font Family`
3. 选择字体位置（Primary 到 Quinary）
4. 从列表中选择想要的字体
5. 实时预览效果，按回车确认

### 管理收藏夹

1. 打开命令面板 (`Cmd/Ctrl + Shift + P`)
2. 运行 `VFS: Manage Font Favorites`
3. 使用空格键选择/取消选择字体
4. 按回车保存更改

或者使用侧边栏视图：
- **Favorite Fonts**: 显示收藏的字体列表
- **All Fonts**: 显示所有缓存的字体，带有右键菜单操作

## 配置项

| 设置项 | 说明 | 类型 | 默认值 |
|--------|------|------|--------|
| `vfs.favorites` | 在字体选择中包含的字体列表 | `array` | `[]` |

## 命令列表

| 命令 | 标题 |
|------|------|
| `familySwitcher.switchFontFamily` | VFS: Switch Font Family |
| `familySwitcher.switchTerminalFontFamily` | VFS: Switch Terminal Font Family |
| `familySwitcher.manageFontFavorites` | VFS: Manage Font Favorites |
| `familySwitcher.loadFonts` | VFS: Load and Cache Fonts |

## 注意事项

- 选择字体时会实时应用预览效果
- 配置收藏夹后，选择列表中只显示收藏的字体
- 编辑器和终端的字体设置相互独立
- 字体缓存全局存储，重启后保持不变

## 许可证

MIT
