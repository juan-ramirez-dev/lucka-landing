// The page in English (also the HTML's own text, for no-JS and search engines) and Spanish.
// data-i18n → text, data-i18n-html → trusted markup from here, data-i18n-attr="attr:key;attr:key".
const I18N = (() => {
  const TEXT = {
    en: {
      'meta.title': 'Lucka — your finances, on your computer',
      'meta.description':
        'How much you have left and where your money goes. Record expenses by talking. Free desktop app for macOS and Windows. Your data never leaves your computer.',

      'top.home': 'Lucka, home',
      'top.voice': 'Voice with AI',
      'top.code': 'Code',
      'top.download': 'Download',
      'top.language': 'Language',

      'hero.badge': 'New: record expenses by talking',
      'hero.line1': 'Know what',
      'hero.line2': 'you have left,',
      'hero.line3': 'and keep it',
      'hero.line4': 'to yourself.',
      'hero.lead':
        'Lucka tells you how much is left this month and where your money goes. Free for macOS and Windows. Everything lives on your computer: no account, no cloud.',
      'download.mac': 'Download for macOS',
      'download.windows': 'Download for Windows',
      'download.otherWindows': 'On Windows? Download here',
      'download.otherMac': 'On a Mac? Download here',
      'download.elsewhere':
        'Lucka is for macOS and Windows. Download it from your computer.',

      'app.month': 'Your month',
      'app.cycle': '<strong>12 days</strong> to payday',
      'app.add': 'Add',
      'app.available': 'Available',
      'app.of': 'of',
      'app.spent': 'Spent',
      'app.committed': 'Committed',
      'app.fixed': 'Fixed',
      'app.categories': 'Categories',
      'app.recent': 'Recent',
      'app.rent': 'Rent',
      'app.internet': 'Internet',
      'app.gym': 'Gym',
      'app.phone': 'Phone',
      'app.groceries': 'Groceries',
      'app.goingOut': 'Going out',
      'app.transport': 'Transport',
      'app.coffee': 'Coffee',
      'app.taxi': 'Taxi',
      'app.movies': 'Movies',
      'app.bonus': 'Bonus',
      'app.extraIncome': 'Extra income',
      'toast.expense': 'Expense recorded',
      'toast.income': 'Income recorded',

      'voice.eyebrow': 'New · Record by talking',
      'voice.title': 'Say it out loud. <span class="muted">Lucka writes it down.</span>',
      'voice.lead':
        'Tap the microphone and say what you spent. The AI turns it into records. Nothing is saved until you confirm it.',
      'voice.step1': 'Talk',
      'voice.step1Text':
        'Tap the microphone and say it all at once: expenses, fixed bills you paid or money that came in.',
      'voice.step2': 'Lucka understands',
      'voice.step2Text':
        'Whisper turns your voice into text on your computer. Your AI pulls out amounts, categories and dates.',
      'voice.step3': 'Review',
      'voice.step3Text':
        "You see a summary. Fix an amount, change the category or drop what doesn't belong.",
      'voice.step4': 'Done',
      'voice.step4Text':
        'Everything is saved together. The fixed bill is marked paid and your available amount updates.',
      'voice.listening': 'Listening to what you said…',
      'voice.whisper': 'Whisper · on your computer',
      'voice.thinking': 'Understanding…',
      'voice.yourAi': 'Your AI · local or with your key',
      'voice.byVoice': 'By voice',
      'voice.saveThis': 'Save this?',
      'voice.heard':
        '“I spent $45 on groceries, paid the internet and got a $200 bonus”',
      'voice.expense': 'Expense',
      'voice.fixedExpense': 'Fixed expense',
      'voice.income': 'Income',
      'voice.today': 'Today',
      'voice.internetToday': 'Internet · Today',
      'voice.save': 'Save 3 records',
      'voice.saving': 'Saving…',
      'voice.discard': 'Discard',
      'voice.saved': '3 records saved',
      'voice.pause': 'Pause demo',
      'voice.play': 'Play demo',

      'ai.eyebrow': 'Your AI, your choice',
      'ai.title': 'Private on your computer <span class="muted">or with your own key.</span>',
      'ai.lead':
        'You set it up once, the first time you open it. You can change it later in Settings.',
      'ai.audioStays': 'Audio stays here',
      'ai.voiceTitle': 'Your voice stays with you',
      'ai.voiceText':
        'Whisper turns speech into text on your computer. Always. It downloads once (about 490 MB).',
      'ai.recommended': 'Recommended',
      'ai.downloaded': 'Downloaded · 2.1 GB',
      'ai.offline': 'Offline',
      'ai.localTitle': 'AI on your computer',
      'ai.localText':
        '100% private: nothing leaves your computer. It takes disk space and a few seconds per sentence.',
      'ai.keychain': 'In your system keychain',
      'ai.keyTitle': 'Or with your key',
      'ai.keyText':
        "Paste your OpenAI, Claude or Gemini key. It's stored in the system keychain, never in Lucka or in backups. Only the text and your category names go to the provider.",

      'what.eyebrow': 'What it does',
      'what.title': 'Three answers, <span class="muted">at a glance.</span>',
      'what.income': 'Income',
      'what.spent': 'Spent',
      'what.fixed': 'Fixed',
      'what.available': 'Available',
      'what.availableTitle': 'Available, for real',
      'what.availableText':
        'Income minus what you spent minus the fixed bills still to pay. From payday to payday.',
      'what.fixedTitle': 'Fixed bills and categories',
      'what.fixedText':
        "Mark the rent as paid. See how much is left for groceries or going out.",
      'what.file': 'lucka.db · on your computer',
      'what.privateTitle': 'Private by design',
      'what.privateText':
        "There's no server. Your data is a file on your computer. Export a backup whenever you want.",

      'board.eyebrow': 'Your dashboard, your way',
      'board.title': 'Move, resize and sort <span class="muted">what matters to you.</span>',
      'board.lead':
        'Every block on the dashboard is a widget. Drag it, resize it, hide it or bring it back. To write something down: a button or your voice.',
      'board.done': 'Done',
      'board.customize': 'Customize',

      'built.eyebrow': 'Open source',
      'built.title': 'How it’s built, <span class="muted">in 100 seconds.</span>',
      'built.lead':
        'A TypeScript UI in a Rust shell, a SQLite file on your disk and AI that can run offline. Every line is on GitHub.',
      'built.note': '1080p · 101 s',
      'built.repo': 'See the code on GitHub',
      'built.docs': 'Read the architecture',

      'first.eyebrow': 'The first time you open it',
      'first.title': 'Your system will warn you. <span class="muted">That’s normal.</span>',
      'first.lead':
        "Lucka is open source and doesn't pay for Apple or Microsoft certificates. So your system asks you to confirm once.",
      'first.mac1': 'Open the <code>.dmg</code> and drag Lucka to Applications.',
      'first.mac2': 'Open it. A warning shows up: click <strong>Done</strong>.',
      'first.mac3':
        'System Settings → Privacy &amp; Security → <strong>Open Anyway</strong>.',
      'first.technical': 'If you’re technical',
      'first.win1': 'Open the installer.',
      'first.win2': '“Windows protected your PC” shows up: click <strong>More info</strong>.',
      'first.win3': 'Click <strong>Run anyway</strong>.',
      'first.note':
        '<i class="pulse" aria-hidden="true"></i>After that it updates itself. For voice, it asks for microphone permission once.',

      'cta.title': 'Your money, in order <span class="muted">and for your eyes only.</span>',
      'cta.download': 'Download Lucka',
    },

    es: {
      'meta.title': 'Lucka — tus finanzas, en tu computador',
      'meta.description':
        'Cuánto tengo disponible y en qué se me va el dinero. Registra gastos hablando. App de escritorio gratis para macOS y Windows. Tus datos nunca salen de tu computador.',

      'top.home': 'Lucka, inicio',
      'top.voice': 'Voz con IA',
      'top.code': 'Código',
      'top.download': 'Descargar',
      'top.language': 'Idioma',

      'hero.badge': 'Nuevo: registra gastos hablando',
      'hero.line1': 'Cuánto tienes',
      'hero.line2': 'disponible,',
      'hero.line3': 'sin que nadie',
      'hero.line4': 'más lo vea.',
      'hero.lead':
        'Lucka te dice cuánto te queda este mes y en qué se te va el dinero. Gratis para macOS y Windows. Todo vive en tu computador: sin cuenta, sin nube.',
      'download.mac': 'Descargar para macOS',
      'download.windows': 'Descargar para Windows',
      'download.otherWindows': '¿Usas Windows? Descarga aquí',
      'download.otherMac': '¿Usas Mac? Descarga aquí',
      'download.elsewhere':
        'Lucka es para macOS y Windows. Descárgala desde tu computador.',

      'app.month': 'Tu mes',
      'app.cycle': 'Faltan <strong>12 días</strong> para el pago',
      'app.add': 'Registrar',
      'app.available': 'Disponible',
      'app.of': 'de',
      'app.spent': 'Gastado',
      'app.committed': 'Comprometido',
      'app.fixed': 'Fijos',
      'app.categories': 'Categorías',
      'app.recent': 'Recientes',
      'app.rent': 'Arriendo',
      'app.internet': 'Internet',
      'app.gym': 'Gimnasio',
      'app.phone': 'Celular',
      'app.groceries': 'Mercado',
      'app.goingOut': 'Salidas',
      'app.transport': 'Transporte',
      'app.coffee': 'Café',
      'app.taxi': 'Taxi',
      'app.movies': 'Cine',
      'app.bonus': 'Bono',
      'app.extraIncome': 'Ingreso extra',
      'toast.expense': 'Gasto registrado',
      'toast.income': 'Ingreso registrado',

      'voice.eyebrow': 'Nuevo · Registra hablando',
      'voice.title': 'Dilo en voz alta. <span class="muted">Lucka lo anota.</span>',
      'voice.lead':
        'Toca el micrófono y cuenta en qué gastaste. La IA lo convierte en registros. Nada se guarda hasta que tú lo confirmas.',
      'voice.step1': 'Habla',
      'voice.step1Text':
        'Toca el micrófono y di todo de una: gastos, fijos pagados o plata que te entró.',
      'voice.step2': 'Lucka entiende',
      'voice.step2Text':
        'Whisper pasa tu voz a texto en tu equipo. Tu IA saca montos, categorías y fechas.',
      'voice.step3': 'Revisa',
      'voice.step3Text':
        'Ves un resumen. Corrige un monto, cambia la categoría o quita lo que sobra.',
      'voice.step4': 'Listo',
      'voice.step4Text':
        'Se guarda todo junto. El fijo queda pagado y tu disponible se actualiza.',
      'voice.listening': 'Escuchando lo que dijiste…',
      'voice.whisper': 'Whisper · en tu equipo',
      'voice.thinking': 'Entendiendo…',
      'voice.yourAi': 'Tu IA · local o con tu key',
      'voice.byVoice': 'Por voz',
      'voice.saveThis': '¿Guardo esto?',
      'voice.heard':
        '«Gasté 45 mil en mercado, pagué el internet y me entró un bono de 200 mil»',
      'voice.expense': 'Gasto',
      'voice.fixedExpense': 'Gasto fijo',
      'voice.income': 'Ingreso',
      'voice.today': 'Hoy',
      'voice.internetToday': 'Internet · Hoy',
      'voice.save': 'Guardar 3 registros',
      'voice.saving': 'Guardando…',
      'voice.discard': 'Descartar',
      'voice.saved': '3 registros guardados',
      'voice.pause': 'Pausar demo',
      'voice.play': 'Reproducir demo',

      'ai.eyebrow': 'Tu IA, tú eliges',
      'ai.title': 'Privada en tu equipo <span class="muted">o con tu propia key.</span>',
      'ai.lead':
        'La configuras una vez, la primera vez que la abres. Puedes cambiarla luego en Ajustes.',
      'ai.audioStays': 'El audio no sale',
      'ai.voiceTitle': 'Tu voz se queda contigo',
      'ai.voiceText':
        'Whisper pasa la voz a texto dentro de tu computador. Siempre. Se baja una vez (unos 490 MB).',
      'ai.recommended': 'Recomendado',
      'ai.downloaded': 'Descargado · 2,1 GB',
      'ai.offline': 'Sin internet',
      'ai.localTitle': 'IA en tu equipo',
      'ai.localText':
        '100% privado: nada sale de tu computador. Ocupa espacio en disco y tarda unos segundos por frase.',
      'ai.keychain': 'En el llavero del sistema',
      'ai.keyTitle': 'O con tu key',
      'ai.keyText':
        'Pega tu key de OpenAI, Claude o Gemini. Se guarda en el llavero del sistema, nunca en Lucka ni en los respaldos. Al proveedor solo va el texto y los nombres de tus categorías.',

      'what.eyebrow': 'Qué hace',
      'what.title': 'Tres respuestas, <span class="muted">de un vistazo.</span>',
      'what.income': 'Ingreso',
      'what.spent': 'Gastado',
      'what.fixed': 'Fijos',
      'what.available': 'Disponible',
      'what.availableTitle': 'Disponible, de verdad',
      'what.availableText':
        'Ingreso menos lo gastado menos los fijos que faltan. De día de pago a día de pago.',
      'what.fixedTitle': 'Fijos y categorías',
      'what.fixedText':
        'Marca el arriendo como pagado. Ve cuánto te queda en mercado o salidas.',
      'what.file': 'lucka.db · en tu equipo',
      'what.privateTitle': 'Privado por diseño',
      'what.privateText':
        'No hay servidor. Tus datos están en un archivo en tu equipo. Exporta un respaldo cuando quieras.',

      'board.eyebrow': 'Tu panel, a tu manera',
      'board.title': 'Mueve, ajusta y ordena <span class="muted">lo que te importa.</span>',
      'board.lead':
        'Cada bloque del panel es un widget. Arrástralo, cámbiale el tamaño, escóndelo o tráelo de vuelta. Para anotar algo, un botón o tu voz.',
      'board.done': 'Listo',
      'board.customize': 'Personalizar',

      'built.eyebrow': 'Código abierto',
      'built.title': 'Cómo está hecha, <span class="muted">en 100 segundos.</span>',
      'built.lead':
        'Una interfaz en TypeScript dentro de un shell en Rust, un archivo SQLite en tu disco e IA que puede correr sin internet. Todo el código está en GitHub.',
      'built.note': 'Video en inglés · 1080p · 101 s',
      'built.repo': 'Ver el código en GitHub',
      'built.docs': 'Leer la arquitectura',

      'first.eyebrow': 'Primera vez que la abres',
      'first.title': 'Tu sistema te va a avisar. <span class="muted">Es normal.</span>',
      'first.lead':
        'Lucka es open source y no paga certificados de Apple ni Microsoft. Por eso el sistema pide confirmar una sola vez.',
      'first.mac1': 'Abre el <code>.dmg</code> y arrastra Lucka a Aplicaciones.',
      'first.mac2': 'Ábrela. Sale un aviso: dale <strong>Listo</strong>.',
      'first.mac3':
        'Ajustes del Sistema → Privacidad y seguridad → <strong>Abrir igualmente</strong>.',
      'first.technical': 'Si eres técnico',
      'first.win1': 'Abre el instalador.',
      'first.win2': 'Sale “Windows protegió su PC”: clic en <strong>Más información</strong>.',
      'first.win3': 'Clic en <strong>Ejecutar de todas formas</strong>.',
      'first.note':
        '<i class="pulse" aria-hidden="true"></i>Después se actualiza sola. Para la voz, pide permiso del micrófono una vez.',

      'cta.title': 'Tu dinero, en orden <span class="muted">y solo para tus ojos.</span>',
      'cta.download': 'Descargar Lucka',
    },
  }

  const STORE = 'lucka-lang'
  const supported = value => value === 'en' || value === 'es'

  // A ?lang= link wins, then the visitor's last choice, then the browser.
  function initial() {
    const param = new URLSearchParams(location.search).get('lang')
    if (supported(param)) return param
    try {
      const saved = localStorage.getItem(STORE)
      if (supported(saved)) return saved
    } catch {}
    for (const tag of navigator.languages ?? [navigator.language]) {
      const base = String(tag).toLowerCase().split('-')[0]
      if (supported(base)) return base
    }
    return 'en'
  }

  let lang = initial()
  const listeners = []
  const t = key => TEXT[lang][key]

  function apply() {
    document.documentElement.lang = lang
    document.title = t('meta.title')
    document.querySelector('meta[name="description"]').content = t('meta.description')
    for (const el of document.querySelectorAll('[data-i18n]')) {
      el.textContent = t(el.dataset.i18n)
    }
    for (const el of document.querySelectorAll('[data-i18n-html]')) {
      el.innerHTML = t(el.dataset.i18nHtml)
    }
    for (const el of document.querySelectorAll('[data-i18n-attr]')) {
      for (const pair of el.dataset.i18nAttr.split(';')) {
        const [attr, key] = pair.split(':')
        el.setAttribute(attr, t(key))
      }
    }
    for (const button of document.querySelectorAll('[data-lang]')) {
      button.setAttribute('aria-pressed', String(button.dataset.lang === lang))
    }
    for (const listener of listeners) listener(lang)
  }

  function set(next) {
    if (!supported(next) || next === lang) return
    lang = next
    try {
      localStorage.setItem(STORE, lang)
    } catch {}
    apply()
  }

  for (const button of document.querySelectorAll('[data-lang]')) {
    button.addEventListener('click', () => set(button.dataset.lang))
  }

  apply()
  // The head script hid the page so nobody sees the English text flash first.
  document.documentElement.classList.remove('i18n-wait')

  return {
    get lang() {
      return lang
    },
    t,
    apply,
    onChange: listener => listeners.push(listener),
  }
})()
