# VSCode Family Switcher

[English](README.md) | 中文

一个帮助你快速预览和切换 VSCode 字体的扩展。

## 为什么需要这个扩展？

当你安装了一个新字体后，你是否遇到过这些困扰：
- 不知道这个字体在 VSCode 中显示效果如何
- 字体名称太长或太专业，记不住
- 想尝试不同的字体，但需要手动修改设置
- 想为编辑器和终端设置不同的字体

这个扩展就是为了解决这些问题而生的。它让你能够：
- 快速预览系统中所有可用的字体
- 实时查看字体效果
- 轻松切换编辑器和终端的字体
- 管理字体黑名单，过滤掉不常用的字体
- 可以设置字体白名单，只显示常用的字体

## 功能

### 字体管理
- **切换编辑器字体**: 快速更改编辑器字体，实时预览效果。
- **切换终端字体**: 更改集成终端的字体。
- **管理字体白名单**: 创建您喜爱的字体列表，以便更快地访问。

## 功能特点

- 🎨 实时预览：选择字体时立即看到效果
- 🔄 多字体支持：可以为编辑器和终端设置不同的字体
- 📝 字体位置：支持设置 5 个备选字体位置
- 🔍 搜索支持：快速找到想要的字体
- 💾 配置持久化：设置会被保存，重启 VSCode 后仍然有效

## 使用方法

### 加载字体
1. 从命令面板运行 **VFS: Load and Cache Fonts** 命令。
2. 等待字体加载完成（会显示进度通知）。
3. 加载完成后，您可以在其他操作中快速访问这些字体。

### 切换编辑器字体

1. 打开命令面板 (Cmd/Ctrl + Shift + P)
2. 输入 "VFS: Switch Font Family"
3. 选择要设置的字体位置（Primary 到 Quinary）
4. 在字体列表中选择或搜索想要的字体
5. 实时预览效果
6. 按 Enter 确认选择

### 切换终端字体

1. 打开命令面板 (Cmd/Ctrl + Shift + P)
2. 输入 "VFS: Switch Terminal Font Family"
3. 选择要设置的字体位置
4. 在字体列表中选择或搜索想要的字体
5. 实时预览效果
6. 按 Enter 确认选择

### 管理字体白名单

1. 打开命令面板 (Cmd/Ctrl + Shift + P)
2. 输入 "VFS: Manage Font Whitelist"
3. 使用空格键选择要加入白名单的字体
4. 按 Enter 确认选择

### 管理字体黑名单

1. 打开命令面板 (Cmd/Ctrl + Shift + P)
2. 输入 "VFS: Manage Font Blacklist"
3. 使用空格键选择要加入黑名单的字体
4. 按 Enter 确认选择

## 配置说明

<!-- configs -->

| Key             | Description                                            | Type    | Default |
| --------------- | ------------------------------------------------------ | ------- | ------- |
| `vfs.whitelist` | List of font families to include in the font selection | `array` | `[]`    |
| `vfs.fontCache` | Cached list of font families                           | `array` | `[]`    |

<!-- configs -->

## 命令

<!-- commands -->

| Command                                   | Title                            |
| ----------------------------------------- | -------------------------------- |
| `familySwitcher.switchFontFamily`         | VFS: Switch Font Family          |
| `familySwitcher.switchTerminalFontFamily` | VFS: Switch Terminal Font Family |
| `familySwitcher.manageFontWhitelist`      | VFS: Manage Font Whitelist       |
| `familySwitcher.loadFonts`                | VFS: Load and Cache Fonts        |

<!-- commands -->

## 注意事项

- 字体预览是实时的，如果效果不理想可以随时取消选择
- 黑名单中的字体不会出现在字体选择列表中
- 只有白名单中的字体会出现在字体选择列表中
- 编辑器和终端的字体设置是独立的，可以分别设置

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
