// Main button for the visitor's OS. The other one stays as a link below.
const MAC = 'https://github.com/juan-ramirez-dev/lucka/releases/latest/download/Lucka-macos.dmg'
const WIN = 'https://github.com/juan-ramirez-dev/lucka/releases/latest/download/Lucka-windows-setup.exe'

const t = key => I18N.t(key)

const ua = navigator.userAgent
const isWindows = /Windows/i.test(ua)
const isMac = /Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)

const primary = document.getElementById('primary')
const primaryLabel = document.getElementById('primary-label')
const secondary = document.getElementById('secondary')

function paintDownload() {
  if (isWindows) {
    primary.href = WIN
    primaryLabel.textContent = t('download.windows')
    secondary.href = MAC
    secondary.textContent = t('download.otherMac')
    return
  }
  primaryLabel.textContent = t('download.mac')
  if (isMac) {
    secondary.textContent = t('download.otherWindows')
    return
  }
  document.getElementById('other').hidden = false
  secondary.href = WIN
  secondary.textContent = t('download.windows')
}

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
// ?record: the voice demo waits at 0 for scripts/record-demo.mjs to drive it.
const recording = new URLSearchParams(location.search).has('record')

// Sections that slide in on scroll.
const revealer = new IntersectionObserver(
  entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-in')
      revealer.unobserve(entry.target)
    }
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
)
document.querySelectorAll('[data-reveal]').forEach(el => revealer.observe(el))

// Only runs what's on screen, with the tab visible.
function whileVisible(el, onChange) {
  let visible = false
  const update = () => onChange(visible && !document.hidden)
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    update()
  }).observe(el)
  document.addEventListener('visibilitychange', update)
}

/* ---------- Money ---------- */

// Demo amounts are dollars. In pesos the same number means thousands: $45 → $ 45.000.
const CURRENCY = {
  en: { locale: 'en-US', currency: 'USD', scale: 1 },
  es: { locale: 'es-CO', currency: 'COP', scale: 1000 },
}

// Pesos are always whole. Dollars show cents only when there are some, like in the app.
function money(value) {
  const { locale, currency, scale } = CURRENCY[I18N.lang]
  const pesos = currency === 'COP'
  const amount = pesos ? Math.round(value * scale) : Math.round(value * 100) / 100
  const digits = pesos || Number.isInteger(amount) ? 0 : 2
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount)
}

const of = value => `${t('app.of')} ${money(value)}`

function paintAmounts() {
  for (const el of document.querySelectorAll('[data-amount]')) {
    el.textContent = `${el.dataset.sign ?? ''}${money(Number(el.dataset.amount))}`
  }
  // Avatars show the first letter of the name, which changes with the language.
  for (const row of document.querySelectorAll('.recent li')) {
    row.querySelector('.toast-avatar').textContent = row.querySelector('[data-i18n]').textContent.charAt(0)
  }
}

/* ---------- Live dashboard demo ---------- */

const C = 2 * Math.PI * 92
const COMMITTED = 1210

// The extra income closes the loop: at the end everything is back where it started.
const EVENTS = [
  { title: 'app.groceries', amount: 45 },
  { title: 'app.coffee', amount: 4.5 },
  { title: 'app.taxi', amount: 23 },
  { title: 'app.extraIncome', amount: 72.5, income: true },
]

const state = { income: 3500, spent: 1050 }
const start = { ...state }

const els = {
  amount: document.getElementById('ring-amount'),
  sub: document.getElementById('ring-sub'),
  spentStat: document.getElementById('stat-spent'),
  spentArc: document.getElementById('ring-spent'),
  committedArc: document.getElementById('ring-committed'),
  btn: document.querySelector('.app-btn'),
  toast: document.getElementById('toast'),
  toastAvatar: document.getElementById('toast-avatar'),
  toastTitle: document.getElementById('toast-title'),
  toastKind: document.getElementById('toast-kind'),
  toastAmount: document.getElementById('toast-amount'),
}

const available = () => state.income - state.spent - COMMITTED

function countTo(el, from, to, format = money, ms = 700) {
  // t0 comes from the first frame: its time can be earlier than performance.now().
  let t0 = 0
  const step = now => {
    t0 ||= now
    const p = Math.min((now - t0) / ms, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = format(from + (to - from) * eased)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function paintRing() {
  const spentLen = (state.spent / state.income) * C
  const committedLen = (COMMITTED / state.income) * C
  els.spentArc.style.strokeDasharray = `${spentLen} ${C}`
  els.committedArc.style.strokeDasharray = `${committedLen} ${C}`
  els.committedArc.style.strokeDashoffset = `${-spentLen}`
}

function paintHero() {
  els.amount.textContent = money(available())
  els.sub.textContent = of(state.income)
  els.spentStat.textContent = money(state.spent)
}

function restart(el, cls) {
  el.classList.remove(cls)
  void el.offsetWidth
  el.classList.add(cls)
}

function apply(event) {
  const before = { available: available(), spent: state.spent, income: state.income }
  if (event.income) state.income += event.amount
  else state.spent += event.amount

  restart(els.btn, 'is-tap')

  const title = t(event.title)
  els.toastAvatar.textContent = title.charAt(0)
  els.toastTitle.textContent = title
  els.toastKind.textContent = t(event.income ? 'toast.income' : 'toast.expense')
  els.toastAmount.textContent = `${event.income ? '+' : '−'}${money(event.amount)}`
  els.toast.toggleAttribute('data-income', Boolean(event.income))
  els.toast.classList.add('is-on')

  setTimeout(() => {
    paintRing()
    restart(els.amount, 'is-bump')
    countTo(els.amount, before.available, available())
    countTo(els.spentStat, before.spent, state.spent)
    if (event.income) countTo(els.sub, before.income, state.income, of)
  }, 250)

  setTimeout(() => els.toast.classList.remove('is-on'), 2400)
}

if (!calm) {
  let i = 0
  let timer = 0
  const tick = () => {
    if (i === EVENTS.length) {
      // Silent reset to the start. Available doesn't change, so nobody notices.
      Object.assign(state, start)
      paintHero()
      paintRing()
      i = 0
    }
    apply(EVENTS[i++])
    timer = setTimeout(tick, 3600)
  }

  whileVisible(document.getElementById('app'), on => {
    clearTimeout(timer)
    if (on) timer = setTimeout(tick, i === 0 ? 2600 : 1200)
  })
}

/* ---------- 3D tilt of the mock with the mouse ---------- */

const stage = document.querySelector('.stage')
const app = document.getElementById('app')

if (!calm && matchMedia('(pointer: fine)').matches) {
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    app.style.setProperty('--ry', `${x * 10}deg`)
    app.style.setProperty('--rx', `${y * -8}deg`)
  })
  stage.addEventListener('pointerleave', () => {
    app.style.setProperty('--ry', '0deg')
    app.style.setProperty('--rx', '0deg')
  })
}

/* ---------- Widgets that reorder themselves ---------- */

const board = document.getElementById('board')
const toggle = document.getElementById('edit-toggle')
const toggleLabel = document.getElementById('edit-label')

// FLIP: measure, move in the DOM, animate from the old position.
function swapRandom() {
  const tiles = [...board.children]
  const a = Math.floor(Math.random() * tiles.length)
  let b = Math.floor(Math.random() * (tiles.length - 1))
  if (b >= a) b++

  const first = new Map(tiles.map(t => [t, t.getBoundingClientRect()]))
  const [x, y] = [tiles[a], tiles[b]]
  const marker = document.createComment('')
  board.replaceChild(marker, x)
  board.replaceChild(x, y)
  board.replaceChild(y, marker)

  for (const t of [x, y]) {
    const from = first.get(t)
    const to = t.getBoundingClientRect()
    t.classList.add('is-moving')
    t.animate(
      [{ transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)` }, { transform: 'none' }],
      { duration: 650, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    ).finished.then(() => t.classList.remove('is-moving'))
  }
}

let editing = true
let boardOn = false
let shuffle = 0

function syncBoard() {
  clearInterval(shuffle)
  board.toggleAttribute('data-editing', editing)
  toggle.setAttribute('aria-pressed', String(editing))
  toggleLabel.textContent = t(editing ? 'board.done' : 'board.customize')
  if (editing && boardOn && !calm) shuffle = setInterval(swapRandom, 1900)
}

toggle.addEventListener('click', () => {
  editing = !editing
  syncBoard()
})

whileVisible(board, on => {
  boardOn = on
  syncBoard()
})

/* ---------- Voice demo ---------- */

// Everything comes from render(t): pausing or jumping to a step only changes t.
const demoScreen = document.getElementById('screen')
const v = {
  amount: document.getElementById('v-amount'),
  income: document.getElementById('v-income'),
  spentArc: document.getElementById('v-spent'),
  committedArc: document.getElementById('v-committed'),
  internet: document.getElementById('v-internet'),
  news: [...demoScreen.querySelectorAll('.recent .is-new')],
  saidText: document.getElementById('v-said-text'),
  bubbleTitle: document.getElementById('v-bubble-title'),
  bubbleNote: document.getElementById('v-bubble-note'),
  items: [...demoScreen.querySelectorAll('.v-item')],
  save: document.getElementById('v-save'),
  fab: demoScreen.querySelector('.v-fab'),
  cursor: document.getElementById('v-cursor'),
  play: document.getElementById('demo-play'),
  chapters: [...document.querySelectorAll('.chapter')],
}

const END = 20800
const CHAPTERS = [0, 6800, 11000, 15300]
// With "reduce motion": the moment that best sums up each step.
const STILLS = [5800, 10300, 14200, 19000]
const CLICKS = [1300, 6900, 15400]

// What the person says. The marked parts are what the AI picks up.
const SAID = {
  en: [
    ['I spent '],
    ['$45 on groceries', 'expense'],
    [', '],
    ['paid the internet', 'fixed'],
    [' and got a '],
    ['$200 bonus', 'income'],
  ],
  es: [
    ['Gasté '],
    ['45 mil en mercado', 'expense'],
    [', '],
    ['pagué el internet', 'fixed'],
    [' y me entró un '],
    ['bono de 200 mil', 'income'],
  ],
}
const saidLength = () => SAID[I18N.lang].reduce((n, [text]) => n + text.length, 0)

// Before and after saving: +45 groceries, +90 internet (no longer committed), +200 bonus.
const BEFORE = { income: 3500, spent: 1050, committed: 1210 }
const AFTER = { income: 3700, spent: 1185, committed: 1120 }
const availableOf = s => s.income - s.spent - s.committed

const clamp = x => Math.min(Math.max(x, 0), 1)
const ease = p => 1 - Math.pow(1 - p, 3)

function setFlag(name, on) {
  if (demoScreen.hasAttribute(name) !== on) demoScreen.toggleAttribute(name, on)
}

function setText(el, text) {
  if (el.textContent !== text) el.textContent = text
}

let saidShown = -1
function paintSaid(n) {
  if (n === saidShown) return
  saidShown = n
  let left = n
  v.saidText.replaceChildren(
    ...SAID[I18N.lang].map(([text, kind]) => {
      const part = text.slice(0, Math.max(left, 0))
      left -= text.length
      if (!kind) return part
      const mark = document.createElement('mark')
      mark.dataset.kind = kind
      mark.textContent = part
      return mark
    }),
  )
}

let ringDone = null
function paintScreenRing(done) {
  if (done === ringDone) return
  ringDone = done
  const s = done ? AFTER : BEFORE
  const spentLen = (s.spent / s.income) * C
  v.spentArc.style.strokeDasharray = `${spentLen} ${C}`
  v.committedArc.style.strokeDasharray = `${(s.committed / s.income) * C} ${C}`
  v.committedArc.style.strokeDashoffset = `${-spentLen}`
}

const cursorTargets = {
  fab: () => v.fab,
  item: () => v.items[0].querySelector('.v-money'),
  save: () => v.save,
}

function placeCursor(target) {
  const s = demoScreen.getBoundingClientRect()
  let x = s.width * 0.45
  let y = s.height * 0.86
  if (target) {
    const r = cursorTargets[target]().getBoundingClientRect()
    x = r.left - s.left + r.width * 0.55
    y = r.top - s.top + r.height * 0.6
  }
  v.cursor.style.setProperty('--x', `${Math.round(x)}px`)
  v.cursor.style.setProperty('--y', `${Math.round(y)}px`)
}

function render(t) {
  const on = (a, b = Infinity) => t >= a && t < b

  setFlag('data-fade', t < 250 || t >= END - 450)

  const fab = on(1300, 6900) ? 'recording' : on(6900, 11000) ? 'busy' : 'idle'
  if (demoScreen.dataset.fab !== fab) demoScreen.dataset.fab = fab

  setFlag('data-said', on(1300, 11000))
  paintSaid(Math.round(clamp((t - 1700) / 4500) * saidLength()))
  setFlag('data-parsed', on(9000, 11000))

  setFlag('data-bubble', on(6900, 11000))
  const listening = t < 9000
  setText(v.bubbleTitle, I18N.t(listening ? 'voice.listening' : 'voice.thinking'))
  setText(v.bubbleNote, I18N.t(listening ? 'voice.whisper' : 'voice.yourAi'))

  setFlag('data-modal', on(11000, 15800))
  v.items.forEach((el, i) => el.classList.toggle('is-in', t >= 11400 + i * 350))
  v.items[0].classList.toggle('is-focus', on(12500, 13600))
  v.save.classList.toggle('is-press', on(15400, 15800))
  setText(v.save, I18N.t(on(15400) ? 'voice.saving' : 'voice.save'))

  const done = t >= 15900
  v.internet.classList.toggle('is-paid', done)
  v.news.forEach((el, i) => el.classList.toggle('is-in', t >= 16200 + i * 220))
  setFlag('data-toast', on(16300, 19800))
  paintScreenRing(done)
  const from = availableOf(BEFORE)
  const to = availableOf(AFTER)
  setText(v.amount, money(from + (to - from) * ease(clamp((t - 16100) / 1000))))
  setText(v.income, of((done ? AFTER : BEFORE).income))

  const target = on(300, 11800) ? 'fab' : on(11800, 13700) ? 'item' : on(13700, 16000) ? 'save' : null
  placeCursor(target)

  const current = CHAPTERS.findLastIndex(start => t >= start)
  v.chapters.forEach((el, i) => {
    const end = CHAPTERS[i + 1] ?? END
    const p = calm ? Number(i === current) : clamp((t - CHAPTERS[i]) / (end - CHAPTERS[i]))
    el.querySelector('.chapter-bar b').style.setProperty('--p', p.toFixed(3))
    if (i === current) el.setAttribute('aria-current', 'step')
    else el.removeAttribute('aria-current')
  })
}

let time = calm ? STILLS[0] : 0
let playing = !calm && !recording
let inView = false
let raf = 0
let last = 0

function frame(now) {
  const prev = time
  time += last ? Math.min(now - last, 100) : 0
  last = now
  if (time >= END) time = 0
  else if (CLICKS.some(c => prev < c && c <= time)) restart(v.cursor, 'is-click')
  render(time)
  raf = requestAnimationFrame(frame)
}

function syncDemo() {
  cancelAnimationFrame(raf)
  last = 0
  if (playing && inView) raf = requestAnimationFrame(frame)
  v.play.setAttribute('aria-pressed', String(playing))
  v.play.setAttribute('aria-label', I18N.t(playing ? 'voice.pause' : 'voice.play'))
}

v.chapters.forEach((el, i) =>
  el.addEventListener('click', () => {
    time = calm ? STILLS[i] : CHAPTERS[i]
    playing = !calm
    render(time)
    syncDemo()
  }),
)

if (!calm && !recording) {
  v.play.hidden = false
  v.play.addEventListener('click', () => {
    playing = !playing
    syncDemo()
  })
}

addEventListener('resize', () => render(time))
render(time)
whileVisible(demoScreen, visible => {
  inView = visible
  syncDemo()
})

/* ---------- Language ---------- */

function paintLanguage() {
  paintDownload()
  paintAmounts()
  paintHero()
  syncBoard()
  syncDemo()
  saidShown = -1
  render(time)
}

paintLanguage()
I18N.onChange(paintLanguage)

/* ---------- Recording ---------- */

// The recorder seeks the voice demo frame by frame. The clock is virtual, so clicks
// and CSS transitions still look like they do live.
if (recording) {
  window.voiceDemo = {
    end: END,
    clicks: CLICKS,
    seek(t) {
      if (CLICKS.some(c => time < c && c <= t)) restart(v.cursor, 'is-click')
      time = t
      render(time)
    },
  }
}
