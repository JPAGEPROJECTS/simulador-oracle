/* ============================================================
   Simulador Certificación Oracle Database SQL - lógica
   Sin dependencias. Funciona desde file:// (sin fetch, sin módulos).
   ============================================================ */
(function () {
  'use strict';

  // ---------- Configuración de exámenes ----------
  var EXAMENES = {
    foundation: {
      nombre: 'Database Foundation',
      corto: 'Foundation',
      descripcion: 'Módulo Oracle Academy: conceptos de bases de datos, modelado conceptual/lógico/físico, Data Modeler, mapping e introducción a SQL.',
      banco: function () { return window.BANCO_FOUNDATION || []; },
      umbral: 70, preguntas: 50, minutos: 60, configurable: true
    },
    design: {
      nombre: 'Database Design',
      corto: 'Design',
      descripcion: 'Módulo Oracle Academy: entidades, relaciones, supertipos/subtipos, UID, normalización, arcos, jerarquías, modelado histórico y mapping.',
      banco: function () { return window.BANCO_DESIGN || []; },
      umbral: 70, preguntas: 50, minutos: 60, configurable: true
    },
    programming: {
      nombre: 'Programming with SQL',
      corto: 'Programming',
      descripcion: 'Módulo Oracle Academy: SELECT, funciones, conversiones, joins, grupos, subconsultas, DML, DDL, restricciones, vistas y más.',
      banco: function () { return window.BANCO_PROGRAMMING || []; },
      umbral: 70, preguntas: 50, minutos: 60, configurable: true
    },
    exam071: {
      nombre: 'Oracle Database SQL 1Z0-071',
      corto: '1Z0-071',
      descripcion: 'Certificación oficial. Formato real: 63 preguntas de opción múltiple, 120 minutos, aprobación con 63%.',
      banco: function () { return window.BANCO_071 || []; },
      umbral: 63, preguntas: 63, minutos: 120, configurable: false, simulacros: 3
    }
  };
  var ORDEN_EXAMENES = ['foundation', 'design', 'programming', 'exam071'];

  // ---------- Almacenamiento ----------
  var KEY_HIST = 'dbexam.historial';
  var KEY_ERR = 'dbexam.errores';
  var KEY_THEME = 'dbexam.tema';
  var KEY_CFG = 'dbexam.config';

  var store = {
    get: function (k, def) {
      try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch (e) { return def; }
    },
    set: function (k, v) {
      try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* almacenamiento no disponible */ }
    }
  };

  // ---------- Utilidades ----------
  var $app = document.getElementById('app');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Texto con `código en línea` y saltos de línea.
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\n/g, '<br>');
  }

  var SQL_KW = ('ADD ALL ALTER AND ANY AS ASC BETWEEN BY CASCADE CASE CHECK COLUMN COMMENT COMMIT CONNECT CONSTRAINT ' +
    'CONSTRAINTS CREATE CROSS CURRVAL CYCLE DATE DECODE DEFAULT DEFERRABLE DEFERRED DEFINE DELETE DESC DISABLE DISTINCT DROP ' +
    'ELSE ENABLE END ESCAPE EXCEPT EXISTS EXTERNAL FETCH FIRST FOR FOREIGN FROM FULL GLOBAL GRANT GROUP HAVING IDENTITY ' +
    'IMMEDIATE IN INCREMENT INDEX INITIALLY INNER INSERT INTERSECT INTERVAL INTO IS JOIN KEY LEFT LIKE LIMIT MAXVALUE MERGE ' +
    'MINUS MINVALUE MODIFY NATURAL NEXT NEXTVAL NOCACHE NOCYCLE NOT NOVALIDATE NULL NULLS OF OFFSET ON ONLY OPTION OR ORDER ' +
    'OUTER OVER PARTITION PERCENT PRESERVE PRIMARY PRIOR PUBLIC PURGE READ REFERENCES RENAME REPLACE REVOKE RIGHT ROLE ' +
    'ROLLBACK ROW ROWS SAVEPOINT SELECT SEQUENCE SET START SYNONYM TABLE TEMPORARY THEN TIES TO TRUNCATE UNION UNIQUE ' +
    'UNUSED UPDATE USING VALUES VIEW WHEN WHERE WITH ZONE TIME TIMESTAMP LOCAL ADMIN USER UNDEFINE VERIFY ACCEPT MATCHED ' +
    'ORGANIZATION FORCE NOFORCE INVISIBLE VISIBLE ALWAYS GENERATED LOCK MODE EXCLUSIVE SHARE ESCAPE').split(' ');
  var KW_SET = {};
  SQL_KW.forEach(function (k) { KW_SET[k] = true; });

  function hlSQL(sql) {
    var re = /(--[^\n]*)|('(?:[^']|'')*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_$#]*)|([\s\S])/g;
    var out = '', m;
    while ((m = re.exec(sql)) !== null) {
      if (m[1]) out += '<span class="c">' + esc(m[1]) + '</span>';
      else if (m[2]) out += '<span class="s">' + esc(m[2]) + '</span>';
      else if (m[3]) out += '<span class="n">' + esc(m[3]) + '</span>';
      else if (m[4]) out += KW_SET[m[4].toUpperCase()] ? '<span class="k">' + esc(m[4]) + '</span>' : esc(m[4]);
      else out += esc(m[5]);
    }
    return out;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function fmtTiempo(seg) {
    seg = Math.max(0, Math.round(seg));
    var h = Math.floor(seg / 3600), m = Math.floor((seg % 3600) / 60), s = seg % 60;
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return (h > 0 ? h + ':' + p(m) : m) + ':' + p(s);
  }

  function fmtFecha(iso) {
    var d = new Date(iso);
    function p(n) { return n < 10 ? '0' + n : '' + n; }
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function letra(i) { return String.fromCharCode(65 + i); }

  function mismoConjunto(a, b) {
    if (a.length !== b.length) return false;
    var s = {};
    a.forEach(function (x) { s[x] = true; });
    return b.every(function (x) { return s[x]; });
  }

  function temasDe(banco) {
    var orden = [], cuenta = {};
    banco.forEach(function (q) {
      if (!(q.tema in cuenta)) { cuenta[q.tema] = 0; orden.push(q.tema); }
      cuenta[q.tema]++;
    });
    return orden.map(function (t) { return { tema: t, n: cuenta[t] }; });
  }

  function buscarPregunta(id) {
    for (var i = 0; i < ORDEN_EXAMENES.length; i++) {
      var b = EXAMENES[ORDEN_EXAMENES[i]].banco();
      for (var j = 0; j < b.length; j++) if (b[j].id === id) return b[j];
    }
    return null;
  }

  // ---------- Tema claro/oscuro ----------
  var themeBtn = document.getElementById('themeBtn');
  function temaActual() {
    var t = store.get(KEY_THEME, 'auto');
    if (t === 'auto') return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return t;
  }
  function pintarBotonTema() {
    themeBtn.textContent = temaActual() === 'dark' ? '☀' : '☾';
    themeBtn.title = temaActual() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
  }
  themeBtn.addEventListener('click', function () {
    var nuevo = temaActual() === 'dark' ? 'light' : 'dark';
    store.set(KEY_THEME, nuevo);
    document.documentElement.setAttribute('data-theme', nuevo);
    pintarBotonTema();
  });
  pintarBotonTema();

  // ---------- Instalar como aplicación (PWA) ----------
  // Solo funciona servida por http(s) (p. ej. GitHub Pages); con file:// el botón no aparece.
  var installBtn = document.getElementById('installBtn');
  var promptInstalacion = null;
  var esStandalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;
  var esIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (/^https?:$/.test(location.protocol) && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
  if (!esStandalone && /^https?:$/.test(location.protocol)) {
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      promptInstalacion = e;
      installBtn.hidden = false;
    });
    if (esIOS) installBtn.hidden = false;   // Safari no tiene diálogo propio: se muestran instrucciones
  }
  installBtn.addEventListener('click', function () {
    if (promptInstalacion) {
      promptInstalacion.prompt();
      promptInstalacion.userChoice.then(function (r) {
        if (r.outcome === 'accepted') installBtn.hidden = true;
        promptInstalacion = null;
      });
    } else {
      alert('Para instalarla en tu iPhone/iPad:\n\n1. Abre esta página en Safari.\n2. Toca el botón Compartir (cuadro con flecha hacia arriba).\n3. Elige "Agregar a pantalla de inicio" y toca "Agregar".');
    }
  });
  window.addEventListener('appinstalled', function () { installBtn.hidden = true; });

  // ---------- Estado de sesión ----------
  var S = null;           // sesión activa
  var timerId = null;
  var keyHandler = null;

  function limpiarSesion() {
    if (timerId) { clearInterval(timerId); timerId = null; }
    S = null;
  }

  function examenEnCurso() { return S && S.modo === 'examen' && !S.terminado; }

  window.addEventListener('beforeunload', function (e) {
    if (examenEnCurso()) { e.preventDefault(); e.returnValue = ''; }
  });

  document.getElementById('brand').addEventListener('click', function () {
    if (S && !S.terminado) {
      if (!confirm('¿Salir de la sesión actual? Se perderá el progreso.')) return;
    }
    limpiarSesion();
    vistaInicio();
  });

  function setKeys(fn) { keyHandler = fn; }
  document.addEventListener('keydown', function (e) {
    if (!keyHandler) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' && e.target.type !== 'checkbox' && e.target.type !== 'radio') return;
    if (tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    keyHandler(e);
  });

  function render(html) {
    setKeys(null);
    $app.innerHTML = html;
    window.scrollTo(0, 0);
  }

  // ---------- Historial y errores ----------
  function historial() { return store.get(KEY_HIST, []); }

  function guardarIntento(entry) {
    var h = historial();
    h.unshift(entry);
    if (h.length > 300) h.length = 300;
    store.set(KEY_HIST, h);
  }

  function errores() { return store.get(KEY_ERR, {}); }

  function actualizarErrores(examenId, resultados) {
    var e = errores();
    resultados.forEach(function (r) {
      if (r.correcta) delete e[r.id];
      else e[r.id] = { examen: examenId, veces: ((e[r.id] && e[r.id].veces) || 0) + 1, ultima: new Date().toISOString() };
    });
    store.set(KEY_ERR, e);
  }

  function erroresDe(examenId) {
    var e = errores(), banco = EXAMENES[examenId].banco(), ids = {};
    banco.forEach(function (q) { ids[q.id] = true; });
    return Object.keys(e).filter(function (id) { return e[id].examen === examenId && ids[id]; });
  }

  // ============================================================
  //  VISTA: INICIO
  // ============================================================
  function vistaInicio() {
    var html = '<h1>Practica para la certificación</h1>' +
      '<p class="muted">Elige un examen. El <strong>modo práctica</strong> muestra la retroalimentación al responder cada pregunta; el <strong>modo examen</strong> simula las condiciones reales con cronómetro y sin retroalimentación hasta entregar.</p>' +
      '<div class="grid-exams">';

    ORDEN_EXAMENES.forEach(function (id) {
      var ex = EXAMENES[id], banco = ex.banco(), nErr = erroresDe(id).length;
      var nMulti = banco.filter(function (q) { return q.tipo === 'multiple'; }).length;
      html += '<div class="card exam-card">' +
        '<h3>' + esc(ex.nombre) + '</h3>' +
        '<div class="meta">' +
        '<span class="chip accent">Aprobación ' + ex.umbral + '%</span>' +
        '<span class="chip">' + ex.preguntas + ' preg · ' + ex.minutos + ' min</span>' +
        '<span class="chip">Banco: ' + banco.length + '</span>' +
        (nMulti ? '<span class="chip">' + nMulti + ' de selección múltiple</span>' : '') +
        '</div>' +
        '<p class="muted small" style="margin:0">' + esc(ex.descripcion) + '</p>' +
        '<div class="actions">' +
        '<button class="btn primary" data-act="examen" data-ex="' + id + '"' + (banco.length ? '' : ' disabled') + '>Modo examen</button>' +
        '<button class="btn" data-act="practica" data-ex="' + id + '"' + (banco.length ? '' : ' disabled') + '>Práctica</button>' +
        (nErr ? '<button class="btn" data-act="errores" data-ex="' + id + '">Repasar mis errores (' + nErr + ')</button>' : '') +
        '</div></div>';
    });
    html += '</div>';

    // Historial
    var h = historial();
    html += '<div class="card"><div class="section-head"><h2>Historial de intentos</h2>' +
      (h.length ? '<button class="btn sm danger" id="borrarHist">Borrar historial</button>' : '') + '</div>';
    if (!h.length) {
      html += '<div class="empty">Aún no hay intentos registrados.</div>';
    } else {
      html += '<div class="table-wrap"><table class="data"><thead><tr>' +
        '<th>Fecha</th><th>Examen</th><th>Modo</th><th>Puntaje</th><th>Resultado</th><th>Tiempo</th><th></th>' +
        '</tr></thead><tbody>';
      h.slice(0, 50).forEach(function (r, i) {
        var ex = EXAMENES[r.examen];
        var res = r.modo === 'examen'
          ? '<span class="chip ' + (r.aprobado ? 'ok' : 'bad') + '">' + (r.aprobado ? 'Aprobado' : 'Reprobado') + '</span>'
          : '<span class="chip">—</span>';
        html += '<tr><td>' + fmtFecha(r.fecha) + '</td>' +
          '<td>' + esc(ex ? ex.corto : r.examen) + '</td>' +
          '<td>' + (r.modo === 'examen' ? 'Examen' : 'Práctica') + (r.origen ? ' <span class="muted small">(' + esc(r.origen) + ')</span>' : '') + '</td>' +
          '<td><strong>' + r.puntaje + '%</strong> <span class="muted small">' + r.correctas + '/' + r.total + '</span></td>' +
          '<td>' + res + '</td>' +
          '<td>' + fmtTiempo(r.duracion) + '</td>' +
          '<td>' + (r.fallos && r.fallos.length ? '<button class="btn sm" data-act="fallosIntento" data-i="' + i + '">Repasar fallos (' + r.fallos.length + ')</button>' : '') + '</td></tr>';
      });
      html += '</tbody></table></div>';
      if (h.length > 50) html += '<p class="muted small">Mostrando los 50 intentos más recientes de ' + h.length + '.</p>';
    }
    html += '</div>';

    render(html);

    $app.querySelectorAll('[data-act]').forEach(function (b) {
      b.addEventListener('click', function () {
        var act = b.getAttribute('data-act'), ex = b.getAttribute('data-ex');
        if (act === 'examen') vistaConfigExamen(ex);
        else if (act === 'practica') vistaConfigPractica(ex);
        else if (act === 'errores') iniciarRepaso(ex, erroresDe(ex), 'mis errores');
        else if (act === 'fallosIntento') {
          var r = historial()[+b.getAttribute('data-i')];
          iniciarRepaso(r.examen, r.fallos, 'fallos de un intento');
        }
      });
    });
    var bh = document.getElementById('borrarHist');
    if (bh) bh.addEventListener('click', function () {
      if (confirm('¿Borrar todo el historial de intentos y la lista de errores?')) {
        store.set(KEY_HIST, []); store.set(KEY_ERR, {}); vistaInicio();
      }
    });
  }

  function iniciarRepaso(examenId, ids, origen) {
    var banco = EXAMENES[examenId].banco();
    var set = {};
    ids.forEach(function (id) { set[id] = true; });
    var preguntas = banco.filter(function (q) { return set[q.id]; });
    if (!preguntas.length) { alert('No hay preguntas para repasar.'); return; }
    iniciarSesion(examenId, 'practica', shuffle(preguntas), { origen: origen });
  }

  // ============================================================
  //  VISTA: CONFIGURAR PRÁCTICA
  // ============================================================
  function vistaConfigPractica(examenId) {
    var ex = EXAMENES[examenId], banco = ex.banco(), temas = temasDe(banco);
    var cfg = store.get(KEY_CFG, {})['practica_' + examenId] || {};
    var cantidad = cfg.cantidad || 0;   // 0 = todas
    var sel = {};
    temas.forEach(function (t) { sel[t.tema] = !cfg.temas || cfg.temas.indexOf(t.tema) >= 0; });

    var html = '<div class="card"><h1>Práctica · ' + esc(ex.nombre) + '</h1>' +
      '<p class="muted">Verás si acertaste, la explicación y por qué las opciones incorrectas lo son, justo después de responder cada pregunta.</p>' +
      '<div class="form-row"><label class="title">Temas</label>' +
      '<div style="margin-bottom:6px"><button class="btn sm" id="todos">Todos</button> <button class="btn sm" id="ninguno">Ninguno</button></div>' +
      '<div class="topics">';
    temas.forEach(function (t, i) {
      html += '<label class="check"><input type="checkbox" data-t="' + i + '"' + (sel[t.tema] ? ' checked' : '') + '>' +
        '<span>' + esc(t.tema) + ' <span class="count">(' + t.n + ')</span></span></label>';
    });
    html += '</div></div>' +
      '<div class="form-row"><label class="title">Cantidad de preguntas</label>' +
      '<div class="seg" id="cant">' +
      [0, 10, 20, 30, 50].map(function (n) {
        return '<button data-n="' + n + '" class="' + (n === cantidad ? 'on' : '') + '">' + (n ? n : 'Todas') + '</button>';
      }).join('') +
      '</div></div>' +
      '<p class="muted small" id="disp"></p>' +
      '<div class="q-actions"><button class="btn" id="volver">Volver</button><span class="spacer"></span>' +
      '<button class="btn primary" id="empezar">Empezar práctica</button></div></div>';
    render(html);

    function seleccionadas() {
      return temas.filter(function (t, i) { return $app.querySelector('[data-t="' + i + '"]').checked; }).map(function (t) { return t.tema; });
    }
    function actualizar() {
      var ts = seleccionadas();
      var n = banco.filter(function (q) { return ts.indexOf(q.tema) >= 0; }).length;
      document.getElementById('disp').textContent = n + ' preguntas disponibles con los temas elegidos.';
      document.getElementById('empezar').disabled = n === 0;
    }
    $app.querySelectorAll('[data-t]').forEach(function (c) { c.addEventListener('change', actualizar); });
    document.getElementById('todos').onclick = function () { $app.querySelectorAll('[data-t]').forEach(function (c) { c.checked = true; }); actualizar(); };
    document.getElementById('ninguno').onclick = function () { $app.querySelectorAll('[data-t]').forEach(function (c) { c.checked = false; }); actualizar(); };
    $app.querySelectorAll('#cant button').forEach(function (b) {
      b.onclick = function () {
        cantidad = +b.getAttribute('data-n');
        $app.querySelectorAll('#cant button').forEach(function (x) { x.classList.toggle('on', x === b); });
      };
    });
    document.getElementById('volver').onclick = vistaInicio;
    document.getElementById('empezar').onclick = function () {
      var ts = seleccionadas();
      var all = store.get(KEY_CFG, {});
      all['practica_' + examenId] = { cantidad: cantidad, temas: ts };
      store.set(KEY_CFG, all);
      var pool = shuffle(banco.filter(function (q) { return ts.indexOf(q.tema) >= 0; }));
      if (cantidad) pool = pool.slice(0, cantidad);
      iniciarSesion(examenId, 'practica', pool, { origen: ts.length < temas.length ? 'temas filtrados' : '' });
    };
    actualizar();
  }

  // ============================================================
  //  VISTA: CONFIGURAR EXAMEN
  // ============================================================
  function vistaConfigExamen(examenId) {
    var ex = EXAMENES[examenId], banco = ex.banco();
    var cfg = store.get(KEY_CFG, {})['examen_' + examenId] || {};
    var nPreg = Math.min(cfg.preguntas || ex.preguntas, banco.length);
    var minutos = cfg.minutos || ex.minutos;
    var hayDuplas = ex.simulacros && banco.length >= ex.preguntas * ex.simulacros;
    var fuente = 'aleatorio';

    var html = '<div class="card"><h1>Modo examen · ' + esc(ex.nombre) + '</h1>' +
      '<p class="muted">Simulación con cronómetro. Puedes navegar entre preguntas y marcarlas para revisar. ' +
      'No verás retroalimentación hasta entregar. En preguntas de selección múltiple solo cuentan como correctas si marcas exactamente todas las opciones correctas. ' +
      'Al acabarse el tiempo, el examen se entrega automáticamente.</p>';

    if (ex.configurable) {
      html += '<div class="form-row"><label class="title" for="nPreg">Número de preguntas</label>' +
        '<input type="number" id="nPreg" min="1" max="' + banco.length + '" value="' + nPreg + '"> <span class="muted small">de ' + banco.length + ' en el banco</span></div>' +
        '<div class="form-row"><label class="title" for="nMin">Tiempo (minutos)</label>' +
        '<input type="number" id="nMin" min="1" max="600" value="' + minutos + '"></div>';
    } else {
      html += '<div class="stats-row" style="margin:14px 0"><span><strong>' + ex.preguntas + '</strong> preguntas</span>' +
        '<span><strong>' + ex.minutos + '</strong> minutos</span><span>Aprobación: <strong>' + ex.umbral + '%</strong></span></div>';
      if (banco.length < ex.preguntas) {
        html += '<div class="notice warn">El banco tiene ' + banco.length + ' preguntas; el simulacro usará todas (el examen real tiene ' + ex.preguntas + '). El tiempo se ajusta en proporción.</div>';
      }
      if (hayDuplas) {
        html += '<div class="form-row"><label class="title">Preguntas</label><div class="seg" id="fuente">' +
          '<button data-f="aleatorio" class="on">Aleatorias del banco</button>';
        for (var k = 1; k <= ex.simulacros; k++) html += '<button data-f="' + k + '">Simulacro ' + k + '</button>';
        html += '</div><p class="muted small">Los simulacros 1, 2 y 3 usan conjuntos fijos de ' + ex.preguntas + ' preguntas distintas entre sí (el orden sigue siendo aleatorio).</p></div>';
      }
    }
    html += '<div class="q-actions"><button class="btn" id="volver">Volver</button><span class="spacer"></span>' +
      '<button class="btn primary" id="empezar">Comenzar examen</button></div></div>';
    render(html);

    $app.querySelectorAll('#fuente button').forEach(function (b) {
      b.onclick = function () {
        fuente = b.getAttribute('data-f');
        $app.querySelectorAll('#fuente button').forEach(function (x) { x.classList.toggle('on', x === b); });
      };
    });
    document.getElementById('volver').onclick = vistaInicio;
    document.getElementById('empezar').onclick = function () {
      var pool, min, origen = '';
      if (ex.configurable) {
        var n = Math.max(1, Math.min(banco.length, parseInt(document.getElementById('nPreg').value, 10) || ex.preguntas));
        min = Math.max(1, Math.min(600, parseInt(document.getElementById('nMin').value, 10) || ex.minutos));
        var all = store.get(KEY_CFG, {});
        all['examen_' + examenId] = { preguntas: n, minutos: min };
        store.set(KEY_CFG, all);
        pool = shuffle(banco).slice(0, n);
      } else if (fuente !== 'aleatorio') {
        var k = +fuente;
        pool = shuffle(banco.filter(function (q, i) { return i % ex.simulacros === k - 1; }).slice(0, ex.preguntas));
        min = ex.minutos;
        origen = 'simulacro ' + k;
      } else {
        pool = shuffle(banco).slice(0, ex.preguntas);
        min = pool.length < ex.preguntas ? Math.max(1, Math.round(ex.minutos * pool.length / ex.preguntas)) : ex.minutos;
      }
      iniciarSesion(examenId, 'examen', pool, { minutos: min, origen: origen });
    };
  }

  // ============================================================
  //  SESIÓN
  // ============================================================
  function iniciarSesion(examenId, modo, preguntas, opts) {
    limpiarSesion();
    S = {
      examenId: examenId,
      modo: modo,
      origen: opts.origen || '',
      items: preguntas.map(function (q) {
        return { q: q, orden: shuffle(q.opciones.map(function (o) { return o.id; })) };
      }),
      resp: preguntas.map(function () { return []; }),
      confirmadas: preguntas.map(function () { return false; }),
      marcadas: preguntas.map(function () { return false; }),
      idx: 0,
      inicio: Date.now(),
      fin: modo === 'examen' ? Date.now() + opts.minutos * 60000 : null,
      minutos: opts.minutos || null,
      terminado: false
    };
    if (modo === 'examen') {
      timerId = setInterval(tick, 1000);
      vistaExamen();
    } else {
      vistaPractica();
    }
  }

  function tick() {
    if (!S || S.terminado) return;
    var rest = (S.fin - Date.now()) / 1000;
    var el = document.getElementById('timer');
    if (el) {
      el.textContent = fmtTiempo(rest);
      el.classList.toggle('low', rest <= 300);
    }
    if (rest <= 0) {
      entregar(true);
    }
  }

  function opcionPorId(q, id) {
    for (var i = 0; i < q.opciones.length; i++) if (q.opciones[i].id === id) return q.opciones[i];
    return null;
  }

  // ---------- Renderizado de piezas de pregunta ----------
  function renderExhibit(ex) {
    if (!ex) return '';
    var tablas = Array.isArray(ex) ? ex : [ex];
    var html = '<div class="exhibit">';
    tablas.forEach(function (t) {
      var cols = t.columnas || (t.estructura ? ['Columna', 'Tipo de dato', 'Restricciones'] : []);
      var filas = t.filas || t.estructura || [];
      html += '<div class="exhibit-table">' + (t.titulo ? '<div class="exhibit-title">' + esc(t.titulo) + '</div>' : '') +
        '<div class="table-wrap"><table class="data"><thead><tr>' +
        cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') +
        '</tr></thead><tbody>' +
        filas.map(function (f) {
          return '<tr>' + f.map(function (v) {
            return v === null ? '<td><span class="null">(null)</span></td>' : '<td>' + esc(v) + '</td>';
          }).join('') + '</tr>';
        }).join('') +
        '</tbody></table></div></div>';
    });
    return html + '</div>';
  }

  function renderTextoOpcion(t) {
    if (/\n/.test(t)) return '<pre class="sql">' + hlSQL(t) + '</pre>';
    return fmt(t);
  }

  function cuantasElegir(q) {
    return q.correctas.length;
  }

  function cabeceraPregunta(i, total, q) {
    return '<div class="q-head"><span class="num">Pregunta ' + (i + 1) + ' de ' + total + '</span>' +
      '<span class="chip">' + esc(q.tema) + '</span>' +
      (q.tipo === 'multiple' ? '<span class="chip warn">Selección múltiple</span>' : '') + '</div>';
  }

  function cuerpoPregunta(q) {
    return '<p class="q-text">' + fmt(q.enunciado) + '</p>' +
      renderExhibit(q.exhibit) +
      (q.codigo ? '<pre class="sql">' + hlSQL(q.codigo) + '</pre>' : '');
  }

  // Opciones. estado: null (editable) o {revelar:true}
  function renderOpciones(it, seleccion, revelar) {
    var q = it.q, multi = q.tipo === 'multiple';
    var name = 'opt_' + q.id.replace(/[^A-Za-z0-9_]/g, '_');
    var html = '';
    if (multi && !revelar) {
      html += '<p class="multi-hint">Selecciona ' + cuantasElegir(q) + ' opciones. <span id="cnt">(' + seleccion.length + ' seleccionadas)</span></p>';
    }
    html += '<div class="options">';
    it.orden.forEach(function (oid, i) {
      var o = opcionPorId(q, oid);
      var marcada = seleccion.indexOf(oid) >= 0;
      var esCorrecta = q.correctas.indexOf(oid) >= 0;
      var cls = 'opt', tag = '';
      if (revelar) {
        cls += ' locked';
        if (esCorrecta && marcada) { cls += ' correct'; tag = '✓ Correcta'; }
        else if (esCorrecta) { cls += ' missed'; tag = 'Correcta (no marcada)'; }
        else if (marcada) { cls += ' wrong'; tag = '✗ Incorrecta'; }
      } else if (marcada) cls += ' selected';
      html += '<label class="' + cls + '" data-oid="' + esc(oid) + '">' +
        '<input type="' + (multi ? 'checkbox' : 'radio') + '" name="' + name + '" value="' + esc(oid) + '"' +
        (marcada ? ' checked' : '') + (revelar ? ' disabled' : '') + '>' +
        '<span class="letter">' + letra(i) + '.</span>' +
        '<span class="opt-text">' + renderTextoOpcion(o.texto) + '</span>' +
        (tag ? '<span class="tag">' + tag + '</span>' : '') + '</label>';
    });
    return html + '</div>';
  }

  function bindOpciones(it, seleccion, onChange) {
    var multi = it.q.tipo === 'multiple';
    $app.querySelectorAll('.options input').forEach(function (inp) {
      inp.addEventListener('change', function () {
        var v = inp.value;
        if (multi) {
          var k = seleccion.indexOf(v);
          if (inp.checked && k < 0) seleccion.push(v);
          if (!inp.checked && k >= 0) seleccion.splice(k, 1);
        } else {
          seleccion.length = 0;
          seleccion.push(v);
        }
        $app.querySelectorAll('.options .opt').forEach(function (l) {
          l.classList.toggle('selected', seleccion.indexOf(l.getAttribute('data-oid')) >= 0);
        });
        var cnt = document.getElementById('cnt');
        if (cnt) cnt.textContent = '(' + seleccion.length + ' seleccionadas)';
        if (onChange) onChange();
      });
    });
  }

  function toggleOpcionPorTecla(e, it) {
    var k = e.key.toUpperCase(), i = -1;
    if (/^[1-9]$/.test(k)) i = +k - 1;
    else if (/^[A-H]$/.test(k)) i = k.charCodeAt(0) - 65;
    if (i < 0 || i >= it.orden.length) return false;
    var inp = $app.querySelectorAll('.options input')[i];
    if (!inp || inp.disabled) return false;
    if (inp.type === 'checkbox') inp.checked = !inp.checked; else inp.checked = true;
    inp.dispatchEvent(new Event('change'));
    return true;
  }

  // Explicación completa (correctas + porQueNo)
  function renderExplicacion(it, seleccion, soloMarcadas) {
    var q = it.q;
    var correctasTxt = it.orden.map(function (oid, i) {
      return q.correctas.indexOf(oid) >= 0 ? letra(i) : null;
    }).filter(Boolean).join(', ');
    var html = '<div class="explain"><h4>Respuesta correcta: ' + correctasTxt + '</h4><p>' + fmt(q.explicacion) + '</p>';
    var distractores = it.orden.map(function (oid, i) { return { oid: oid, i: i }; })
      .filter(function (x) { return q.correctas.indexOf(x.oid) < 0; });
    var marcadasMal = distractores.filter(function (x) { return seleccion.indexOf(x.oid) >= 0; });
    function li(x) {
      var o = opcionPorId(q, x.oid);
      var por = (q.porQueNo && q.porQueNo[x.oid]) || '';
      var txt = o.texto.indexOf('\n') >= 0 ? '' : ' <span class="muted">(' + fmt(o.texto.length > 90 ? o.texto.slice(0, 87) + '…' : o.texto) + ')</span>';
      return '<li class="' + (seleccion.indexOf(x.oid) >= 0 ? 'chosen' : '') + '"><strong>' + letra(x.i) + '</strong>' + txt + ': ' + fmt(por) + '</li>';
    }
    if (marcadasMal.length) {
      html += '<h4 style="margin-top:10px">Por qué lo que marcaste es incorrecto</h4><ul>' + marcadasMal.map(li).join('') + '</ul>';
    }
    var resto = soloMarcadas ? distractores.filter(function (x) { return seleccion.indexOf(x.oid) < 0; }) : distractores;
    if (resto.length) {
      if (soloMarcadas) {
        html += '<details class="why-not"><summary>Por qué las demás opciones son incorrectas</summary><ul>' + resto.map(li).join('') + '</ul></details>';
      } else if (!marcadasMal.length || resto.length !== marcadasMal.length) {
        html += '<h4 style="margin-top:10px">Por qué cada distractor es incorrecto</h4><ul>' + resto.map(li).join('') + '</ul>';
      }
    }
    return html + '</div>';
  }

  function esCorrecta(it, sel) { return mismoConjunto(sel, it.q.correctas); }

  // ============================================================
  //  VISTA: PRÁCTICA
  // ============================================================
  function vistaPractica() {
    var ex = EXAMENES[S.examenId], i = S.idx, it = S.items[i], sel = S.resp[i];
    var total = S.items.length, conf = S.confirmadas[i];
    var respondidas = S.confirmadas.filter(Boolean).length;
    var aciertos = S.items.filter(function (x, k) { return S.confirmadas[k] && esCorrecta(x, S.resp[k]); }).length;

    var html = '<div class="exam-bar"><div class="title">Práctica · ' + esc(ex.nombre) +
      (S.origen ? ' <span class="muted small">(' + esc(S.origen) + ')</span>' : '') + '</div>' +
      '<span class="chip ok">Aciertos: ' + aciertos + ' / ' + respondidas + '</span>' +
      '<button class="btn sm" id="terminar">Terminar</button></div>' +
      '<div class="progress"><div style="width:' + (100 * respondidas / total) + '%"></div></div>' +
      '<div class="card">' + cabeceraPregunta(i, total, it.q) + cuerpoPregunta(it.q) +
      renderOpciones(it, sel, conf);

    if (conf) {
      var ok = esCorrecta(it, sel);
      html += '<div class="feedback ' + (ok ? 'ok' : 'bad') + '"><div class="verdict">' + (ok ? '✓ ¡Correcto!' : '✗ Incorrecto') + '</div>' +
        (!ok && it.q.tipo === 'multiple' ? '<div class="small">En selección múltiple debes marcar exactamente todas las correctas.</div>' : '') +
        renderExplicacion(it, sel, true) + '</div>';
    }

    html += '<div class="q-actions">' +
      (i > 0 ? '<button class="btn" id="prev">← Anterior</button>' : '') +
      '<span class="spacer"></span>' +
      (conf
        ? (i < total - 1 ? '<button class="btn primary" id="next">Siguiente →</button>' : '<button class="btn primary" id="fin">Ver resumen</button>')
        : '<button class="btn primary" id="responder"' + (sel.length ? '' : ' disabled') + '>Responder</button>') +
      '</div><p class="kbd-hint hide-sm">Atajos: <kbd>A</kbd>–<kbd>F</kbd> o <kbd>1</kbd>–<kbd>6</kbd> para elegir, <kbd>Enter</kbd> para responder / avanzar.</p></div>';
    render(html);

    if (!conf) {
      bindOpciones(it, sel, function () { document.getElementById('responder').disabled = sel.length === 0; });
    }
    var bPrev = document.getElementById('prev'), bNext = document.getElementById('next'),
      bResp = document.getElementById('responder'), bFin = document.getElementById('fin');
    if (bPrev) bPrev.onclick = function () { S.idx--; vistaPractica(); };
    if (bNext) bNext.onclick = function () { S.idx++; vistaPractica(); };
    if (bFin) bFin.onclick = function () { entregar(false); };
    if (bResp) bResp.onclick = function () {
      if (!sel.length) return;
      S.confirmadas[i] = true;
      vistaPractica();
      var fb = $app.querySelector('.feedback');
      if (fb && fb.scrollIntoView) fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    document.getElementById('terminar').onclick = function () {
      if (respondidas === 0) { limpiarSesion(); vistaInicio(); return; }
      if (confirm('¿Terminar la práctica y ver el resumen de las ' + respondidas + ' preguntas respondidas?')) entregar(false);
    };
    setKeys(function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var b = document.getElementById('responder') || document.getElementById('next') || document.getElementById('fin');
        if (b && !b.disabled) b.click();
      } else if (!conf && toggleOpcionPorTecla(e, it)) e.preventDefault();
    });
  }

  // ============================================================
  //  VISTA: EXAMEN
  // ============================================================
  function vistaExamen() {
    var ex = EXAMENES[S.examenId], i = S.idx, it = S.items[i], sel = S.resp[i], total = S.items.length;
    var html = '<div class="exam-bar"><div class="title">' + esc(ex.nombre) +
      (S.origen ? ' <span class="muted small">(' + esc(S.origen) + ')</span>' : '') + '</div>' +
      '<span class="timer" id="timer">' + fmtTiempo((S.fin - Date.now()) / 1000) + '</span></div>' +
      '<div class="exam-layout"><div>' +
      '<div class="card">' + cabeceraPregunta(i, total, it.q) + cuerpoPregunta(it.q) +
      renderOpciones(it, sel, false) +
      '<div class="q-actions">' +
      '<button class="btn" id="prev"' + (i === 0 ? ' disabled' : '') + '>← Anterior</button>' +
      '<button class="btn' + (S.marcadas[i] ? ' active' : '') + '" id="marcar">' + (S.marcadas[i] ? '★ Marcada' : '☆ Marcar para revisar') + '</button>' +
      '<span class="spacer"></span>' +
      (i < total - 1 ? '<button class="btn primary" id="next">Siguiente →</button>' : '<button class="btn primary" id="entregar2">Entregar examen</button>') +
      '</div><p class="kbd-hint hide-sm">Atajos: <kbd>A</kbd>–<kbd>F</kbd> elegir, <kbd>←</kbd>/<kbd>→</kbd> navegar, <kbd>M</kbd> marcar.</p></div></div>' +
      '<aside class="card panel" id="panel"></aside></div>';
    render(html);
    pintarPanel();
    tick();

    bindOpciones(it, sel, pintarPanel);
    document.getElementById('prev').onclick = function () { irA(i - 1); };
    var bn = document.getElementById('next');
    if (bn) bn.onclick = function () { irA(i + 1); };
    var be = document.getElementById('entregar2');
    if (be) be.onclick = confirmarEntrega;
    document.getElementById('marcar').onclick = function () { S.marcadas[i] = !S.marcadas[i]; vistaExamenKeepScroll(); };
    setKeys(function (e) {
      if (e.key === 'ArrowRight' && i < total - 1) { e.preventDefault(); irA(i + 1); }
      else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); irA(i - 1); }
      else if (e.key === 'm' || e.key === 'M') { e.preventDefault(); S.marcadas[i] = !S.marcadas[i]; vistaExamenKeepScroll(); }
      else if (toggleOpcionPorTecla(e, it)) e.preventDefault();
    });
  }

  function vistaExamenKeepScroll() {
    var y = window.scrollY;
    vistaExamen();
    window.scrollTo(0, y);
  }

  function irA(k) {
    if (k < 0 || k >= S.items.length) return;
    S.idx = k;
    vistaExamen();
  }

  function pintarPanel() {
    var p = document.getElementById('panel');
    if (!p) return;
    var total = S.items.length;
    var resp = S.resp.filter(function (r) { return r.length > 0; }).length;
    var marc = S.marcadas.filter(Boolean).length;
    var html = '<h3>Preguntas</h3>' +
      '<div class="panel-stats"><div><span>Respondidas</span><strong>' + resp + ' / ' + total + '</strong></div>' +
      '<div><span>Pendientes</span><strong>' + (total - resp) + '</strong></div>' +
      '<div><span>Marcadas para revisar</span><strong>' + marc + '</strong></div></div>' +
      '<div class="nav-grid">';
    for (var k = 0; k < total; k++) {
      var cls = [];
      if (S.resp[k].length) cls.push('answered');
      if (S.marcadas[k]) cls.push('marked');
      if (k === S.idx) cls.push('current');
      html += '<button class="' + cls.join(' ') + '" data-k="' + k + '" title="Pregunta ' + (k + 1) + '">' + (k + 1) + '</button>';
    }
    html += '</div><div class="legend"><span class="l-ans">Respondida</span><span class="l-pend">Pendiente</span><span class="l-mark">Marcada</span></div>' +
      '<div class="q-actions" style="margin-top:6px">' +
      (marc ? '<button class="btn sm" id="sigMarcada">Ir a siguiente marcada</button>' : '') +
      ((total - resp) ? '<button class="btn sm" id="sigPend">Ir a siguiente pendiente</button>' : '') +
      '</div><button class="btn primary" id="entregar" style="width:100%;margin-top:12px">Entregar examen</button>';
    p.innerHTML = html;
    p.querySelectorAll('[data-k]').forEach(function (b) { b.onclick = function () { irA(+b.getAttribute('data-k')); }; });
    document.getElementById('entregar').onclick = confirmarEntrega;
    function siguiente(pred) {
      for (var d = 1; d <= total; d++) { var k = (S.idx + d) % total; if (pred(k)) return irA(k); }
    }
    var sm = document.getElementById('sigMarcada'), sp = document.getElementById('sigPend');
    if (sm) sm.onclick = function () { siguiente(function (k) { return S.marcadas[k]; }); };
    if (sp) sp.onclick = function () { siguiente(function (k) { return !S.resp[k].length; }); };
  }

  function confirmarEntrega() {
    var pend = S.resp.filter(function (r) { return !r.length; }).length;
    var marc = S.marcadas.filter(Boolean).length;
    var msg = '¿Entregar el examen?';
    if (pend) msg += '\n\nTienes ' + pend + ' pregunta(s) sin responder (contarán como incorrectas).';
    if (marc) msg += '\nTienes ' + marc + ' pregunta(s) marcadas para revisar.';
    if (confirm(msg)) entregar(false);
  }

  // ============================================================
  //  ENTREGA Y RESULTADOS
  // ============================================================
  function entregar(porTiempo) {
    if (!S || S.terminado) return;
    S.terminado = true;
    if (timerId) { clearInterval(timerId); timerId = null; }
    var ex = EXAMENES[S.examenId];
    var duracion = (Date.now() - S.inicio) / 1000;
    if (S.modo === 'examen' && S.fin) duracion = Math.min(duracion, S.minutos * 60);

    // En práctica solo cuentan las respondidas; en examen todas.
    var indices = S.items.map(function (x, k) { return k; })
      .filter(function (k) { return S.modo === 'examen' || S.confirmadas[k]; });
    var resultados = indices.map(function (k) {
      var it = S.items[k];
      return { k: k, id: it.q.id, tema: it.q.tema, correcta: esCorrecta(it, S.resp[k]), respondida: S.resp[k].length > 0 };
    });
    var correctas = resultados.filter(function (r) { return r.correcta; }).length;
    var total = resultados.length;
    var puntaje = total ? Math.round(1000 * correctas / total) / 10 : 0;
    var aprobado = puntaje >= ex.umbral;

    S.resultado = { resultados: resultados, correctas: correctas, total: total, puntaje: puntaje, aprobado: aprobado, duracion: duracion, porTiempo: porTiempo };

    if (total) {
      actualizarErrores(S.examenId, resultados);
      guardarIntento({
        fecha: new Date().toISOString(),
        examen: S.examenId,
        modo: S.modo,
        origen: S.origen,
        total: total,
        correctas: correctas,
        puntaje: puntaje,
        aprobado: aprobado,
        duracion: Math.round(duracion),
        fallos: resultados.filter(function (r) { return !r.correcta; }).map(function (r) { return r.id; })
      });
    }
    vistaResultados('todas');
  }

  function vistaResultados(filtro) {
    var ex = EXAMENES[S.examenId], R = S.resultado;
    if (!R.total) { limpiarSesion(); vistaInicio(); return; }
    var esExamen = S.modo === 'examen';

    // Puntaje por tema
    var porTema = {}, ordenTemas = [];
    R.resultados.forEach(function (r) {
      if (!porTema[r.tema]) { porTema[r.tema] = { ok: 0, n: 0 }; ordenTemas.push(r.tema); }
      porTema[r.tema].n++;
      if (r.correcta) porTema[r.tema].ok++;
    });

    var html = '';
    if (R.porTiempo) html += '<div class="notice warn">Se acabó el tiempo: el examen se entregó automáticamente.</div>';
    html += '<div class="card"><h1>' + (esExamen ? 'Resultado del examen' : 'Resumen de la práctica') + ' · ' + esc(ex.nombre) + '</h1>' +
      '<div class="score-hero"><div class="score-big ' + (R.aprobado ? 'ok' : 'bad') + '">' + R.puntaje + '%</div>' +
      '<div><div class="verdict-badge ' + (R.aprobado ? 'ok' : 'bad') + '">' + (R.aprobado ? 'APROBADO' : 'REPROBADO') + '</div>' +
      '<div class="muted small" style="margin-top:6px">Umbral de aprobación: ' + ex.umbral + '%' + (esExamen ? '' : ' (referencial en práctica)') + '</div></div></div>' +
      '<div class="stats-row" style="margin-top:14px">' +
      '<span>Correctas: <strong>' + R.correctas + ' / ' + R.total + '</strong></span>' +
      (esExamen ? '<span>Sin responder: <strong>' + R.resultados.filter(function (r) { return !r.respondida; }).length + '</strong></span>' : '') +
      '<span>Tiempo: <strong>' + fmtTiempo(R.duracion) + '</strong>' + (esExamen ? ' de ' + S.minutos + ':00' : '') + '</span></div>' +
      '<div class="q-actions"><button class="btn" id="inicio">Volver al inicio</button>' +
      (R.correctas < R.total ? '<button class="btn" id="repasar">Repasar los fallos de este intento</button>' : '') +
      '<button class="btn primary" id="otra">' + (esExamen ? 'Nuevo examen' : 'Nueva práctica') + '</button></div></div>';

    html += '<div class="card"><h2>Puntaje por tema</h2><div class="table-wrap"><table class="data"><thead><tr><th>Tema</th><th>Correctas</th><th>%</th><th style="width:30%"></th></tr></thead><tbody>';
    ordenTemas.forEach(function (t) {
      var p = porTema[t], pct = Math.round(100 * p.ok / p.n), ok = pct >= ex.umbral;
      html += '<tr><td>' + esc(t) + '</td><td>' + p.ok + ' / ' + p.n + '</td><td>' + pct + '%</td>' +
        '<td><div class="bar"><div class="' + (ok ? 'ok' : 'bad') + '" style="width:' + pct + '%"></div></div></td></tr>';
    });
    html += '</tbody></table></div></div>';

    // Revisión
    var nMal = R.resultados.filter(function (r) { return !r.correcta; }).length;
    html += '<div class="card" id="revision"><div class="section-head"><h2>Revisión de preguntas</h2>' +
      '<div class="review-filter">' +
      '<button class="btn sm' + (filtro === 'todas' ? ' active' : '') + '" data-f="todas">Todas (' + R.total + ')</button>' +
      '<button class="btn sm' + (filtro === 'mal' ? ' active' : '') + '" data-f="mal">Incorrectas (' + nMal + ')</button>' +
      '<button class="btn sm' + (filtro === 'bien' ? ' active' : '') + '" data-f="bien">Correctas (' + (R.total - nMal) + ')</button>' +
      '</div></div>';

    if (esExamen) {
      html += '<div class="nav-grid" style="margin-bottom:6px">';
      R.resultados.forEach(function (r, n) {
        html += '<button class="' + (r.correcta ? 'res-ok' : 'res-bad') + '" data-goto="' + n + '">' + (n + 1) + '</button>';
      });
      html += '</div>';
    }

    var mostrados = 0;
    R.resultados.forEach(function (r, n) {
      if (filtro === 'mal' && r.correcta) return;
      if (filtro === 'bien' && !r.correcta) return;
      mostrados++;
      var it = S.items[r.k], sel = S.resp[r.k];
      html += '<div class="review-item" id="rev' + n + '">' +
        '<div class="q-head"><span class="num">Pregunta ' + (n + 1) + '</span><span class="chip">' + esc(it.q.tema) + '</span>' +
        (it.q.tipo === 'multiple' ? '<span class="chip warn">Selección múltiple</span>' : '') +
        '<span class="chip ' + (r.correcta ? 'ok' : 'bad') + '">' + (r.correcta ? 'Correcta' : (r.respondida ? 'Incorrecta' : 'Sin responder')) + '</span>' +
        '<span class="muted small">' + esc(it.q.id) + '</span></div>' +
        cuerpoPregunta(it.q) + renderOpciones(it, sel, true) + renderExplicacion(it, sel, false) + '</div>';
    });
    if (!mostrados) html += '<div class="empty">No hay preguntas en este filtro.</div>';
    html += '</div>';

    render(html);
    document.getElementById('inicio').onclick = function () { limpiarSesion(); vistaInicio(); };
    document.getElementById('otra').onclick = function () {
      var id = S.examenId, m = S.modo;
      limpiarSesion();
      if (m === 'examen') vistaConfigExamen(id); else vistaConfigPractica(id);
    };
    var br = document.getElementById('repasar');
    if (br) br.onclick = function () {
      var id = S.examenId, ids = R.resultados.filter(function (r) { return !r.correcta; }).map(function (r) { return r.id; });
      limpiarSesion();
      iniciarRepaso(id, ids, 'fallos de un intento');
    };
    $app.querySelectorAll('[data-f]').forEach(function (b) {
      b.onclick = function () {
        vistaResultados(b.getAttribute('data-f'));
        var rv = document.getElementById('revision');
        if (rv) rv.scrollIntoView();
      };
    });
    $app.querySelectorAll('[data-goto]').forEach(function (b) {
      b.onclick = function () {
        var n = b.getAttribute('data-goto');
        var el = document.getElementById('rev' + n);
        if (!el) { vistaResultados('todas'); el = document.getElementById('rev' + n); }
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      };
    });
  }

  // ---------- Validación del banco (ayuda al añadir preguntas) ----------
  function validarBancos() {
    var vistos = {}, problemas = [];
    ORDEN_EXAMENES.forEach(function (exId) {
      EXAMENES[exId].banco().forEach(function (q, i) {
        var ref = exId + '[' + i + '] ' + (q.id || '(sin id)');
        if (!q.id) problemas.push(ref + ': falta id');
        else if (vistos[q.id]) problemas.push(ref + ': id duplicado');
        vistos[q.id] = true;
        if (!q.tema || !q.enunciado || !q.explicacion) problemas.push(ref + ': falta tema/enunciado/explicacion');
        if (q.tipo !== 'unica' && q.tipo !== 'multiple') problemas.push(ref + ': tipo inválido');
        if (!Array.isArray(q.opciones) || q.opciones.length < 2) { problemas.push(ref + ': opciones insuficientes'); return; }
        var ids = q.opciones.map(function (o) { return o.id; });
        if (!Array.isArray(q.correctas) || !q.correctas.length) problemas.push(ref + ': sin correctas');
        else {
          q.correctas.forEach(function (c) { if (ids.indexOf(c) < 0) problemas.push(ref + ': correcta inexistente ' + c); });
          if (q.tipo === 'unica' && q.correctas.length !== 1) problemas.push(ref + ': "unica" con ' + q.correctas.length + ' correctas');
          if (q.tipo === 'multiple' && q.correctas.length < 2) problemas.push(ref + ': "multiple" con menos de 2 correctas');
        }
        ids.forEach(function (oid) {
          if (q.correctas.indexOf(oid) < 0 && !(q.porQueNo && q.porQueNo[oid])) problemas.push(ref + ': falta porQueNo de ' + oid);
        });
      });
    });
    if (problemas.length && window.console) console.warn('Problemas en los bancos de preguntas:\n' + problemas.join('\n'));
    return problemas;
  }
  window.validarBancos = validarBancos;

  validarBancos();
  vistaInicio();
})();
