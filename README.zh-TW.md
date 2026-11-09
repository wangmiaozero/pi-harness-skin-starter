# Pi-Harness 自訂皮膚範本

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

這是一個可交給 Codex 或 Pi 直接生成，完成後可匯入 [Pi-Harness](https://github.com/wangmiaozero/pi-harness) 的獨立皮膚專案。Skin Protocol v1 的導入方式保持不變。獨立的 Theme / Pet npm 包與遷移命令見 [README.md](README.md)。

## 快速開始

1. 將此儲存庫作為範本使用，或下載並解壓縮。
2. 使用 Codex 或 Pi 開啟專案目錄。
3. 複製下方提示詞，將最後一行替換成你想要的主題後送出。
4. AI 完成並驗證後，在 Pi-Harness 開啟「設定 → 主題 → 匯入皮膚」，然後選擇專案目錄。

## 一鍵複製提示詞

點選程式碼區塊右上角的複製按鈕：

```text
請在目前專案中生成一套可直接匯入 Pi-Harness 的完整自訂皮膚。

執行要求：
1. 先完整閱讀 AGENTS.md、SKIN_BRIEF.md、skin.schema.json 和 pi-harness-skin.json。
2. 只修改目前的皮膚專案，不要修改 Pi-Harness 主程式，也不要在專案外建立檔案。
3. 生成以下資源：
   - assets/wallpaper.webp：16:9 應用程式桌布，需確保半透明面板上的文字清晰可讀。
   - assets/portrait.webp：透明背景的直式角色圖，四周保留足夠安全邊界；不需要角色時可省略。
   - assets/preview.webp：16:10 主題卡片預覽圖，必須準確反映最終皮膚。
4. 依圖片同步完善 pi-harness-skin.json：設定唯一的 kebab-case id、名稱、版本、明暗模式、資源相對路徑和完整色彩權杖。
5. 圖片只能使用 PNG、JPEG 或 WebP，單一檔案必須小於 12 MiB；禁止外部連結、SVG、CSS、JavaScript、HTML、字型和可執行檔。
6. 完成後依 skin.schema.json 驗證專案，確認所有資源存在且參照路徑正確，並輸出最終檔案清單與驗證結果。

我的主題需求：雪中的大明宮廷風格，採用朱紅、墨黑與鎏金配色，人物為莊重克制的明代官員；不要現代建築、霓虹燈或賽博龐克元素。
```

只需改寫最後一行「我的主題需求」。更詳細的設計限制也可直接填入 `SKIN_BRIEF.md`。

## AI 應產出的檔案

```text
pi-harness-skin.json
assets/
├── wallpaper.webp
├── portrait.webp
└── preview.webp
```

- `wallpaper.webp`：16:9 應用程式桌布。
- `portrait.webp`：透明背景的直式角色圖，可選。
- `preview.webp`：16:10 主題選擇卡片預覽圖。
- `pi-harness-skin.json`：皮膚中繼資料、資源路徑和色彩權杖。

## 匯入皮膚

1. 啟動 Pi-Harness。
2. 進入「設定 → 主題」。
3. 點選「匯入皮膚」。
4. 選擇包含 `pi-harness-skin.json` 的專案目錄。
5. 點選新增的自訂皮膚卡片以啟用。

## 更新皮膚

保持 `pi-harness-skin.json` 中的 `id` 不變。修改圖片、色彩或版本號後，再次匯入同一專案目錄，Pi-Harness 會安全地取代已安裝的副本。

## 清單範例

```json
{
  "$schema": "./skin.schema.json",
  "schemaVersion": 1,
  "id": "my-custom-skin",
  "name": "我的自訂外觀",
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

完整欄位限制請參閱 `skin.schema.json`。`id` 只能包含小寫字母、數字和連字號；發布後不要修改，否則 Pi-Harness 會將其視為另一套皮膚。

## 安全與資源限制

- 僅支援專案內的 PNG、JPEG 和 WebP。
- 單一圖片必須小於 12 MiB。
- 資源路徑必須是相對路徑，不得包含 `..`、使用絕對路徑或透過符號連結指向專案外部。
- 不支援外部 CSS、JavaScript、SVG、HTML、字型和網路 URL。
- Pi-Harness 只會複製通過驗證的清單與點陣圖，不會執行皮膚專案中的程式碼。
