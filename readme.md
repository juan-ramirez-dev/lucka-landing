# Lucka · landing

Download page for [Lucka](https://github.com/juan-ramirez-dev/lucka), a local-first personal finance desktop app for macOS and Windows.

**Live:** [juan-ramirez-dev.github.io/lucka-landing](https://juan-ramirez-dev.github.io/lucka-landing/) · in Spanish: [`?lang=es`](https://juan-ramirez-dev.github.io/lucka-landing/?lang=es)

[![Voice entry demo: speak, Lucka understands, you review, it saves](assets/demo-voice-en.gif)](assets/demo-voice-en.mp4)

_Voice entry in four steps. [Full-quality MP4](assets/demo-voice-en.mp4) (1080p, 21 s) · [En español](assets/demo-voice-es.mp4)._

## What's on the page

- **English and Spanish.** EN/ES switch in the header. Dollars in English, pesos in Spanish.
- **Hero** with a live mock of the dashboard: expenses get recorded and the ring updates.
- **Voice entry demo** (`#voice`): the app's real flow in 4 clickable steps, with pause.
  - Speak → Whisper transcribes on-device → AI extracts records → review → save.
- **Choose your AI:** Whisper always local; Qwen on-device or your own OpenAI / Anthropic / Gemini key.
- **How it's built** (`#how-its-built`): the 100-second architecture video and a link to the code.
- **Features**, customizable widgets, and first-launch steps for unsigned builds.
- Download button picks macOS or Windows from the user agent.

## Tech stack

| Layer     | Tech                                                 |
| --------- | ---------------------------------------------------- |
| Page      | Plain HTML, CSS and JS. No build, no dependencies    |
| Languages | `i18n.js`: English base HTML + Spanish dictionary    |
| Design    | Same tokens as the app (copy of `globals.css`)       |
| Hosting   | GitHub Pages, deployed by GitHub Actions on `main`   |
| Downloads | Fixed-name assets on the app's latest GitHub Release |

## Engineering highlights

- **Mocks, not screenshots.** The dashboard and voice demo are HTML, so they stay sharp at any size and change with a text edit, in both languages.
- **Timeline as a pure function.** The voice demo is `render(t)`: pause, seek and step jumps just change `t`. CSS transitions do the smoothing.
- **No flash of the wrong language.** A tiny head script picks the language (`?lang=`, last choice, browser) and hides the page until `i18n.js` has translated it.
- **Cheap when idle.** Animations only run while visible and the tab is active.
- **Accessible by default.** Reduced motion turns each step into a still frame. Without JS the page is complete (in English). The mock is `aria-hidden`; the steps tell the same story as text.
- **Release-proof links.** `releases/latest/download/Lucka-macos.dmg` and `Lucka-windows-setup.exe` never change between versions.

## Project notes

- Colors: tokens in the `<style>` of `index.html`. `styles.css` only uses `var(--token)`.
- Texts: English in `index.html` and `i18n.js`, Spanish in `i18n.js`. Every text has a `data-i18n*` key.
- Demo amounts are dollars; in Spanish the same number means thousands of pesos (`$45` → `$ 45.000`).
- Voice demo timings live in `main.js`. If the flow changes in the app, update them there and re-record.
- The architecture video is a copy of the app repo's `docs/architecture-video/lucka-architecture.mp4`. Re-copy it when that one changes.
- Pending screenshots: `assets/macos-warning.png`, `assets/windows-warning.png` → "First launch" section.

## Recording the demo videos

```bash
node --experimental-websocket scripts/record-demo.mjs en   # assets/demo-voice-en.mp4 + .gif
node --experimental-websocket scripts/record-demo.mjs es   # assets/demo-voice-es.mp4 + .gif
```

- Needs Google Chrome and ffmpeg. No npm packages: it talks to Chrome over the DevTools protocol.
- `?record` stops the demo's own loop. The script seeks it frame by frame at 30 fps.
- Every CSS transition and animation is paused and moved by hand, so the video matches the live page on any machine.

## Run locally

Open `index.html` in a browser. Add `?lang=es` for Spanish.

## License

MIT
