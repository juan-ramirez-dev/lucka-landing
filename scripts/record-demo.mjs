// Records the voice demo (#voice) to assets/demo-voice-<lang>.mp4 and .gif.
//
//   node --experimental-websocket scripts/record-demo.mjs en
//   node --experimental-websocket scripts/record-demo.mjs es
//
// Needs Google Chrome and ffmpeg. CHROME=/path/to/chrome overrides the macOS default.
//
// Frames run on a virtual clock: every CSS transition and animation is paused and moved by
// hand, so the video looks exactly like the live page, whatever the machine's speed.
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const lang = process.argv[2]
if (lang !== 'en' && lang !== 'es') {
  console.error('Usage: node --experimental-websocket scripts/record-demo.mjs <en|es>')
  process.exit(1)
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const FPS = 30
const FRAME = 1000 / FPS
// A desktop-sized page, like the README video has always been.
const VIEWPORT = { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false }
const PORT = 9343

const profile = mkdtempSync(join(tmpdir(), 'lucka-record-'))
const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--no-first-run', 'about:blank'],
  { stdio: 'ignore' },
)

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function connect() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`)
      const ws = new WebSocket((await res.json()).webSocketDebuggerUrl)
      await new Promise((ok, fail) => {
        ws.onopen = ok
        ws.onerror = fail
      })
      return ws
    } catch {
      await sleep(100)
    }
  }
  throw new Error('Chrome did not start')
}

const ws = await connect()
let lastId = 0
const pending = new Map()
ws.onmessage = e => {
  const msg = JSON.parse(e.data)
  const done = msg.id && pending.get(msg.id)
  if (!done) return
  pending.delete(msg.id)
  if (msg.error) done.fail(new Error(msg.error.message))
  else done.ok(msg.result)
}
const send = (method, params = {}, sessionId) =>
  new Promise((ok, fail) => {
    const id = ++lastId
    pending.set(id, { ok, fail })
    ws.send(JSON.stringify({ id, method, params, sessionId }))
  })

const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
const page = (method, params) => send(method, params, sessionId)
const run = async expression => {
  const { result, exceptionDetails } = await page('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
  return result.value
}

await page('Page.enable')
await page('Runtime.enable')
await page('Emulation.setDeviceMetricsOverride', VIEWPORT)
await page('Page.navigate', { url: `file://${join(root, 'index.html')}?lang=${lang}&record` })
for (let i = 0; i < 200 && !(await run(`document.readyState === 'complete' && 'voiceDemo' in window`).catch(() => false)); i++) {
  await sleep(50)
}
await run('document.fonts.ready.then(() => true)')

// Only the voice section: no top bar and no lead paragraph, so it fits 16:9.
// The background blobs stay still: moving, they change every pixel and bloat the GIF.
await run(`(() => {
  const style = document.createElement('style')
  style.textContent = '.top { display: none } #voice .section-head .lead { display: none } .blob { animation: none !important }'
  document.head.append(style)
  const head = document.querySelector('#voice .section-head')
  scrollTo({ top: head.getBoundingClientRect().top + scrollY - 120, behavior: 'instant' })
})()`)
// The section slides in once it's on screen (IntersectionObserver).
await sleep(600)

// The virtual clock. getAnimations() also flushes style, so a transition started by seek()
// is caught, paused and placed at its first frame before anything is painted.
await run(`(() => {
  const starts = new Map()
  window.recordStep = ms => {
    for (const anim of document.getAnimations()) {
      if (!starts.has(anim)) {
        starts.set(anim, ms)
        anim.pause()
      }
      anim.currentTime = ms - starts.get(anim)
    }
  }
})()`)

// Let the slide-in finish before the first frame.
const WARM_UP = 2000
await run('voiceDemo.seek(0)')
for (let ms = 0; ms <= WARM_UP; ms += FRAME) await run(`recordStep(${ms})`)

const out = join(root, 'assets', `demo-voice-${lang}`)
const total = Math.round((await run('voiceDemo.end')) / FRAME)

const ffmpeg = spawn(
  'ffmpeg',
  ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
   '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${out}.mp4`],
  { stdio: ['pipe', 'inherit', 'inherit'] },
)

for (let i = 0; i < total; i++) {
  await run(`voiceDemo.seek(${i * FRAME}); recordStep(${WARM_UP + i * FRAME})`)
  const { data } = await page('Page.captureScreenshot', { format: 'png' })
  if (!ffmpeg.stdin.write(Buffer.from(data, 'base64'))) {
    await new Promise(r => ffmpeg.stdin.once('drain', r))
  }
  if (i % FPS === 0) process.stdout.write(`\r${lang}: ${Math.round((i / total) * 100)}%`)
}
ffmpeg.stdin.end()
await new Promise((ok, fail) => ffmpeg.on('close', code => (code === 0 ? ok() : fail(new Error(`ffmpeg ${code}`)))))

// GIF for the READMEs: half size, 15 fps, one palette for the whole clip.
await new Promise((ok, fail) =>
  spawn(
    'ffmpeg',
    ['-y', '-loglevel', 'error', '-i', `${out}.mp4`,
     '-vf', 'fps=15,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4',
     `${out}.gif`],
    { stdio: 'inherit' },
  ).on('close', code => (code === 0 ? ok() : fail(new Error(`ffmpeg ${code}`)))),
)

console.log(`\r${lang}: ${out}.mp4 and .gif`)
// Chrome keeps writing its profile while it quits.
const exited = new Promise(r => chrome.once('exit', r))
chrome.kill()
await exited
rmSync(profile, { recursive: true, force: true, maxRetries: 5 })
process.exit(0)
