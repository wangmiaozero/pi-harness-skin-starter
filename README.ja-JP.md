# Pi-Harness カスタムスキン・スターター

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

Codex または Pi に生成を依頼し、完成後に [Pi-Harness](https://github.com/wangmiaozero/pi-harness) へ直接インポートできる独立したスキンプロジェクトです。

## クイックスタート

1. このリポジトリをテンプレートとして使用するか、ダウンロードして展開します。
2. Codex または Pi でプロジェクトディレクトリを開きます。
3. 下のプロンプトをコピーし、最後の行を希望するテーマに書き換えて送信します。
4. AI による生成と検証が完了したら、Pi-Harness の「設定 → テーマ → スキンを読み込む」を開き、プロジェクトディレクトリを選択します。

## コピーして実行するプロンプト

コードブロック右上のコピーボタンを使用してください。

```text
現在のプロジェクトに、Pi-Harness へ直接インポートできる完全なカスタムスキンを生成してください。

要件：
1. 最初に AGENTS.md、SKIN_BRIEF.md、skin.schema.json、pi-harness-skin.json をすべて読んでください。
2. 変更対象は現在のスキンプロジェクトだけです。Pi-Harness 本体を変更したり、プロジェクト外にファイルを作成したりしないでください。
3. 次のアセットを生成してください：
   - assets/wallpaper.webp：半透明パネル上の文字を読みやすく保つ、16:9 のアプリ壁紙。
   - assets/portrait.webp：背景が透明で、安全な余白を十分に確保した縦長のキャラクター画像。キャラクターが不要な場合は省略可能です。
   - assets/preview.webp：完成したスキンを正確に表す、16:10 のテーマカード用プレビュー。
4. 画像に合わせて pi-harness-skin.json を更新してください。一意な kebab-case の id、名前、バージョン、ライト／ダーク、相対アセットパス、完全なカラートークンを設定します。
5. 画像形式は PNG、JPEG、WebP のみ、各ファイルは 12 MiB 未満にしてください。外部 URL、SVG、CSS、JavaScript、HTML、フォント、実行可能ファイルは禁止です。
6. 完了後、skin.schema.json に照らして検証し、参照されたすべてのアセットが正しいパスに存在することを確認して、最終ファイル一覧と検証結果を報告してください。

希望するテーマ：雪に覆われた明代の宮廷。朱色、墨色、金箔色を使い、威厳があり抑制された明代の官僚を描く。現代建築、ネオン、サイバーパンク要素は使用しない。
```

最後の「希望するテーマ」の行だけを書き換えれば利用できます。より詳しいデザイン条件は `SKIN_BRIEF.md` に記入できます。

## 生成されるファイル

```text
pi-harness-skin.json
assets/
├── wallpaper.webp
├── portrait.webp
└── preview.webp
```

- `wallpaper.webp`：16:9 のアプリ壁紙。
- `portrait.webp`：背景が透明な縦長キャラクター画像（任意）。
- `preview.webp`：16:10 のテーマ選択カード用プレビュー。
- `pi-harness-skin.json`：スキンのメタデータ、アセットパス、カラートークン。

## スキンをインポート

1. Pi-Harness を起動します。
2. 「設定 → テーマ」を開きます。
3. 「スキンを読み込む」をクリックします。
4. `pi-harness-skin.json` を含むプロジェクトディレクトリを選択します。
5. 追加されたカスタムスキンのカードを選択して有効化します。

## スキンを更新

`pi-harness-skin.json` の `id` は変更しないでください。画像、色、バージョン番号を更新した後、同じプロジェクトディレクトリを再度インポートすると、Pi-Harness がインストール済みのコピーを安全に置き換えます。

## マニフェスト例

```json
{
  "$schema": "./skin.schema.json",
  "schemaVersion": 1,
  "id": "my-custom-skin",
  "name": "マイカスタムスキン",
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

フィールドの完全な制約は `skin.schema.json` を参照してください。`id` に使用できるのは小文字、数字、ハイフンだけです。公開後に変更すると別のスキンとして認識されるため、変更しないでください。

## セキュリティとアセットの制限

- プロジェクト内の PNG、JPEG、WebP のみ対応しています。
- 各画像は 12 MiB 未満にしてください。
- アセットパスは相対パスに限られ、`..`、絶対パス、プロジェクト外を指すシンボリックリンクは使用できません。
- 外部 CSS、JavaScript、SVG、HTML、フォント、ネットワーク URL は使用できません。
- Pi-Harness は検証済みのマニフェストとビットマップ画像だけをコピーし、スキンプロジェクト内のコードを実行しません。
