# Modèle de skin personnalisé Pi-Harness

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

Ce projet de skin autonome peut être confié à Codex ou Pi, puis importé directement dans [Pi-Harness](https://github.com/wangmiaozero/pi-harness). L’import Skin Protocol v1 reste disponible. Les paquets npm Theme / Pet et la migration sont décrits dans [README.md](README.md).

## Démarrage rapide

1. Utilisez ce dépôt comme modèle, ou téléchargez-le et décompressez-le.
2. Ouvrez le dossier du projet avec Codex ou Pi.
3. Copiez le prompt ci-dessous, remplacez sa dernière ligne par le thème souhaité, puis envoyez-le.
4. Une fois la génération et la validation terminées, ouvrez **Paramètres → Thème → Importer un thème** dans Pi-Harness et sélectionnez le dossier du projet.

## Prompt prêt à copier

Utilisez le bouton de copie situé en haut à droite du bloc de code :

```text
Crée dans le projet actuel un skin personnalisé complet, directement importable dans Pi-Harness.

Exigences :
1. Commence par lire intégralement AGENTS.md, SKIN_BRIEF.md, skin.schema.json et pi-harness-skin.json.
2. Modifie uniquement le projet de skin actuel. Ne modifie pas l’application Pi-Harness et ne crée aucun fichier en dehors de ce projet.
3. Génère les ressources suivantes :
   - assets/wallpaper.webp : fond d’application 16:9 maintenant le texte lisible sur les panneaux translucides.
   - assets/portrait.webp : portrait vertical sur fond transparent, avec des marges de sécurité généreuses ; à omettre si le design ne comporte pas de personnage.
   - assets/preview.webp : aperçu 16:10 de la carte de thème, représentant fidèlement le skin final.
4. Mets pi-harness-skin.json en cohérence avec les images : définis un id unique en kebab-case, le nom, la version, l’apparence claire/sombre, les chemins relatifs des ressources et tous les jetons de couleur.
5. Les images doivent être au format PNG, JPEG ou WebP et chaque fichier doit faire moins de 12 MiB. N’utilise pas d’URL distante, de SVG, CSS, JavaScript, HTML, police ou fichier exécutable.
6. Une fois terminé, valide le projet avec skin.schema.json, vérifie que chaque ressource existe au chemin référencé, puis indique la liste finale des fichiers et les résultats de validation.

Mon thème : une cour impériale Ming sous la neige, en rouge vermillon, noir d’encre et or, avec un dignitaire Ming solennel et sobre ; sans architecture moderne, néons ni éléments cyberpunk.
```

Seule la dernière ligne `Mon thème` doit être réécrite. Vous pouvez aussi détailler les contraintes graphiques dans `SKIN_BRIEF.md`.

## Fichiers attendus

```text
pi-harness-skin.json
assets/
├── wallpaper.webp
├── portrait.webp
└── preview.webp
```

- `wallpaper.webp` : fond d’application 16:9.
- `portrait.webp` : portrait vertical facultatif sur fond transparent.
- `preview.webp` : aperçu 16:10 de la carte de sélection du thème.
- `pi-harness-skin.json` : métadonnées du skin, chemins des ressources et jetons de couleur.

## Importer le skin

1. Lancez Pi-Harness.
2. Ouvrez **Paramètres → Thème**.
3. Cliquez sur **Importer un thème**.
4. Sélectionnez le dossier du projet contenant `pi-harness-skin.json`.
5. Sélectionnez la nouvelle carte de skin personnalisé pour l’activer.

## Mettre à jour le skin

Conservez l’`id` de `pi-harness-skin.json` inchangé. Après avoir modifié les images, les couleurs ou le numéro de version, importez à nouveau le même dossier. Pi-Harness remplacera en toute sécurité la copie installée.

## Exemple de manifeste

```json
{
  "$schema": "./skin.schema.json",
  "schemaVersion": 1,
  "id": "my-custom-skin",
  "name": "Mon skin personnalisé",
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

Consultez `skin.schema.json` pour toutes les contraintes. L’`id` ne peut contenir que des lettres minuscules, des chiffres et des tirets. Ne le modifiez pas après publication, sinon Pi-Harness considérera le résultat comme un autre skin.

## Sécurité et limites des ressources

- Seuls les fichiers PNG, JPEG et WebP présents dans le projet sont pris en charge.
- Chaque image doit faire moins de 12 MiB.
- Les chemins doivent être relatifs et ne peuvent pas contenir `..`, être absolus ou pointer hors du projet via un lien symbolique.
- Les CSS, JavaScript, SVG, HTML, polices et URL réseau externes ne sont pas pris en charge.
- Pi-Harness copie uniquement les manifestes et images bitmap validés ; aucun code du projet de skin n’est exécuté.
