# Lucka · landing

Página de descarga de [Lucka](https://github.com/juan-ramirez-dev/lucka).

- HTML + CSS estático. Sin build.
- Publica sola en GitHub Pages al hacer push a `main`.
- URL: https://juan-ramirez-dev.github.io/lucka-landing/

## Links de descarga

Apuntan al último Release de la app, con nombre fijo:

- `releases/latest/download/Lucka-macos.dmg`
- `releases/latest/download/Lucka-windows-setup.exe`

No hay que tocarlos al publicar una versión nueva.

## Colores

Tokens en el `<style>` de `index.html` (copia de `lucka/src/app/globals.css`).
`styles.css` solo usa `var(--token)`.

## Animaciones

- El panel del hero es un mock en HTML. Los números son de ejemplo.
- `main.js` simula gastos, reordena widgets y hace el scroll reveal.
- Solo corre lo visible. Con "reducir movimiento" todo queda quieto.
- Sin JS la página se ve completa, sin animaciones de scroll.

## Capturas pendientes

- `assets/macos-aviso.png`, `assets/windows-aviso.png` → en "Primera vez".

## Ver local

Abrir `index.html` en el navegador.
