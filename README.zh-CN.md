# Pi-Harness 自定义皮肤模板

<p align="center">
  <a href="README.md">English</a> ·
  <a href="README.zh-CN.md">简体中文</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="README.ja-JP.md">日本語</a> ·
  <a href="README.ko-KR.md">한국어</a> ·
  <a href="README.ru-RU.md">Русский</a> ·
  <a href="README.fr-FR.md">Français</a> ·
  <a href="README.de-DE.md">Deutsch</a>
</p>

这是一个可交给 Codex 或 Pi 直接生成、完成后可被 [Pi-Harness](https://github.com/wangmiaozero/pi-harness) 导入的独立皮肤项目。

## 最快使用方式

1. 使用本仓库作为模板，或下载并解压本仓库。
2. 用 Codex 或 Pi 打开项目目录。
3. 复制下面的提示词，把最后一行替换成你的主题需求后发送。
4. AI 完成并校验后，在 Pi-Harness 中打开“设置 → 主题 → 导入皮肤”，选择项目目录。

## 一键复制提示词

点击代码块右上角的复制按钮：

```text
请在当前项目中生成一套可直接导入 Pi-Harness 的完整自定义皮肤。

执行要求：
1. 先完整阅读 AGENTS.md、SKIN_BRIEF.md、skin.schema.json 和 pi-harness-skin.json。
2. 只修改当前皮肤项目，不要修改 Pi-Harness 主程序，也不要在项目外创建文件。
3. 生成以下资源：
   - assets/wallpaper.webp：16:9 应用壁纸，需保证半透明面板上的文字仍清晰可读。
   - assets/portrait.webp：透明背景竖版角色图，四周保留安全边距；不需要角色时可以省略。
   - assets/preview.webp：16:10 主题卡片预览图，必须准确反映最终皮肤效果。
4. 根据图片同步完善 pi-harness-skin.json：设置唯一的 kebab-case id、名称、版本、明暗模式、资源相对路径和完整颜色令牌。
5. 图片只能使用 PNG、JPEG 或 WebP，单个文件不得超过 12 MiB；禁止外部链接、SVG、CSS、JavaScript、HTML、字体和可执行文件。
6. 完成后按 skin.schema.json 校验清单，检查全部资源存在且路径正确，并输出最终文件清单与校验结果。

我的主题需求：雪中大明宫廷风格，朱红、墨黑与鎏金配色，人物为明代官员，庄重克制；不要现代建筑、霓虹灯、赛博朋克元素。
```

只需要改写最后一行“我的主题需求”。更详细的设计约束也可以直接填写到 `SKIN_BRIEF.md`。

## AI 应产出的文件

```text
pi-harness-skin.json
assets/
├── wallpaper.webp
├── portrait.webp
└── preview.webp
```

- `wallpaper.webp`：16:9 应用壁纸。
- `portrait.webp`：透明背景竖版角色图，可选。
- `preview.webp`：16:10 主题选择卡片预览图。
- `pi-harness-skin.json`：皮肤元数据、资源路径和颜色令牌。

## 导入皮肤

1. 启动 Pi-Harness。
2. 进入“设置 → 主题”。
3. 点击“导入皮肤”。
4. 选择包含 `pi-harness-skin.json` 的项目目录。
5. 点击新增的自定义皮肤卡片启用。

## 更新皮肤

保持 `pi-harness-skin.json` 中的 `id` 不变，修改图片、颜色或版本号后，再次导入同一项目目录。Pi-Harness 会安全替换已安装副本。

## 清单示例

```json
{
  "$schema": "./skin.schema.json",
  "schemaVersion": 1,
  "id": "my-custom-skin",
  "name": "我的自定义皮肤",
  "version": "1.0.0",
  "appearance": "dark",
  "assets": {
    "preview": "assets/preview.webp",
    "wallpaper": "assets/wallpaper.webp",
    "portrait": "assets/portrait.webp"
  },
  "tokens": {
    "window": "#111318",
    "workspace": "#1b1f27",
    "textPrimary": "#f3f5f7",
    "accent": "#6f9df4"
  }
}
```

完整字段约束见 `skin.schema.json`。`id` 只能使用小写字母、数字和连字符；发布后不要修改，否则会被识别为另一套皮肤。

## 安全与资源限制

- 仅支持项目内的 PNG、JPEG、WebP。
- 单个图片不能超过 12 MiB。
- 资源路径必须是相对路径，不能使用 `..`、绝对路径或指向项目外部的符号链接。
- 不支持外部 CSS、JavaScript、SVG、HTML、字体和网络 URL。
- Pi-Harness 只复制通过校验的清单与位图，不会执行皮肤项目中的代码。

## 主题包与桌宠包

仓库根目录继续使用 Skin Protocol v1。`pi-harness-skin.json` 和 `skin.schema.json` 仍通过「设置 → 主题 → 导入皮肤」导入。Theme Pack Protocol v1 不能保存完整颜色令牌，因此主题包不能替代这次导入。

```bash
node scripts/create-theme.mjs my-theme --out ../my-theme
node scripts/create-pet.mjs my-pet --out ../my-pet
node scripts/migrate-skin.mjs . ../theme-my-custom-skin
```

`migrate-skin.mjs` 只读取皮肤并写出新目录，不修改 `pi-harness-skin.json`。默认包名是 `@example/theme-<id>`。`--official` 只会把包名改成 `@piharness/...`，不会获得发布权限。Market 只接受完整匹配 `^@piharness/(theme|pet)-[a-z0-9][a-z0-9-]*$` 的包名。

模板在 `templates/theme` 和 `templates/pet`，Skills 在 `skills/`。命令和令牌限制见 `docs/DEVELOPMENT.md`、`docs/MIGRATION.md`。

没有 `piHarness.partOf` 的包是主包。子包把这个字段设成主包名。示例是 `examples/split-pet` 和 `examples/split-pet-part`。

