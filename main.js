// Botón principal según el sistema. El otro queda como link debajo.
const MAC = 'https://github.com/juan-ramirez-dev/lucka/releases/latest/download/Lucka-macos.dmg'
const WIN = 'https://github.com/juan-ramirez-dev/lucka/releases/latest/download/Lucka-windows-setup.exe'

const ua = navigator.userAgent
const isWindows = /Windows/i.test(ua)
const isMac = /Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)

const primary = document.getElementById('primary')
const secondary = document.getElementById('secondary')

if (isWindows) {
  primary.href = WIN
  primary.textContent = 'Descargar para Windows'
  secondary.href = MAC
  secondary.textContent = '¿Usas Mac? Descarga aquí'
} else if (!isMac) {
  document.getElementById('other').hidden = false
  secondary.href = WIN
  secondary.textContent = 'Descargar para Windows'
}
