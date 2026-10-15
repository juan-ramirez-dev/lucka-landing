// Botón principal según el sistema. El otro queda como link debajo.
const MAC = 'https://github.com/juan-ramirez-dev/lucka/releases/latest/download/Lucka-macos.dmg'
const WIN = 'https://github.com/juan-ramirez-dev/lucka/releases/latest/download/Lucka-windows-setup.exe'

const ua = navigator.userAgent
const isWindows = /Windows/i.test(ua)
const isMac = /Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)

const primary = document.getElementById('primary')
const primaryLabel = document.getElementById('primary-label')
const secondary = document.getElementById('secondary')

if (isWindows) {
  primary.href = WIN
  primaryLabel.textContent = 'Descargar para Windows'
  secondary.href = MAC
  secondary.textContent = '¿Usas Mac? Descarga aquí'
} else if (!isMac) {
  document.getElementById('other').hidden = false
  secondary.href = WIN
  secondary.textContent = 'Descargar para Windows'
}

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches

// Secciones que entran al hacer scroll.
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

// Solo corre lo que está en pantalla y con la pestaña visible.
function whileVisible(el, onChange) {
  let visible = false
  const update = () => onChange(visible && !document.hidden)
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    update()
  }).observe(el)
  document.addEventListener('visibilitychange', update)
}

/* ---------- Demo en vivo del panel ---------- */

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
const C = 2 * Math.PI * 92
const COMMITTED = 1210000

// El ingreso extra cierra el ciclo: al final todo vuelve al punto de partida.
const EVENTS = [
  { title: 'Mercado', amount: 45000 },
  { title: 'Café', amount: 12000 },
  { title: 'Taxi', amount: 23000 },
  { title: 'Ingreso extra', amount: 80000, income: true },
]

const state = { income: 3500000, spent: 1050000 }
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

function countTo(el, from, to, ms = 700) {
  // t0 sale del primer frame: su hora puede ser anterior a performance.now().
  let t0 = 0
  const step = now => {
    t0 ||= now
    const p = Math.min((now - t0) / ms, 1)
    const eased = 1 - Math.pow(1 - p, 3)
    el.textContent = money.format(Math.round(from + (to - from) * eased))
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

  els.toastAvatar.textContent = event.title.charAt(0)
  els.toastTitle.textContent = event.title
  els.toastKind.textContent = event.income ? 'Ingreso registrado' : 'Gasto registrado'
  els.toastAmount.textContent = `${event.income ? '+' : '−'}${money.format(event.amount)}`
  els.toast.toggleAttribute('data-income', Boolean(event.income))
  els.toast.classList.add('is-on')

  setTimeout(() => {
    paintRing()
    restart(els.amount, 'is-bump')
    countTo(els.amount, before.available, available())
    countTo(els.spentStat, before.spent, state.spent)
    if (event.income) countTo(els.sub, before.income, state.income)
  }, 250)

  setTimeout(() => els.toast.classList.remove('is-on'), 2400)
}

if (!calm) {
  let i = 0
  let timer = 0
  const tick = () => {
    if (i === EVENTS.length) {
      // Vuelta silenciosa al inicio. Disponible no cambia, así que no se nota.
      Object.assign(state, start)
      els.sub.textContent = `de ${money.format(state.income)}`
      els.spentStat.textContent = money.format(state.spent)
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

/* ---------- Inclinación 3D del mock con el mouse ---------- */

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

/* ---------- Widgets que se reordenan solos ---------- */

const board = document.getElementById('board')
const toggle = document.getElementById('edit-toggle')
const toggleLabel = document.getElementById('edit-label')

// FLIP: mide, mueve en el DOM y anima desde la posición vieja.
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
  toggleLabel.textContent = editing ? 'Listo' : 'Personalizar'
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
