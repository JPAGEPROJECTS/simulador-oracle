/* Banco: Programming with SQL (Oracle Academy) */
var BANCO_PROGRAMMING = [
  {
    id: 'P001', examen: 'programming', tema: 'SELECT y WHERE',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta consulta?',
    codigo: "SELECT last_name\nFROM   employees\nWHERE  last_name LIKE '_a%';",
    opciones: [
      { id: 'a', texto: 'Los apellidos cuya segunda letra es "a".' },
      { id: 'b', texto: 'Los apellidos que empiezan con "a".' },
      { id: 'c', texto: 'Los apellidos que contienen una "a" en cualquier posición.' },
      { id: 'd', texto: 'Los apellidos de exactamente dos letras que terminan en "a".' }
    ],
    correctas: ['a'],
    explicacion: 'En LIKE, `_` representa exactamente un carácter y `%` cero o más caracteres. "_a%" exige un carácter cualquiera seguido de "a" en la segunda posición. La comparación distingue mayúsculas y minúsculas.',
    porQueNo: {
      b: 'Para eso el patrón sería \'a%\'; el guion bajo obliga a que haya un carácter antes de la "a".',
      c: 'Para eso el patrón sería \'%a%\'.',
      d: 'El % final permite cualquier cantidad de caracteres después de la "a".'
    }
  },
  {
    id: 'P002', examen: 'programming', tema: 'NVL, NVL2, NULLIF y COALESCE',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta sentencia?',
    codigo: 'SELECT NVL2(NULL, 10, 20), NULLIF(5, 5), COALESCE(NULL, NULL, 7)\nFROM   dual;',
    opciones: [
      { id: 'a', texto: '20, NULL, 7' },
      { id: 'b', texto: '10, 5, 7' },
      { id: 'c', texto: '20, 5, NULL' },
      { id: 'd', texto: '10, NULL, 7' }
    ],
    correctas: ['a'],
    explicacion: 'NVL2(e, x, y) devuelve x si e no es NULL e y si es NULL → 20. NULLIF(a, b) devuelve NULL si a = b → NULL. COALESCE devuelve la primera expresión no nula → 7.',
    porQueNo: {
      b: 'NVL2 devuelve el segundo argumento solo si el primero NO es NULL, y NULLIF(5,5) devuelve NULL porque los valores son iguales.',
      c: 'NULLIF(5,5) devuelve NULL, y COALESCE encuentra el 7 como primer valor no nulo.',
      d: 'Como el primer argumento de NVL2 es NULL, se devuelve el tercero (20).'
    }
  },
  {
    id: 'P003', examen: 'programming', tema: 'Funciones de caracteres',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta sentencia?',
    codigo: "SELECT SUBSTR('DATABASE', 3, 4) || LENGTH('SQL') || INSTR('ORACLE', 'C')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'TABA34' },
      { id: 'b', texto: 'ATAB34' },
      { id: 'c', texto: 'TABA33' },
      { id: 'd', texto: 'TABAS34' }
    ],
    correctas: ['a'],
    explicacion: "SUBSTR('DATABASE', 3, 4) toma 4 caracteres desde la posición 3: 'TABA'. LENGTH('SQL') = 3. INSTR('ORACLE','C') = 4. La concatenación convierte los números a texto: 'TABA34'.",
    porQueNo: {
      b: "La posición 3 de 'DATABASE' es la 'T' (D=1, A=2, T=3).",
      c: "La 'C' está en la posición 4 de 'ORACLE' (O, R, A, C).",
      d: 'SUBSTR toma exactamente 4 caracteres: T, A, B, A.'
    }
  },
  {
    id: 'P004', examen: 'programming', tema: 'Funciones de grupo, GROUP BY y HAVING',
    tipo: 'unica',
    enunciado: 'La tabla SCORES contiene la columna PTS con los valores 10, 20, NULL y 30. ¿Qué devuelve la consulta?',
    exhibit: [{ titulo: 'SCORES', columnas: ['ID', 'PTS'], filas: [['1', '10'], ['2', '20'], ['3', null], ['4', '30']] }],
    codigo: 'SELECT COUNT(*), COUNT(pts), AVG(pts)\nFROM   scores;',
    opciones: [
      { id: 'a', texto: '4, 3, 20' },
      { id: 'b', texto: '4, 4, 15' },
      { id: 'c', texto: '3, 3, 20' },
      { id: 'd', texto: '4, 3, 15' }
    ],
    correctas: ['a'],
    explicacion: 'COUNT(*) cuenta todas las filas (4). COUNT(pts) y AVG(pts) ignoran los NULL: hay 3 valores y su promedio es (10+20+30)/3 = 20.',
    porQueNo: {
      b: 'COUNT(columna) no cuenta los NULL, y AVG no divide entre 4.',
      c: 'COUNT(*) cuenta todas las filas, incluidas las que tienen NULL.',
      d: 'AVG ignora los NULL: divide 60 entre 3, no entre 4. Para obtener 15 haría falta AVG(NVL(pts, 0)).'
    }
  },
  {
    id: 'P005', examen: 'programming', tema: 'JOINs',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar esta consulta?',
    codigo: 'SELECT department_id, department_name, last_name\nFROM   employees JOIN departments\nUSING  (department_id)\nWHERE  departments.department_id = 90;',
    opciones: [
      { id: 'a', texto: 'Falla: una columna usada en USING no puede llevar prefijo de tabla.' },
      { id: 'b', texto: 'Devuelve los empleados del departamento 90.' },
      { id: 'c', texto: 'Falla: department_id es ambigua en la lista del SELECT.' },
      { id: 'd', texto: 'Devuelve el producto cartesiano filtrado por el departamento 90.' }
    ],
    correctas: ['a'],
    explicacion: 'Las columnas de la cláusula USING no pueden calificarse con el nombre o alias de una tabla en ninguna parte de la consulta. Oracle devuelve ORA-25154: column part of USING clause cannot have qualifier.',
    porQueNo: {
      b: 'Sin el prefijo "departments." sí funcionaría, pero tal como está escrita da error.',
      c: 'Con USING la columna común se trata como una sola, por lo que department_id sin prefijo no es ambigua.',
      d: 'JOIN ... USING es un equijoin, no un producto cartesiano.'
    }
  },
  {
    id: 'P006', examen: 'programming', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: '¿Qué sucede si la subconsulta devuelve más de una fila?',
    codigo: 'SELECT last_name\nFROM   employees\nWHERE  salary = (SELECT salary\n                 FROM   employees\n                 WHERE  department_id = 60);',
    opciones: [
      { id: 'a', texto: 'Error ORA-01427: single-row subquery returns more than one row.' },
      { id: 'b', texto: 'Se compara solo con la primera fila devuelta.' },
      { id: 'c', texto: 'Se comporta como IN y devuelve todas las coincidencias.' },
      { id: 'd', texto: 'No devuelve filas, sin error.' }
    ],
    correctas: ['a'],
    explicacion: 'El operador = espera una subconsulta de una sola fila. Si devuelve varias, la sentencia falla con ORA-01427. Debe usarse IN, ANY o ALL.',
    porQueNo: {
      b: 'Oracle no toma la primera fila automáticamente; lanza un error.',
      c: 'Oracle no convierte = en IN; hay que escribir IN explícitamente.',
      d: 'Devolver varias filas a un operador de una fila es un error en tiempo de ejecución, no un resultado vacío. (Si la subconsulta no devolviera filas, ahí sí no habría error ni resultados.)'
    }
  },
  {
    id: 'P007', examen: 'programming', tema: 'Conversión de tipos',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta sentencia?',
    codigo: "SELECT TO_CHAR(1234.567, '$9,999.99')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: ' $1,234.57' },
      { id: 'b', texto: ' $1,234.56' },
      { id: 'c', texto: '##########' },
      { id: 'd', texto: ' $1234.567' }
    ],
    correctas: ['a'],
    explicacion: 'El modelo tiene dos decimales, por lo que TO_CHAR redondea 1234.567 a 1234.57. Se antepone un espacio reservado para el signo.',
    porQueNo: {
      b: 'TO_CHAR redondea, no trunca.',
      c: 'Los # aparecen cuando la parte entera no cabe en el formato; aquí 1234 cabe en 9,999.',
      d: 'El formato fija la coma de miles y dos decimales.'
    }
  },
  {
    id: 'P008', examen: 'programming', tema: 'DML',
    tipo: 'unica',
    enunciado: '¿Qué hace esta sentencia?',
    codigo: 'UPDATE employees\nSET    salary = salary * 1.1;',
    opciones: [
      { id: 'a', texto: 'Aumenta en 10% el salario de todas las filas de EMPLOYEES.' },
      { id: 'b', texto: 'Falla porque falta la cláusula WHERE.' },
      { id: 'c', texto: 'Aumenta el salario solo de la primera fila.' },
      { id: 'd', texto: 'Aumenta en 1.1 unidades el salario de todos los empleados.' }
    ],
    correctas: ['a'],
    explicacion: 'WHERE es opcional en UPDATE; sin ella se modifican todas las filas. Multiplicar por 1.1 equivale a un aumento del 10%. Los salarios NULL siguen siendo NULL.',
    porQueNo: {
      b: 'WHERE es opcional; omitirla no produce error.',
      c: 'Sin WHERE, el UPDATE afecta a todas las filas.',
      d: 'Es una multiplicación por 1.1, no una suma de 1.1.'
    }
  },
  {
    id: 'P009', examen: 'programming', tema: 'Restricciones',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las restricciones son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Una restricción PRIMARY KEY no permite valores NULL.' },
      { id: 'b', texto: 'Una restricción UNIQUE permite varias filas con NULL en la columna.' },
      { id: 'c', texto: 'Una tabla puede tener varias restricciones PRIMARY KEY.' },
      { id: 'd', texto: 'NOT NULL puede definirse a nivel de tabla.' },
      { id: 'e', texto: 'Una FOREIGN KEY no admite valores NULL.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'PRIMARY KEY = UNIQUE + NOT NULL. UNIQUE permite varios NULL, porque NULL no es igual a NULL (en una clave UNIQUE de una sola columna).',
    porQueNo: {
      c: 'Una tabla solo puede tener una PRIMARY KEY (aunque puede ser compuesta).',
      d: 'NOT NULL solo se define a nivel de columna.',
      e: 'Una FK admite NULL salvo que además tenga NOT NULL.'
    }
  },
  {
    id: 'P010', examen: 'programming', tema: 'ORDER BY',
    tipo: 'unica',
    enunciado: '¿Dónde aparecen las filas con COMMISSION_PCT NULL en el resultado?',
    codigo: 'SELECT last_name, commission_pct\nFROM   employees\nORDER BY commission_pct DESC;',
    opciones: [
      { id: 'a', texto: 'Al principio, porque en orden descendente los NULL van primero por defecto.' },
      { id: 'b', texto: 'Al final, porque NULL siempre va al final.' },
      { id: 'c', texto: 'Se excluyen del resultado.' },
      { id: 'd', texto: 'En posición aleatoria.' }
    ],
    correctas: ['a'],
    explicacion: 'Oracle trata NULL como el valor más alto al ordenar: en ASC van al final (NULLS LAST) y en DESC al principio (NULLS FIRST), salvo que se indique lo contrario.',
    porQueNo: {
      b: 'Eso solo ocurre en ASC por defecto o al escribir NULLS LAST.',
      c: 'ORDER BY no filtra filas.',
      d: 'La posición de los NULL es determinista.'
    }
  },
  {
    id: 'P011', examen: 'programming', tema: 'Funciones de fecha',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta sentencia?',
    codigo: "SELECT ADD_MONTHS(DATE '2024-01-31', 1)\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '29-feb-2024' },
      { id: 'b', texto: '02-mar-2024' },
      { id: 'c', texto: '28-feb-2024' },
      { id: 'd', texto: 'Error: el 31 de febrero no existe.' }
    ],
    correctas: ['a'],
    explicacion: 'Si la fecha es el último día del mes, o el mes resultante tiene menos días, ADD_MONTHS devuelve el último día del mes resultante. 2024 es bisiesto: 29 de febrero.',
    porQueNo: {
      b: 'ADD_MONTHS no "desborda" al mes siguiente.',
      c: '2024 es bisiesto, así que febrero tiene 29 días.',
      d: 'ADD_MONTHS ajusta al último día válido en lugar de fallar.'
    }
  },
{
    id: 'P012', examen: 'programming', tema: 'SELECT y WHERE',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas devuelve la consulta?',
    exhibit: [{ titulo: 'EMP_SAMPLE', columnas: ['LAST_NAME', 'DEPT_ID', 'SALARY'], filas: [['Abel', '80', '11000'], ['Davies', '50', '3100'], ['Fay', '20', '6000'], ['Gietz', '110', '8300'], ['Hunold', '60', '9000']] }],
    codigo: 'SELECT last_name\nFROM   emp_sample\nWHERE  salary BETWEEN 6000 AND 9000;',
    opciones: [
      { id: 'a', texto: '3' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: '2' },
      { id: 'd', texto: '4' }
    ],
    correctas: ['a'],
    explicacion: 'BETWEEN incluye ambos límites: Fay (6000), Gietz (8300) y Hunold (9000).',
    porQueNo: {
      b: 'Solo Gietz está estrictamente entre ambos valores, pero BETWEEN también incluye los límites.',
      c: 'BETWEEN incluye los dos extremos, así que cuentan Fay y Hunold además de Gietz.',
      d: 'Abel (11000) y Davies (3100) quedan fuera del rango.'
    }
  },
  {
    id: 'P013', examen: 'programming', tema: 'SELECT y WHERE',
    tipo: 'unica',
    enunciado: '¿Qué encabezado muestra la columna del resultado?',
    codigo: 'SELECT first_name || \' \' || last_name AS "Full Name"\nFROM   employees;',
    opciones: [
      { id: 'a', texto: 'Full Name' },
      { id: 'b', texto: 'FULL NAME' },
      { id: 'c', texto: 'FIRST_NAME||\'\'||LAST_NAME' },
      { id: 'd', texto: '"Full Name"' }
    ],
    correctas: ['a'],
    explicacion: 'Un alias entre comillas dobles se muestra exactamente como se escribió, respetando espacios y mayúsculas/minúsculas. Las comillas no forman parte del encabezado.',
    porQueNo: {
      b: 'Los alias se pasan a mayúsculas solo cuando no llevan comillas dobles.',
      c: 'Ese sería el encabezado si no hubiera alias.',
      d: 'Las comillas dobles delimitan el alias pero no se muestran.'
    }
  },
  {
    id: 'P014', examen: 'programming', tema: 'SELECT y WHERE',
    tipo: 'unica',
    enunciado: "Verdadero o falso: en la tabla EMPLOYEES el apellido está guardado como 'King'. La condición `WHERE last_name = 'king'` devuelve esa fila.",
    opciones: [
      { id: 'a', texto: 'Falso' },
      { id: 'b', texto: 'Verdadero' }
    ],
    correctas: ['a'],
    explicacion: "Las comparaciones de cadenas de caracteres distinguen mayúsculas y minúsculas: 'king' no es igual a 'King'. Se podría usar WHERE LOWER(last_name) = 'king'.",
    porQueNo: {
      b: 'Los literales de texto distinguen mayúsculas y minúsculas; solo las palabras clave y los nombres de objetos sin comillas no las distinguen.'
    }
  },
  {
    id: 'P015', examen: 'programming', tema: 'ORDER BY',
    tipo: 'unica',
    enunciado: '¿Cómo se ordenan las filas?',
    codigo: 'SELECT department_id, last_name\nFROM   employees\nORDER BY department_id, last_name DESC;',
    opciones: [
      { id: 'a', texto: 'Por departamento ascendente y, dentro de cada departamento, por apellido descendente.' },
      { id: 'b', texto: 'Por departamento descendente y por apellido descendente.' },
      { id: 'c', texto: 'Por apellido descendente y luego por departamento.' },
      { id: 'd', texto: 'Por departamento descendente y por apellido ascendente.' }
    ],
    correctas: ['a'],
    explicacion: 'Cada columna de ORDER BY tiene su propio sentido de orden. DESC solo afecta a last_name; department_id usa el valor por defecto, ASC.',
    porQueNo: {
      b: 'DESC no se aplica a todas las columnas, solo a la que lo lleva.',
      c: 'El orden de prioridad lo marca la posición en ORDER BY: primero department_id.',
      d: 'department_id no lleva DESC, así que se ordena de forma ascendente.'
    }
  },
  {
    id: 'P016', examen: 'programming', tema: 'Funciones numéricas',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: 'SELECT ROUND(45.926, 2), TRUNC(45.926, 2), MOD(1600, 300)\nFROM   dual;',
    opciones: [
      { id: 'a', texto: '45.93, 45.92, 100' },
      { id: 'b', texto: '45.93, 45.93, 100' },
      { id: 'c', texto: '45.92, 45.92, 5' },
      { id: 'd', texto: '46, 45, 100' }
    ],
    correctas: ['a'],
    explicacion: 'ROUND redondea a 2 decimales (45.93), TRUNC corta sin redondear (45.92) y MOD devuelve el residuo de 1600 / 300, que es 100.',
    porQueNo: {
      b: 'TRUNC no redondea: simplemente elimina los dígitos sobrantes.',
      c: 'MOD devuelve el residuo (100), no el cociente; y ROUND sí redondea a 45.93.',
      d: 'El segundo argumento (2) conserva dos decimales.'
    }
  },
  {
    id: 'P017', examen: 'programming', tema: 'Funciones numéricas',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: 'SELECT ROUND(45.923, -1), TRUNC(45.923, -1)\nFROM   dual;',
    opciones: [
      { id: 'a', texto: '50, 40' },
      { id: 'b', texto: '45.9, 45.9' },
      { id: 'c', texto: '40, 40' },
      { id: 'd', texto: '50, 50' }
    ],
    correctas: ['a'],
    explicacion: 'Un valor negativo actúa a la izquierda del punto decimal: -1 redondea o trunca a las decenas. 45.923 redondeado a decenas es 50; truncado es 40.',
    porQueNo: {
      b: 'Eso correspondería a un segundo argumento positivo (1).',
      c: 'ROUND redondea 45 hacia arriba, a 50, porque la unidad es 5 o mayor.',
      d: 'TRUNC nunca redondea hacia arriba.'
    }
  },
  {
    id: 'P018', examen: 'programming', tema: 'Funciones de caracteres',
    tipo: 'unica',
    enunciado: 'King gana 24000. ¿Qué devuelve la consulta?',
    codigo: "SELECT LPAD(salary, 10, '*')\nFROM   employees\nWHERE  last_name = 'King';",
    opciones: [
      { id: 'a', texto: '*****24000' },
      { id: 'b', texto: '24000*****' },
      { id: 'c', texto: '**********24000' },
      { id: 'd', texto: '24000' }
    ],
    correctas: ['a'],
    explicacion: 'LPAD rellena por la izquierda hasta alcanzar la longitud total indicada: 10 caracteres en total, de los cuales 5 son el número y 5 son asteriscos.',
    porQueNo: {
      b: 'Ese sería el resultado de RPAD.',
      c: 'El segundo argumento es la longitud total del resultado, no la cantidad de relleno.',
      d: 'LPAD añade relleno hasta llegar a 10 caracteres.'
    }
  },
  {
    id: 'P019', examen: 'programming', tema: 'Funciones de caracteres',
    tipo: 'unica',
    enunciado: '¿Qué función devuelve la posición numérica de una cadena dentro de otra?',
    opciones: [
      { id: 'a', texto: 'INSTR' },
      { id: 'b', texto: 'SUBSTR' },
      { id: 'c', texto: 'LENGTH' },
      { id: 'd', texto: 'LPAD' }
    ],
    correctas: ['a'],
    explicacion: "INSTR(cadena, buscada) devuelve la posición de la primera aparición, o 0 si no la encuentra. Por ejemplo, INSTR('ORACLE', 'C') = 4.",
    porQueNo: {
      b: 'SUBSTR extrae una parte de una cadena.',
      c: 'LENGTH devuelve el número de caracteres.',
      d: 'LPAD rellena una cadena por la izquierda.'
    }
  },
  {
    id: 'P020', examen: 'programming', tema: 'Funciones de caracteres',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT CONCAT('Hello', 'World'), LENGTH(CONCAT('Hello', 'World'))\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'HelloWorld, 10' },
      { id: 'b', texto: 'Hello World, 11' },
      { id: 'c', texto: 'HelloWorld, 11' },
      { id: 'd', texto: 'Hello World, 10' }
    ],
    correctas: ['a'],
    explicacion: 'CONCAT une las dos cadenas sin añadir espacios. HelloWorld tiene 10 caracteres.',
    porQueNo: {
      b: 'CONCAT no inserta ningún espacio.',
      c: 'HelloWorld tiene 10 caracteres.',
      d: 'CONCAT no inserta espacios entre los argumentos.'
    }
  },
  {
    id: 'P021', examen: 'programming', tema: 'Funciones de fecha',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT MONTHS_BETWEEN(DATE '2024-03-31', DATE '2024-01-31')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '2' },
      { id: 'b', texto: '-2' },
      { id: 'c', texto: '60' },
      { id: 'd', texto: '1.94' }
    ],
    correctas: ['a'],
    explicacion: 'MONTHS_BETWEEN(fecha1, fecha2) devuelve los meses entre ambas fechas. Si las dos son el último día de su mes, el resultado es un número entero: 2. Es positivo porque la primera fecha es posterior.',
    porQueNo: {
      b: 'El resultado es negativo solo si la primera fecha es anterior a la segunda.',
      c: 'Ese sería el número de días (restando las fechas), no de meses.',
      d: 'Cuando ambas fechas son fin de mes, MONTHS_BETWEEN devuelve un número entero.'
    }
  },
  {
    id: 'P022', examen: 'programming', tema: 'Funciones de fecha',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: la expresión `SYSDATE - hire_date` devuelve el número de meses que lleva trabajando el empleado.',
    opciones: [
      { id: 'a', texto: 'Falso' },
      { id: 'b', texto: 'Verdadero' }
    ],
    correctas: ['a'],
    explicacion: 'Restar dos fechas devuelve el número de días (con decimales por la parte horaria). Para obtener meses se usa MONTHS_BETWEEN(SYSDATE, hire_date).',
    porQueNo: {
      b: 'La resta de fechas siempre se expresa en días, no en meses.'
    }
  },
  {
    id: 'P023', examen: 'programming', tema: 'Conversión de tipos',
    tipo: 'unica',
    enunciado: "Con idioma AMERICAN, ¿qué modelo de formato hace que TO_CHAR(DATE '2003-06-17', modelo) devuelva exactamente 'June 17, 2003'?",
    opciones: [
      { id: 'a', texto: "'fmMonth DD, YYYY'" },
      { id: 'b', texto: "'Month DD, YYYY'" },
      { id: 'c', texto: "'MON DD, YYYY'" },
      { id: 'd', texto: "'Mon dd, yyyy'" }
    ],
    correctas: ['a'],
    explicacion: "Month muestra el nombre completo del mes con la primera letra en mayúscula. Sin fm se rellena con espacios hasta 9 caracteres ('June     17, 2003'); fm elimina ese relleno.",
    porQueNo: {
      b: "Sin fm, el nombre del mes se rellena con espacios: 'June     17, 2003'.",
      c: "MON muestra la abreviatura en mayúsculas: 'JUN 17, 2003'.",
      d: "Mon muestra la abreviatura: 'Jun 17, 2003'."
    }
  },
  {
    id: 'P024', examen: 'programming', tema: 'Conversión de tipos',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT TO_NUMBER('1,234.50', '9,999.99') + 1\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '1235.5' },
      { id: 'b', texto: '1,235.50' },
      { id: 'c', texto: 'Error ORA-01722: invalid number' },
      { id: 'd', texto: '2.5' }
    ],
    correctas: ['a'],
    explicacion: 'Con el modelo de formato adecuado, TO_NUMBER interpreta la coma de miles y convierte el texto en el número 1234.5. Al sumar 1 se obtiene 1235.5 (un NUMBER, mostrado sin formato).',
    porQueNo: {
      b: 'El resultado es un número, no texto con formato.',
      c: 'El modelo de formato coincide con el texto, así que la conversión funciona.',
      d: 'La coma es separador de miles según el modelo, no separador decimal.'
    }
  },
  {
    id: 'P025', examen: 'programming', tema: 'NVL, NVL2, NULLIF y COALESCE',
    tipo: 'unica',
    enunciado: 'Un empleado gana 8000 y tiene COMMISSION_PCT NULL. ¿Qué valor devuelve la expresión para ese empleado?',
    codigo: 'NVL2(commission_pct, salary * commission_pct, 0)',
    opciones: [
      { id: 'a', texto: '0' },
      { id: 'b', texto: 'NULL' },
      { id: 'c', texto: '8000' },
      { id: 'd', texto: 'Error: NVL2 requiere que el primer argumento no sea NULL.' }
    ],
    correctas: ['a'],
    explicacion: 'NVL2(expr, valor_si_no_nulo, valor_si_nulo): como commission_pct es NULL, se devuelve el tercer argumento, 0.',
    porQueNo: {
      b: 'NVL2 sustituye el resultado según si expr es NULL; aquí devuelve 0.',
      c: 'El salario no aparece como valor de retorno de NVL2 en esta expresión.',
      d: 'Precisamente NVL2 está pensada para manejar un primer argumento NULL.'
    }
  },
  {
    id: 'P026', examen: 'programming', tema: 'NVL, NVL2, NULLIF y COALESCE',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT NULLIF('A', 'a'), COALESCE(NULL, 'X', 'Y')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'A, X' },
      { id: 'b', texto: 'NULL, X' },
      { id: 'c', texto: 'A, Y' },
      { id: 'd', texto: 'NULL, NULL' }
    ],
    correctas: ['a'],
    explicacion: "NULLIF devuelve NULL solo si los dos argumentos son iguales; 'A' y 'a' son distintos, así que devuelve 'A'. COALESCE devuelve el primer valor no nulo: 'X'.",
    porQueNo: {
      b: 'La comparación de texto distingue mayúsculas y minúsculas: no son iguales.',
      c: 'COALESCE se detiene en el primer valor no nulo.',
      d: 'Ninguna de las dos funciones devuelve NULL en este caso.'
    }
  },
  {
    id: 'P027', examen: 'programming', tema: 'CASE y DECODE',
    tipo: 'unica',
    enunciado: 'Un empleado tiene JOB_ID = \'SA_REP\' y SALARY = 7000. ¿Qué devuelve la expresión?',
    codigo: "DECODE(job_id, 'IT_PROG',  1.10 * salary,\n               'ST_CLERK', 1.15 * salary,\n               salary)",
    opciones: [
      { id: 'a', texto: '7000' },
      { id: 'b', texto: '7700' },
      { id: 'c', texto: '8050' },
      { id: 'd', texto: 'NULL' }
    ],
    correctas: ['a'],
    explicacion: 'SA_REP no coincide con IT_PROG ni con ST_CLERK, así que DECODE devuelve el valor por defecto (último argumento): salary, 7000.',
    porQueNo: {
      b: 'Corresponde a IT_PROG (aumento del 10%).',
      c: 'Corresponde a ST_CLERK (aumento del 15%).',
      d: 'DECODE devuelve NULL solo cuando no hay coincidencia ni valor por defecto; aquí sí hay valor por defecto.'
    }
  },
  {
    id: 'P028', examen: 'programming', tema: 'CASE y DECODE',
    tipo: 'unica',
    enunciado: 'Un empleado gana 12000. ¿Qué devuelve la expresión?',
    codigo: "CASE WHEN salary > 5000  THEN 'Medio'\n     WHEN salary > 10000 THEN 'Alto'\n     ELSE 'Bajo'\nEND",
    opciones: [
      { id: 'a', texto: 'Medio' },
      { id: 'b', texto: 'Alto' },
      { id: 'c', texto: 'Bajo' },
      { id: 'd', texto: 'Medio y Alto' }
    ],
    correctas: ['a'],
    explicacion: 'CASE evalúa las condiciones en orden y devuelve el resultado de la primera que se cumple. 12000 > 5000 ya es verdadero, así que no se evalúa la siguiente.',
    porQueNo: {
      b: 'Para obtener Alto, la condición > 10000 debería escribirse antes que > 5000.',
      c: 'ELSE solo se usa si ninguna condición se cumple.',
      d: 'CASE devuelve un único valor.'
    }
  },
  {
    id: 'P029', examen: 'programming', tema: 'JOINs',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: un NATURAL JOIN une dos tablas usando todas las columnas que tienen el mismo nombre en ambas.',
    opciones: [
      { id: 'a', texto: 'Verdadero' },
      { id: 'b', texto: 'Falso' }
    ],
    correctas: ['a'],
    explicacion: 'NATURAL JOIN identifica automáticamente las columnas con el mismo nombre y crea un equijoin con todas ellas. Si no hay columnas comunes, el resultado es un producto cartesiano.',
    porQueNo: {
      b: 'Es exactamente el comportamiento de NATURAL JOIN: usa todas las columnas de igual nombre, sin cláusula ON.'
    }
  },
  {
    id: 'P030', examen: 'programming', tema: 'JOINs',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas devuelve la consulta?',
    exhibit: [
      { titulo: 'EMP', columnas: ['EMP_ID', 'NAME', 'DEPT_ID'], filas: [['1', 'Ana', '10'], ['2', 'Beto', '20'], ['3', 'Carla', null], ['4', 'Dario', '10']] },
      { titulo: 'DEPT', columnas: ['DEPT_ID', 'DNAME'], filas: [['10', 'Ventas'], ['20', 'TI'], ['30', 'RRHH']] }
    ],
    codigo: 'SELECT e.name, d.dname\nFROM   emp e RIGHT OUTER JOIN dept d\nON     e.dept_id = d.dept_id;',
    opciones: [
      { id: 'a', texto: '4' },
      { id: 'b', texto: '3' },
      { id: 'c', texto: '5' },
      { id: 'd', texto: '6' }
    ],
    correctas: ['a'],
    explicacion: 'RIGHT OUTER JOIN conserva todas las filas de DEPT. Ventas aparece dos veces (Ana y Dario), TI una vez (Beto) y RRHH una vez con NAME NULL. Carla no aparece, porque no tiene departamento.',
    porQueNo: {
      b: 'Ese sería el resultado del inner join; falta RRHH.',
      c: 'Carla no se incluye: es la tabla de la izquierda la que no se conserva completa.',
      d: 'Sería un FULL OUTER JOIN con más filas sin coincidencia; aquí solo se conservan todas las de DEPT.'
    }
  },
  {
    id: 'P031', examen: 'programming', tema: 'JOINs',
    tipo: 'unica',
    enunciado: 'La tabla COLORS tiene 3 filas y la tabla SIZES tiene 4 filas. ¿Cuántas filas devuelve `SELECT * FROM colors CROSS JOIN sizes;`?',
    opciones: [
      { id: 'a', texto: '12' },
      { id: 'b', texto: '7' },
      { id: 'c', texto: '4' },
      { id: 'd', texto: '3' }
    ],
    correctas: ['a'],
    explicacion: 'CROSS JOIN combina cada fila de la primera tabla con cada fila de la segunda (producto cartesiano): 3 × 4 = 12.',
    porQueNo: {
      b: 'El producto cartesiano multiplica, no suma.',
      c: 'Cada color se combina con las 4 tallas.',
      d: 'Cada talla se combina con los 3 colores.'
    }
  },
  {
    id: 'P032', examen: 'programming', tema: 'JOINs',
    tipo: 'unica',
    enunciado: 'En EMPLOYEES, la columna MANAGER_ID contiene el EMPLOYEE_ID del jefe de cada empleado. Para mostrar el apellido de cada empleado junto al de su jefe, ¿qué tipo de join se necesita?',
    opciones: [
      { id: 'a', texto: 'Un self join (la tabla unida consigo misma con dos alias).' },
      { id: 'b', texto: 'Un CROSS JOIN.' },
      { id: 'c', texto: 'Un NATURAL JOIN.' },
      { id: 'd', texto: 'Un non-equijoin con BETWEEN.' }
    ],
    correctas: ['a'],
    explicacion: 'El empleado y el jefe están en la misma tabla, así que se une EMPLOYEES consigo misma: FROM employees w JOIN employees m ON w.manager_id = m.employee_id.',
    porQueNo: {
      b: 'CROSS JOIN combinaría a cada empleado con todos los demás.',
      c: 'NATURAL JOIN de la tabla consigo misma uniría por todas las columnas, devolviendo cada fila consigo misma.',
      d: 'La relación es de igualdad entre MANAGER_ID y EMPLOYEE_ID, no un rango.'
    }
  },
  {
    id: 'P033', examen: 'programming', tema: 'Funciones de grupo, GROUP BY y HAVING',
    tipo: 'unica',
    enunciado: '¿Qué devuelve `SELECT MIN(hire_date) FROM employees;`?',
    opciones: [
      { id: 'a', texto: 'La fecha de contratación más antigua.' },
      { id: 'b', texto: 'La fecha de contratación más reciente.' },
      { id: 'c', texto: 'Error: MIN solo funciona con números.' },
      { id: 'd', texto: 'La fecha de contratación del primer empleado insertado en la tabla.' }
    ],
    correctas: ['a'],
    explicacion: 'MIN y MAX funcionan con fechas: la fecha "mínima" es la más antigua y la "máxima", la más reciente.',
    porQueNo: {
      b: 'Esa la devuelve MAX(hire_date).',
      c: 'MIN y MAX admiten números, caracteres y fechas.',
      d: 'MIN compara valores; el orden de inserción no importa.'
    }
  },
  {
    id: 'P034', examen: 'programming', tema: 'Funciones de grupo, GROUP BY y HAVING',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Qué departamentos devuelve la consulta?',
    exhibit: [{ titulo: 'EMP_SAL', columnas: ['DEPT_ID', 'SALARY'], filas: [['10', '4400'], ['20', '13000'], ['20', '6000'], ['60', '9000'], ['60', '6000'], ['60', '4200'], ['90', '24000'], ['90', '17000']] }],
    codigo: 'SELECT dept_id, AVG(salary)\nFROM   emp_sal\nGROUP BY dept_id\nHAVING AVG(salary) > 8000;',
    opciones: [
      { id: 'a', texto: '20 y 90' },
      { id: 'b', texto: 'Solo 90' },
      { id: 'c', texto: '20, 60 y 90' },
      { id: 'd', texto: '60 y 90' }
    ],
    correctas: ['a'],
    explicacion: 'Promedios: 10 → 4400; 20 → 9500; 60 → 6400; 90 → 20500. HAVING conserva los grupos con promedio mayor que 8000: 20 y 90.',
    porQueNo: {
      b: 'El departamento 20 tiene un promedio de 9500, que también supera 8000.',
      c: 'El promedio del departamento 60 es 6400.',
      d: 'El 60 no llega a 8000 y el 20 sí lo supera.'
    }
  },
  {
    id: 'P035', examen: 'programming', tema: 'Funciones de grupo, GROUP BY y HAVING',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT department_id, last_name, COUNT(*)\nFROM   employees\nGROUP BY department_id;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00979: not a GROUP BY expression, porque LAST_NAME no está en el GROUP BY.' },
      { id: 'b', texto: 'Muestra un apellido cualquiera por departamento.' },
      { id: 'c', texto: 'Muestra una fila por empleado con el total de su departamento.' },
      { id: 'd', texto: 'Error, porque COUNT(*) debe ir antes que las columnas.' }
    ],
    correctas: ['a'],
    explicacion: 'Toda columna del SELECT que no esté dentro de una función de grupo debe aparecer en el GROUP BY.',
    porQueNo: {
      b: 'Oracle no elige valores arbitrarios; exige que la columna esté agrupada.',
      c: 'Para eso se necesitarían funciones analíticas, no GROUP BY.',
      d: 'El orden de las columnas en el SELECT es libre.'
    }
  },
  {
    id: 'P036', examen: 'programming', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'En una subconsulta no correlacionada, como la siguiente, ¿qué se ejecuta primero?',
    codigo: "SELECT last_name\nFROM   employees\nWHERE  salary > (SELECT salary\n                 FROM   employees\n                 WHERE  last_name = 'Abel');",
    opciones: [
      { id: 'a', texto: 'La subconsulta interna; su resultado se usa en la consulta externa.' },
      { id: 'b', texto: 'La consulta externa; luego la subconsulta para cada fila.' },
      { id: 'c', texto: 'Ambas a la vez, de forma independiente.' },
      { id: 'd', texto: 'Depende del orden de las columnas del SELECT.' }
    ],
    correctas: ['a'],
    explicacion: 'Una subconsulta no correlacionada se evalúa una vez, antes que la consulta principal, y su resultado (aquí, el salario de Abel) se usa en la condición externa.',
    porQueNo: {
      b: 'Ese es el comportamiento de las subconsultas correlacionadas.',
      c: 'La consulta externa necesita el resultado de la subconsulta.',
      d: 'El orden de las columnas no influye en la evaluación.'
    }
  },
{
    id: 'P037', examen: 'programming', tema: 'Subconsultas',
    tipo: 'multiple',
    enunciado: '¿Qué tres operadores pueden usarse con una subconsulta que devuelve varias filas? (Elige tres)',
    opciones: [
      { id: 'a', texto: 'IN' },
      { id: 'b', texto: 'ANY' },
      { id: 'c', texto: 'ALL' },
      { id: 'd', texto: '=' },
      { id: 'e', texto: '>' },
      { id: 'f', texto: 'LIKE' }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: 'Los operadores multifila (IN, ANY/SOME y ALL, combinados con =, <, > ...) comparan un valor con una lista de valores.',
    porQueNo: {
      d: '= es un operador de una fila: con varias filas produce ORA-01427.',
      e: '> solo, sin ANY ni ALL, también exige una sola fila.',
      f: 'LIKE compara con un único patrón; no admite una subconsulta multifila.'
    }
  },
  {
    id: 'P038', examen: 'programming', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: 'SELECT department_name\nFROM   departments d\nWHERE  EXISTS (SELECT 1\n               FROM   employees e\n               WHERE  e.department_id = d.department_id);',
    opciones: [
      { id: 'a', texto: 'Los departamentos que tienen al menos un empleado.' },
      { id: 'b', texto: 'Los departamentos que no tienen empleados.' },
      { id: 'c', texto: 'Todos los departamentos, porque la subconsulta siempre devuelve 1.' },
      { id: 'd', texto: 'Un error, porque la subconsulta no selecciona ninguna columna de EMPLOYEES.' }
    ],
    correctas: ['a'],
    explicacion: 'EXISTS es verdadero si la subconsulta correlacionada devuelve al menos una fila para el departamento evaluado. Lo que se selecciona (1) no importa.',
    porQueNo: {
      b: 'Eso devolvería NOT EXISTS.',
      c: 'La subconsulta solo devuelve filas para los departamentos con empleados.',
      d: 'En EXISTS es habitual seleccionar una constante; es válido.'
    }
  },
  {
    id: 'P039', examen: 'programming', tema: 'DML',
    tipo: 'unica',
    enunciado: 'DEPARTMENTS tiene las columnas DEPARTMENT_ID, DEPARTMENT_NAME, MANAGER_ID y LOCATION_ID, ninguna con DEFAULT. ¿Qué valor tiene LOCATION_ID en la fila insertada?',
    codigo: "INSERT INTO departments (department_id, department_name)\nVALUES (280, 'Training');",
    opciones: [
      { id: 'a', texto: 'NULL' },
      { id: 'b', texto: '0' },
      { id: 'c', texto: 'El mismo valor que la última fila insertada.' },
      { id: 'd', texto: 'La sentencia falla porque faltan columnas.' }
    ],
    correctas: ['a'],
    explicacion: 'Las columnas omitidas en la lista de un INSERT reciben su valor DEFAULT; si no tienen, reciben NULL (siempre que no sean NOT NULL).',
    porQueNo: {
      b: 'Oracle no asigna 0 automáticamente a las columnas numéricas.',
      c: 'Oracle no copia valores de otras filas.',
      d: 'Se pueden omitir columnas que admiten NULL.'
    }
  },
  {
    id: 'P040', examen: 'programming', tema: 'DML',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: `DELETE FROM copy_emp;` elimina todas las filas de COPY_EMP, pero la tabla sigue existiendo.',
    opciones: [
      { id: 'a', texto: 'Verdadero' },
      { id: 'b', texto: 'Falso' }
    ],
    correctas: ['a'],
    explicacion: 'Sin cláusula WHERE, DELETE elimina todas las filas. La estructura de la tabla se conserva, y el borrado puede deshacerse con ROLLBACK si no se ha confirmado.',
    porQueNo: {
      b: 'DELETE nunca elimina la tabla; para eso se usa DROP TABLE.'
    }
  },
  {
    id: 'P041', examen: 'programming', tema: 'DML',
    tipo: 'unica',
    enunciado: '¿Qué sentencia permite, en una sola operación, actualizar las filas que ya existen en una tabla destino e insertar las que no existen, a partir de una tabla origen?',
    opciones: [
      { id: 'a', texto: 'MERGE' },
      { id: 'b', texto: 'INSERT ALL' },
      { id: 'c', texto: 'UPDATE ... RETURNING' },
      { id: 'd', texto: 'UPSERT' }
    ],
    correctas: ['a'],
    explicacion: 'MERGE INTO destino USING origen ON (condición) WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ... combina ambas operaciones.',
    porQueNo: {
      b: 'INSERT ALL inserta en una o varias tablas, pero no actualiza.',
      c: 'UPDATE no inserta filas nuevas.',
      d: 'UPSERT no es una sentencia de Oracle.'
    }
  },
  {
    id: 'P042', examen: 'programming', tema: 'DML',
    tipo: 'unica',
    enunciado: 'El empleado 206 tiene SALARY = 8300 y el 205 tiene SALARY = 12008. ¿Qué salario tiene el empleado 206 después del UPDATE?',
    codigo: 'UPDATE employees\nSET    salary = (SELECT salary\n                 FROM   employees\n                 WHERE  employee_id = 205)\nWHERE  employee_id = 206;',
    opciones: [
      { id: 'a', texto: '12008' },
      { id: 'b', texto: '8300' },
      { id: 'c', texto: '20308' },
      { id: 'd', texto: 'NULL' }
    ],
    correctas: ['a'],
    explicacion: 'La subconsulta devuelve el salario del empleado 205 (12008), que se asigna al empleado 206.',
    porQueNo: {
      b: 'El UPDATE sí modifica la fila del empleado 206.',
      c: 'Se asigna el valor, no se suma.',
      d: 'La subconsulta devuelve una fila, así que el valor no es NULL.'
    }
  },
  {
    id: 'P043', examen: 'programming', tema: 'DDL',
    tipo: 'multiple',
    enunciado: '¿Qué dos nombres de tabla son válidos en Oracle? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'emp_2024' },
      { id: 'b', texto: '"Order Details"' },
      { id: 'c', texto: '2024_emp' },
      { id: 'd', texto: 'order' },
      { id: 'e', texto: 'emp-data' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Un nombre sin comillas debe empezar con una letra, tener hasta 128 bytes (en 12.2+), usar solo letras, números, _, $ y #, y no ser una palabra reservada. Entre comillas dobles se admiten espacios y palabras reservadas.',
    porQueNo: {
      c: 'Un nombre sin comillas no puede empezar con un número.',
      d: 'ORDER es una palabra reservada.',
      e: 'El guion no está permitido en un nombre sin comillas.'
    }
  },
  {
    id: 'P044', examen: 'programming', tema: 'DDL',
    tipo: 'unica',
    enunciado: 'Se crea la tabla y se inserta una fila. ¿Qué valor tiene CREATED?',
    codigo: "CREATE TABLE notes (\n  id      NUMBER,\n  created DATE DEFAULT SYSDATE\n);\nINSERT INTO notes (id) VALUES (1);",
    opciones: [
      { id: 'a', texto: 'La fecha y hora del momento del INSERT.' },
      { id: 'b', texto: 'NULL' },
      { id: 'c', texto: 'La fecha y hora en que se creó la tabla.' },
      { id: 'd', texto: "El texto 'SYSDATE'." }
    ],
    correctas: ['a'],
    explicacion: 'Cuando se omite una columna con DEFAULT, Oracle evalúa la expresión por defecto al insertar la fila. SYSDATE da la fecha y hora del momento del INSERT.',
    porQueNo: {
      b: 'La columna tiene DEFAULT, así que no queda NULL.',
      c: 'El DEFAULT se evalúa en cada INSERT, no al crear la tabla.',
      d: 'SYSDATE es una función, no un literal.'
    }
  },
  {
    id: 'P045', examen: 'programming', tema: 'DDL',
    tipo: 'unica',
    enunciado: 'La tabla COPY_EMP tiene 20 filas. Se ejecuta `ALTER TABLE copy_emp ADD (bonus NUMBER(6));`. ¿Qué afirmación es verdadera?',
    opciones: [
      { id: 'a', texto: 'La columna BONUS se añade al final y vale NULL en las 20 filas existentes.' },
      { id: 'b', texto: 'La columna se añade al principio de la tabla.' },
      { id: 'c', texto: 'BONUS vale 0 en las filas existentes.' },
      { id: 'd', texto: 'Falla porque la tabla tiene datos.' }
    ],
    correctas: ['a'],
    explicacion: 'ALTER TABLE ... ADD añade la columna como última columna. Si no se indica DEFAULT, las filas existentes quedan con NULL.',
    porQueNo: {
      b: 'Oracle no permite elegir la posición: siempre se añade al final.',
      c: 'Sin DEFAULT, el valor es NULL.',
      d: 'Se pueden añadir columnas que admiten NULL a tablas con datos.'
    }
  },
  {
    id: 'P046', examen: 'programming', tema: 'DDL',
    tipo: 'unica',
    enunciado: '¿Qué sentencia elimina tanto los datos como la estructura de una tabla?',
    opciones: [
      { id: 'a', texto: 'DROP TABLE' },
      { id: 'b', texto: 'TRUNCATE TABLE' },
      { id: 'c', texto: 'DELETE FROM' },
      { id: 'd', texto: 'ALTER TABLE ... SET UNUSED' }
    ],
    correctas: ['a'],
    explicacion: 'DROP TABLE elimina la tabla completa: definición, datos, índices y restricciones (con la papelera habilitada se puede recuperar con FLASHBACK).',
    porQueNo: {
      b: 'TRUNCATE borra todas las filas, pero conserva la estructura.',
      c: 'DELETE borra filas y conserva la tabla.',
      d: 'SET UNUSED marca columnas como no usadas; no elimina la tabla.'
    }
  },
  {
    id: 'P047', examen: 'programming', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'EMPLOYEES.DEPARTMENT_ID tiene una FOREIGN KEY hacia DEPARTMENTS y no existe el departamento 999. ¿Qué ocurre al ejecutar el INSERT?',
    codigo: "INSERT INTO employees (employee_id, last_name, email, hire_date, department_id)\nVALUES (300, 'Ruiz', 'RRUIZ', SYSDATE, 999);",
    opciones: [
      { id: 'a', texto: 'Error ORA-02291: integrity constraint violated - parent key not found.' },
      { id: 'b', texto: 'Se inserta y se crea automáticamente el departamento 999.' },
      { id: 'c', texto: 'Se inserta con DEPARTMENT_ID NULL.' },
      { id: 'd', texto: 'Error ORA-02292: child record found.' }
    ],
    correctas: ['a'],
    explicacion: 'Una FK exige que el valor (no nulo) exista en la columna referenciada de la tabla padre.',
    porQueNo: {
      b: 'Oracle nunca crea filas padre automáticamente.',
      c: 'Oracle no cambia el valor; rechaza la fila.',
      d: 'ORA-02292 aparece al borrar o modificar una fila padre que tiene hijos.'
    }
  },
  {
    id: 'P048', examen: 'programming', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'Se necesita una clave primaria compuesta por las columnas STUDENT_ID y COURSE_ID. ¿Cómo debe definirse?',
    opciones: [
      { id: 'a', texto: 'Como restricción a nivel de tabla: CONSTRAINT enr_pk PRIMARY KEY (student_id, course_id)' },
      { id: 'b', texto: 'Escribiendo PRIMARY KEY junto a cada una de las dos columnas.' },
      { id: 'c', texto: 'Con dos restricciones UNIQUE, una por columna.' },
      { id: 'd', texto: 'Con una restricción NOT NULL a nivel de tabla.' }
    ],
    correctas: ['a'],
    explicacion: 'Las restricciones que abarcan varias columnas (PK o UNIQUE compuestas, FK compuestas) deben definirse a nivel de tabla.',
    porQueNo: {
      b: 'Serían dos claves primarias, lo cual no está permitido (ORA-02260).',
      c: 'Dos UNIQUE separadas exigen que cada columna sea única por sí sola, no la combinación.',
      d: 'NOT NULL solo se define a nivel de columna y no garantiza unicidad.'
    }
  },
  {
    id: 'P049', examen: 'programming', tema: 'Vistas',
    tipo: 'multiple',
    enunciado: '¿Qué dos características pueden tener las vistas complejas, a diferencia de las simples? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Pueden contener funciones de grupo y GROUP BY.' },
      { id: 'b', texto: 'Pueden obtener datos de varias tablas.' },
      { id: 'c', texto: 'Siempre permiten INSERT, UPDATE y DELETE.' },
      { id: 'd', texto: 'No pueden tener cláusula WHERE.' },
      { id: 'e', texto: 'Almacenan una copia de los datos.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Una vista simple se basa en una sola tabla, sin funciones ni grupos, y normalmente admite DML. Una vista compleja puede usar varias tablas, funciones y grupos, y a menudo no admite DML.',
    porQueNo: {
      c: 'Las funciones de grupo, DISTINCT o ciertos joins impiden el DML a través de la vista.',
      d: 'Cualquier vista puede tener WHERE.',
      e: 'Ninguna vista (normal) almacena datos; solo su consulta.'
    }
  },
  {
    id: 'P050', examen: 'programming', tema: 'Vistas',
    tipo: 'unica',
    enunciado: '¿Qué efecto tiene la cláusula WITH READ ONLY en CREATE VIEW?',
    opciones: [
      { id: 'a', texto: 'Impide ejecutar INSERT, UPDATE y DELETE a través de la vista.' },
      { id: 'b', texto: 'Impide que la tabla base se modifique por cualquier medio.' },
      { id: 'c', texto: 'Permite consultar la vista solo al usuario que la creó.' },
      { id: 'd', texto: 'Hace que la vista guarde una copia de solo lectura de los datos.' }
    ],
    correctas: ['a'],
    explicacion: 'WITH READ ONLY convierte la vista en solo lectura: cualquier DML a través de ella produce un error. La tabla base puede seguir modificándose directamente.',
    porQueNo: {
      b: 'La restricción solo afecta a la vista, no a la tabla base.',
      c: 'El acceso se controla con privilegios, no con WITH READ ONLY.',
      d: 'Una vista no guarda datos.'
    }
  },
  {
    id: 'P051', examen: 'programming', tema: 'Vistas',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: 'SELECT ROWNUM AS rank, last_name, salary\nFROM   (SELECT last_name, salary\n        FROM   employees\n        WHERE  salary IS NOT NULL\n        ORDER BY salary DESC)\nWHERE  ROWNUM <= 3;',
    opciones: [
      { id: 'a', texto: 'Los tres empleados con los salarios más altos (análisis Top-N).' },
      { id: 'b', texto: 'Tres empleados cualesquiera, ordenados por salario.' },
      { id: 'c', texto: 'Los tres empleados con los salarios más bajos.' },
      { id: 'd', texto: 'Ninguna fila, porque ROWNUM no puede usarse con vistas en línea.' }
    ],
    correctas: ['a'],
    explicacion: 'La vista en línea ordena primero por salario descendente; después ROWNUM numera las filas ya ordenadas y el filtro se queda con las tres primeras.',
    porQueNo: {
      b: 'Eso pasaría si ROWNUM se aplicara en la misma consulta que el ORDER BY, no sobre una vista en línea ya ordenada.',
      c: 'El orden es descendente: primero los salarios más altos.',
      d: 'ROWNUM sobre una vista en línea ordenada es la técnica clásica de Top-N.'
    }
  },
  {
    id: 'P052', examen: 'programming', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: 'Se ejecutan las sentencias en una sesión nueva. ¿Qué tres valores se obtienen?',
    codigo: 'CREATE SEQUENCE emp_seq START WITH 10 INCREMENT BY 5;\nSELECT emp_seq.NEXTVAL FROM dual;\nSELECT emp_seq.NEXTVAL FROM dual;\nSELECT emp_seq.CURRVAL FROM dual;',
    opciones: [
      { id: 'a', texto: '10, 15, 15' },
      { id: 'b', texto: '15, 20, 20' },
      { id: 'c', texto: '10, 15, 20' },
      { id: 'd', texto: '10, 11, 11' }
    ],
    correctas: ['a'],
    explicacion: 'El primer NEXTVAL devuelve el valor inicial (10); el segundo suma el incremento (15). CURRVAL devuelve el último valor generado en la sesión, sin avanzar (15).',
    porQueNo: {
      b: 'El primer NEXTVAL devuelve START WITH, no START WITH + INCREMENT.',
      c: 'CURRVAL no incrementa la secuencia.',
      d: 'El incremento es 5.'
    }
  },
  {
    id: 'P053', examen: 'programming', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: '¿Cuál es el propósito principal de un sinónimo?',
    opciones: [
      { id: 'a', texto: 'Dar un nombre alternativo a un objeto para simplificar su referencia (por ejemplo, evitar escribir el esquema).' },
      { id: 'b', texto: 'Crear una copia de una tabla.' },
      { id: 'c', texto: 'Acelerar las consultas sobre una tabla.' },
      { id: 'd', texto: 'Otorgar privilegios sobre una tabla a otros usuarios.' }
    ],
    correctas: ['a'],
    explicacion: 'Un sinónimo es un alias de un objeto (tabla, vista, secuencia...). Permite, por ejemplo, escribir EMP en lugar de HR.EMPLOYEES.',
    porQueNo: {
      b: 'Un sinónimo no copia datos; para eso se usaría CREATE TABLE ... AS SELECT.',
      c: 'Los que pueden acelerar consultas son los índices.',
      d: 'Los privilegios se otorgan con GRANT; un sinónimo no da acceso por sí mismo.'
    }
  },
  {
    id: 'P054', examen: 'programming', tema: 'Secuencias, sinónimos e índices',
    tipo: 'multiple',
    enunciado: 'Según las recomendaciones habituales, ¿en qué dos situaciones conviene crear un índice? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'La columna se usa con frecuencia en la cláusula WHERE o en condiciones de join.' },
      { id: 'b', texto: 'La columna tiene un amplio rango de valores distintos.' },
      { id: 'c', texto: 'La tabla es muy pequeña.' },
      { id: 'd', texto: 'La columna se actualiza con mucha frecuencia.' },
      { id: 'e', texto: 'Las consultas suelen devolver la mayoría de las filas de la tabla.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Un índice es útil cuando ayuda a localizar pocas filas entre muchas: columnas muy usadas en WHERE o joins y con muchos valores distintos.',
    porQueNo: {
      c: 'En tablas pequeñas un recorrido completo suele ser igual de rápido.',
      d: 'Cada actualización obliga a mantener el índice, lo que penaliza el DML.',
      e: 'Si se devuelve la mayoría de las filas, el índice aporta poco.'
    }
  },
  {
    id: 'P055', examen: 'programming', tema: 'Privilegios',
    tipo: 'unica',
    enunciado: '¿Cuál de los siguientes es un privilegio de objeto?',
    opciones: [
      { id: 'a', texto: 'SELECT ON employees' },
      { id: 'b', texto: 'CREATE TABLE' },
      { id: 'c', texto: 'CREATE SESSION' },
      { id: 'd', texto: 'CREATE VIEW' }
    ],
    correctas: ['a'],
    explicacion: 'Los privilegios de objeto (SELECT, INSERT, UPDATE, DELETE, ALTER, EXECUTE...) se otorgan sobre un objeto concreto. Los privilegios de sistema permiten acciones generales, como crear tablas o conectarse.',
    porQueNo: {
      b: 'CREATE TABLE es un privilegio de sistema.',
      c: 'CREATE SESSION es un privilegio de sistema (permite conectarse).',
      d: 'CREATE VIEW es un privilegio de sistema.'
    }
  },
  {
    id: 'P056', examen: 'programming', tema: 'Privilegios',
    tipo: 'unica',
    enunciado: '¿Cuál es la principal ventaja de usar roles?',
    opciones: [
      { id: 'a', texto: 'Simplificar la administración: se agrupan privilegios y se otorgan a muchos usuarios de una vez.' },
      { id: 'b', texto: 'Aumentar la velocidad de las consultas.' },
      { id: 'c', texto: 'Crear copias de seguridad de los privilegios.' },
      { id: 'd', texto: 'Permitir que un usuario sea dueño de objetos de otro esquema.' }
    ],
    correctas: ['a'],
    explicacion: 'Un rol es un grupo con nombre de privilegios. Se otorgan los privilegios al rol y el rol a los usuarios; los cambios en el rol afectan a todos sus usuarios.',
    porQueNo: {
      b: 'Los roles no afectan al rendimiento de las consultas.',
      c: 'Los roles no son copias de seguridad.',
      d: 'Los roles no cambian la propiedad de los objetos.'
    }
  },
  {
    id: 'P057', examen: 'programming', tema: 'Expresiones regulares',
    tipo: 'unica',
    enunciado: '¿Qué nombres cumplen la condición?',
    codigo: "WHERE REGEXP_LIKE(first_name, '^Ste(v|ph)en$')",
    opciones: [
      { id: 'a', texto: 'Steven y Stephen' },
      { id: 'b', texto: 'Solo Steven' },
      { id: 'c', texto: 'Steven, Stephen y Stevenson' },
      { id: 'd', texto: 'Steven, Stephen y steven' }
    ],
    correctas: ['a'],
    explicacion: '^ y $ anclan el patrón al inicio y al final de la cadena. (v|ph) permite "v" o "ph". La comparación distingue mayúsculas y minúsculas por defecto.',
    porQueNo: {
      b: 'La alternativa (v|ph) también acepta "ph".',
      c: '$ exige que la cadena termine justo después de "en".',
      d: 'Por defecto, REGEXP_LIKE distingue mayúsculas: "steven" no empieza con "Ste".'
    }
  },
  {
    id: 'P058', examen: 'programming', tema: 'Expresiones regulares',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT REGEXP_REPLACE('507-123-4567', '[0-9]', '#')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '###-###-####' },
      { id: 'b', texto: '#07-123-4567' },
      { id: 'c', texto: '#-#-#' },
      { id: 'd', texto: '507-123-4567' }
    ],
    correctas: ['a'],
    explicacion: '[0-9] coincide con cualquier dígito, y REGEXP_REPLACE reemplaza por defecto todas las coincidencias. Los guiones no son dígitos y se conservan.',
    porQueNo: {
      b: 'REGEXP_REPLACE reemplaza todas las coincidencias, no solo la primera.',
      c: 'Cada dígito se reemplaza individualmente, porque el patrón no tiene cuantificador +.',
      d: 'Hay coincidencias, así que la cadena cambia.'
    }
  },
  {
    id: 'P059', examen: 'programming', tema: 'Expresiones regulares',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT REGEXP_COUNT('banana', 'a'),\n       REGEXP_SUBSTR('abc123def45', '[0-9]+')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '3, 123' },
      { id: 'b', texto: '3, 12345' },
      { id: 'c', texto: '2, 123' },
      { id: 'd', texto: '3, 1' }
    ],
    correctas: ['a'],
    explicacion: 'REGEXP_COUNT cuenta las apariciones del patrón: tres "a". REGEXP_SUBSTR devuelve la primera coincidencia: [0-9]+ toma la secuencia de dígitos más larga en esa posición, "123".',
    porQueNo: {
      b: 'REGEXP_SUBSTR devuelve solo la primera coincidencia, no las une.',
      c: '"banana" tiene tres letras a.',
      d: 'El cuantificador + toma uno o más dígitos consecutivos, no solo uno.'
    }
  },
  {
    id: 'P060', examen: 'programming', tema: 'TCL',
    tipo: 'unica',
    enunciado: "Verdadero o falso: después de ejecutar `INSERT INTO copy_dept VALUES (300, 'QA');` y luego `ROLLBACK;`, la fila 300 sigue en la tabla.",
    opciones: [
      { id: 'a', texto: 'Falso' },
      { id: 'b', texto: 'Verdadero' }
    ],
    correctas: ['a'],
    explicacion: 'ROLLBACK deshace todos los cambios no confirmados de la transacción actual, incluido el INSERT.',
    porQueNo: {
      b: 'La fila solo permanecería si se hubiera ejecutado COMMIT (o una sentencia DDL) antes del ROLLBACK.'
    }
  },
  {
    id: 'P061', examen: 'programming', tema: 'TCL',
    tipo: 'unica',
    enunciado: 'COPY_DEPT está vacía. ¿Qué filas tiene al final?',
    codigo: "INSERT INTO copy_dept VALUES (1, 'A');\nSAVEPOINT s1;\nINSERT INTO copy_dept VALUES (2, 'B');\nROLLBACK TO SAVEPOINT s1;\nCOMMIT;",
    opciones: [
      { id: 'a', texto: 'Solo la fila 1.' },
      { id: 'b', texto: 'Las filas 1 y 2.' },
      { id: 'c', texto: 'Ninguna.' },
      { id: 'd', texto: 'Solo la fila 2.' }
    ],
    correctas: ['a'],
    explicacion: 'ROLLBACK TO SAVEPOINT deshace solo lo hecho después del savepoint (la fila 2). Luego COMMIT confirma la fila 1.',
    porQueNo: {
      b: 'La fila 2 se insertó después de s1 y se deshizo.',
      c: 'ROLLBACK TO SAVEPOINT no deshace toda la transacción.',
      d: 'Se deshace lo posterior al savepoint, no lo anterior.'
    }
  },
  {
    id: 'P062', examen: 'programming', tema: 'Funciones de fecha',
    tipo: 'unica',
    enunciado: 'Son las 15:45 del 29 de octubre de 2026. ¿Qué devuelve `TO_CHAR(TRUNC(SYSDATE), \'DD-MM-YYYY HH24:MI\')`?',
    opciones: [
      { id: 'a', texto: '29-10-2026 00:00' },
      { id: 'b', texto: '29-10-2026 15:45' },
      { id: 'c', texto: '01-10-2026 00:00' },
      { id: 'd', texto: '29-10-2026 15:00' }
    ],
    correctas: ['a'],
    explicacion: 'TRUNC sobre una fecha sin modelo de formato elimina la parte horaria: deja la fecha a la medianoche.',
    porQueNo: {
      b: 'TRUNC elimina la hora.',
      c: "Eso haría TRUNC(SYSDATE, 'MONTH').",
      d: "Eso haría TRUNC(SYSDATE, 'HH')."
    }
  }
];
