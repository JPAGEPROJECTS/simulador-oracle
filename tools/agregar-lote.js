// Inserta un lote de preguntas al final del arreglo de un banco.
// Uso: node tools/agregar-lote.js js/data/exam071.js lote.js
// "lote.js" contiene objetos de pregunta separados por comas (sin corchetes).
const fs = require('fs');
const [destino, lote] = process.argv.slice(2);
let src = fs.readFileSync(destino, 'utf8');
const nuevo = fs.readFileSync(lote, 'utf8').trim().replace(/,\s*$/, '');
const cierre = src.lastIndexOf('];');
if (cierre < 0) throw new Error('No se encontró el cierre "];" del arreglo en ' + destino);
const fin = src.lastIndexOf('\n', cierre);
let antes = src.slice(0, fin).replace(/\s*$/, '');
if (!antes.endsWith('[') && !antes.endsWith(',')) antes += ',';
src = antes + '\n' + nuevo + '\n' + src.slice(fin + 1);
fs.writeFileSync(destino, src);
console.log('Lote agregado a ' + destino);
