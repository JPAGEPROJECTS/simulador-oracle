// Valida la estructura de los bancos de preguntas.
// Uso: node tools/validar.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const dir = path.join(__dirname, '..', 'js', 'data');
const archivos = [
  ['foundation.js', 'BANCO_FOUNDATION', 'foundation'],
  ['design.js', 'BANCO_DESIGN', 'design'],
  ['programming.js', 'BANCO_PROGRAMMING', 'programming'],
  ['exam071.js', 'BANCO_071', 'exam071']
];

const ctx = {};
vm.createContext(ctx);
let problemas = 0;
const ids = new Set();
const enunciados = new Map();

for (const [file, varName, examen] of archivos) {
  vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8') + `\nthis.${varName} = ${varName};`, ctx, { filename: file });
  const banco = ctx[varName];
  const err = (q, msg) => { problemas++; console.log(`  [${file}] ${q.id || '?'}: ${msg}`); };
  const temas = {};
  let multi = 0, exhibit = 0, codigo = 0;
  banco.forEach((q) => {
    if (!q.id) err(q, 'sin id');
    if (ids.has(q.id)) err(q, 'id duplicado');
    ids.add(q.id);
    if (q.examen !== examen) err(q, `examen "${q.examen}" no coincide con ${examen}`);
    for (const k of ['tema', 'enunciado', 'explicacion']) if (!q[k]) err(q, `falta ${k}`);
    if (!['unica', 'multiple'].includes(q.tipo)) err(q, 'tipo inválido');
    const opIds = (q.opciones || []).map((o) => o.id);
    if (opIds.length < 2) err(q, 'menos de 2 opciones');
    if (new Set(opIds).size !== opIds.length) err(q, 'ids de opción repetidos');
    (q.opciones || []).forEach((o) => { if (!o.texto) err(q, `opción ${o.id} sin texto`); });
    const textos = (q.opciones || []).map((o) => o.texto.trim());
    if (new Set(textos).size !== textos.length) err(q, 'textos de opción repetidos');
    if (!Array.isArray(q.correctas) || !q.correctas.length) err(q, 'sin correctas');
    (q.correctas || []).forEach((c) => { if (!opIds.includes(c)) err(q, `correcta inexistente: ${c}`); });
    if (q.tipo === 'unica' && q.correctas.length !== 1) err(q, 'unica con != 1 correcta');
    if (q.tipo === 'multiple') {
      multi++;
      if (q.correctas.length < 2) err(q, 'multiple con < 2 correctas');
      const palabra = { 2: 'dos', 3: 'tres', 4: 'cuatro' }[q.correctas.length];
      if (!new RegExp('Elige ' + palabra, 'i').test(q.enunciado)) err(q, `enunciado no dice "Elige ${palabra}"`);
    } else if (/Elige (dos|tres|cuatro)/i.test(q.enunciado)) err(q, 'unica pero el enunciado dice "Elige..."');
    opIds.forEach((o) => {
      if (!(q.correctas || []).includes(o) && !(q.porQueNo && q.porQueNo[o])) err(q, `falta porQueNo de ${o}`);
    });
    Object.keys(q.porQueNo || {}).forEach((k) => {
      if (!opIds.includes(k)) err(q, `porQueNo de opción inexistente ${k}`);
      if ((q.correctas || []).includes(k)) err(q, `porQueNo en opción correcta ${k}`);
    });
    if (/\bopci[oó]n(es)? [A-F]\b|\brespuesta [A-F]\b/.test(q.explicacion + JSON.stringify(q.porQueNo))) {
      err(q, 'la explicación menciona letras de opción (se barajan)');
    }
    const key = q.enunciado + (q.codigo || '');
    if (enunciados.has(key)) err(q, `enunciado+código idéntico a ${enunciados.get(key)}`);
    enunciados.set(key, q.id);
    if (q.exhibit) exhibit++;
    if (q.codigo) codigo++;
    temas[q.tema] = (temas[q.tema] || 0) + 1;
  });
  console.log(`\n${file}: ${banco.length} preguntas | multiple: ${multi} (${Math.round(100 * multi / banco.length)}%) | con exhibit: ${exhibit} | con código: ${codigo}`);
  Object.entries(temas).forEach(([t, n]) => console.log(`    ${String(n).padStart(3)}  ${t}`));
}
console.log(problemas ? `\n${problemas} problema(s) encontrados.` : '\nSin problemas de estructura.');
process.exit(problemas ? 1 : 0);
