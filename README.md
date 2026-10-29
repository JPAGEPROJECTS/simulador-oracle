# Simulador Oracle Database SQL (UTP/FISC)

Simulador de exámenes para la opción de graduación **Certificación Oracle Database SQL**:

| Examen | Banco | Formato por defecto | Aprobación |
|---|---|---|---|
| Database Foundation | 52 | 50 preguntas · 60 min (configurable) | 70% |
| Database Design | 52 | 50 preguntas · 60 min (configurable) | 70% |
| Programming with SQL | 62 | 50 preguntas · 60 min (configurable) | 70% |
| Oracle Database SQL 1Z0-071 | 198 | 63 preguntas · 120 min | 63% |

## Uso

Abre `index.html` con doble clic. No necesita servidor, instalación ni conexión a Internet.

- **Práctica**: filtra por tema y elige la cantidad de preguntas. Al responder cada pregunta ves si acertaste, cuál era la respuesta correcta, la explicación y por qué cada opción incorrecta lo es.
- **Examen**: tiene cronómetro, navegación libre, opción de marcar preguntas para revisar y panel de respondidas/pendientes. Se entrega automáticamente al acabarse el tiempo. En las preguntas "Elige dos/tres" solo se cuenta el acierto si marcas exactamente todas las correctas. Al final ves el puntaje, si aprobaste, el resultado por tema y la revisión completa.
- **1Z0-071**: además de un examen aleatorio, ofrece los **Simulacros 1, 2 y 3**, tres conjuntos fijos de 63 preguntas distintas entre sí.
- **Repasar mis errores**: el botón de cada examen reúne las preguntas que fallaste; una pregunta sale de la lista cuando la respondes bien. En el historial también puedes repasar los fallos de un intento concreto.
- Las preguntas y sus opciones se barajan en cada intento. Atajos de teclado: `A`–`F` o `1`–`6` para elegir, `Enter` para responder o avanzar, `←`/`→` para navegar y `M` para marcar.

El historial, la lista de errores, el tema claro/oscuro y las preferencias se guardan en el `localStorage` del navegador.

## Estructura

```
index.html
css/styles.css
js/app.js                  lógica de la aplicación
js/data/foundation.js      var BANCO_FOUNDATION = [...]
js/data/design.js          var BANCO_DESIGN = [...]
js/data/programming.js     var BANCO_PROGRAMMING = [...]
js/data/exam071.js         var BANCO_071 = (function () { ... return [...]; })();
tools/validar.js           valida la estructura de los bancos
tools/agregar-lote.js      añade un lote de preguntas al final de un banco
verify/                    scripts SQL de verificación (ver abajo)
```

## Añadir preguntas

Agrega un objeto al arreglo del banco correspondiente:

```js
{
  id: 'X199',                       // único en todos los bancos
  examen: 'exam071',                // foundation | design | programming | exam071
  tema: 'Joins',                    // reutiliza un tema existente para que agrupe bien
  tipo: 'multiple',                 // 'unica' o 'multiple'
  enunciado: '¿Qué dos ...? (Elige dos)',   // en 'multiple' debe decir "Elige dos/tres"
  exhibit: [                        // opcional: una o varias tablas
    { titulo: 'EMP', columnas: ['ID', 'NAME'], filas: [['1', 'Ana'], ['2', null]] },  // null se muestra como (null)
    { titulo: 'DEPT', estructura: [['DEPT_ID', 'NUMBER(4)', 'PRIMARY KEY']] }        // columna, tipo, restricciones
  ],
  codigo: 'SELECT ...\nFROM ...;',  // opcional, se muestra con fuente monoespaciada
  opciones: [{ id: 'a', texto: '...' }, { id: 'b', texto: '...' } /* ... */],
  correctas: ['a', 'c'],
  explicacion: 'Por qué las correctas lo son.',
  porQueNo: { b: 'Por qué b es incorrecta.', d: '...' }   // obligatorio para cada distractor
}
```

- Las opciones se barajan, así que **no hagas referencia a letras** ("la opción B") en las explicaciones.
- Un texto de opción con saltos de línea se muestra como bloque SQL. En enunciados y explicaciones, el texto entre `comillas invertidas` se muestra como código.
- En `exam071.js` puedes reutilizar las estructuras `T_EMP` y `T_DEPT` en `exhibit`.
- Después de editar, ejecuta `node tools/validar.js` (requiere Node.js). Detecta ids repetidos, correctas inexistentes, distractores sin `porQueNo`, enunciados "multiple" sin "Elige dos/tres", etc. Si abres la consola del navegador, `validarBancos()` hace una comprobación similar.

## Verificación de las respuestas

Las respuestas se comprobaron contra **Oracle Database 19c (19.3)** con el usuario de pruebas SIM071:

```
set NLS_LANG=AMERICAN_AMERICA.AL32UTF8
sqlplus -S <usuario>/<clave>@localhost:1521/COFFEEPDB @verify/setup.sql      # crea JOBS, DEPARTMENTS, EMPLOYEES
sqlplus -S <usuario>/<clave>@localhost:1521/COFFEEPDB @verify/lote01.sql     # etc.
```

Cada script indica con `PROMPT` el resultado esperado de cada pregunta. Algunos necesitan entrada por stdin, un argumento o una segunda sesión o usuario; esos detalles están en el comentario inicial de cada archivo (`x011.sql`, `x137_x138.sql`, `x197_emp_dept.sql`, `x009_*.sql`, `x163_*.sql`, `x190_*.sql`). `verify/estado.txt` indica, para cada pregunta, si se verificó ejecutándola (E) o solo por revisión (R).

Las preguntas asumen `NLS_LANGUAGE = AMERICAN` y `NLS_DATE_FORMAT = 'DD-MON-RR'`, igual que el examen real.
