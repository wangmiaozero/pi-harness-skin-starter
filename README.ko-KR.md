# Pi-Harness 커스텀 스킨 스타터

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

Codex 또는 Pi로 생성한 뒤 [Pi-Harness](https://github.com/wangmiaozero/pi-harness)에 바로 가져올 수 있는 독립형 스킨 프로젝트입니다.

## 빠른 시작

1. 이 저장소를 템플릿으로 사용하거나 다운로드하여 압축을 풉니다.
2. Codex 또는 Pi에서 프로젝트 디렉터리를 엽니다.
3. 아래 프롬프트를 복사하고 마지막 줄을 원하는 테마로 바꾼 뒤 전송합니다.
4. AI가 생성과 검증을 마치면 Pi-Harness에서 **설정 → 테마 → 스킨 가져오기**를 열고 프로젝트 디렉터리를 선택합니다.

## 복사해서 실행할 프롬프트

코드 블록 오른쪽 위의 복사 버튼을 사용하세요.

```text
현재 프로젝트에 Pi-Harness로 바로 가져올 수 있는 완성된 커스텀 스킨을 생성해 주세요.

요구 사항:
1. 먼저 AGENTS.md, SKIN_BRIEF.md, skin.schema.json, pi-harness-skin.json을 모두 읽으세요.
2. 현재 스킨 프로젝트만 수정하세요. Pi-Harness 애플리케이션을 수정하거나 프로젝트 밖에 파일을 만들지 마세요.
3. 다음 리소스를 생성하세요:
   - assets/wallpaper.webp: 반투명 패널 위의 텍스트가 선명하게 보이는 16:9 애플리케이션 배경화면.
   - assets/portrait.webp: 투명 배경과 넉넉한 안전 여백을 가진 세로형 캐릭터 이미지. 캐릭터가 필요 없으면 생략할 수 있습니다.
   - assets/preview.webp: 최종 스킨을 정확히 보여 주는 16:10 테마 카드 미리보기.
4. 이미지에 맞춰 pi-harness-skin.json을 업데이트하세요. 고유한 kebab-case id, 이름, 버전, 밝은/어두운 모드, 상대 리소스 경로, 전체 색상 토큰을 설정하세요.
5. 이미지는 PNG, JPEG 또는 WebP만 사용하고 각 파일은 12 MiB 미만이어야 합니다. 외부 URL, SVG, CSS, JavaScript, HTML, 글꼴, 실행 파일은 금지합니다.
6. 완료 후 skin.schema.json에 따라 프로젝트를 검증하고, 참조된 모든 리소스가 올바른 경로에 있는지 확인한 다음 최종 파일 목록과 검증 결과를 보고하세요.

원하는 테마: 눈 덮인 명나라 궁정, 주홍색·먹색·금빛 배색, 위엄 있고 절제된 명나라 관리. 현대 건축, 네온 조명, 사이버펑크 요소는 제외.
```

마지막 `원하는 테마` 줄만 다시 작성하면 됩니다. 더 자세한 디자인 제약은 `SKIN_BRIEF.md`에 적을 수 있습니다.

## 생성 결과

```text
pi-harness-skin.json
assets/
├── wallpaper.webp
├── portrait.webp
└── preview.webp
```

- `wallpaper.webp`: 16:9 애플리케이션 배경화면.
- `portrait.webp`: 투명 배경의 세로형 캐릭터 이미지(선택 사항).
- `preview.webp`: 16:10 테마 선택 카드 미리보기.
- `pi-harness-skin.json`: 스킨 메타데이터, 리소스 경로, 색상 토큰.

## 스킨 가져오기

1. Pi-Harness를 실행합니다.
2. **설정 → 테마**를 엽니다.
3. **스킨 가져오기**를 클릭합니다.
4. `pi-harness-skin.json`이 들어 있는 프로젝트 디렉터리를 선택합니다.
5. 새 커스텀 스킨 카드를 선택해 활성화합니다.

## 스킨 업데이트

`pi-harness-skin.json`의 `id`를 변경하지 마세요. 이미지, 색상 또는 버전 번호를 수정한 뒤 같은 프로젝트 디렉터리를 다시 가져오면 Pi-Harness가 설치된 사본을 안전하게 교체합니다.

## 매니페스트 예시

```json
{
  "$schema": "./skin.schema.json",
  "schemaVersion": 1,
  "id": "my-custom-skin",
  "name": "나의 커스텀 스킨",
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

전체 필드 제약은 `skin.schema.json`을 참고하세요. `id`에는 소문자, 숫자, 하이픈만 사용할 수 있습니다. 공개 후 변경하면 다른 스킨으로 인식되므로 변경하지 마세요.

## 보안 및 리소스 제한

- 프로젝트 내부의 PNG, JPEG, WebP만 지원합니다.
- 각 이미지는 12 MiB 미만이어야 합니다.
- 리소스 경로는 상대 경로여야 하며 `..`, 절대 경로 또는 프로젝트 밖을 가리키는 심볼릭 링크를 사용할 수 없습니다.
- 외부 CSS, JavaScript, SVG, HTML, 글꼴, 네트워크 URL은 지원하지 않습니다.
- Pi-Harness는 검증된 매니페스트와 비트맵 리소스만 복사하며 스킨 프로젝트의 코드를 실행하지 않습니다.
