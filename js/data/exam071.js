/* Banco: Oracle Database SQL 1Z0-071
   Las respuestas asumen Oracle Database 19c, NLS_LANGUAGE AMERICAN y NLS_DATE_FORMAT 'DD-MON-RR'. */
var BANCO_071 = (function () {
  // Estructuras reutilizadas en los exhibits (esquema estilo HR).
  var T_EMP = { titulo: 'EMPLOYEES', estructura: [
    ['EMPLOYEE_ID', 'NUMBER(6)', 'PRIMARY KEY'],
    ['FIRST_NAME', 'VARCHAR2(20)', ''],
    ['LAST_NAME', 'VARCHAR2(25)', 'NOT NULL'],
    ['EMAIL', 'VARCHAR2(25)', 'NOT NULL, UNIQUE'],
    ['HIRE_DATE', 'DATE', 'NOT NULL'],
    ['JOB_ID', 'VARCHAR2(10)', 'FOREIGN KEY -> JOBS'],
    ['SALARY', 'NUMBER(8,2)', ''],
    ['COMMISSION_PCT', 'NUMBER(2,2)', ''],
    ['MANAGER_ID', 'NUMBER(6)', 'FOREIGN KEY -> EMPLOYEES'],
    ['DEPARTMENT_ID', 'NUMBER(4)', 'FOREIGN KEY -> DEPARTMENTS']
  ] };
  var T_DEPT = { titulo: 'DEPARTMENTS', estructura: [
    ['DEPARTMENT_ID', 'NUMBER(4)', 'PRIMARY KEY'],
    ['DEPARTMENT_NAME', 'VARCHAR2(30)', 'NOT NULL'],
    ['MANAGER_ID', 'NUMBER(6)', ''],
    ['LOCATION_ID', 'NUMBER(4)', '']
  ] };

  return [
  {
    id: 'X001', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: 'Examina los datos de la tabla EMP. ¿Cuántas filas devuelve la consulta?',
    exhibit: [{
      titulo: 'EMP',
      columnas: ['EMP_ID', 'NAME', 'DEPT_ID'],
      filas: [['1', 'King', '10'], ['2', 'Lee', '20'], ['3', 'Diaz', null], ['4', 'Mora', '30']]
    }],
    codigo: 'SELECT name\nFROM   emp\nWHERE  dept_id NOT IN (10, NULL);',
    opciones: [
      { id: 'a', texto: '0' },
      { id: 'b', texto: '2' },
      { id: 'c', texto: '3' },
      { id: 'd', texto: '1' }
    ],
    correctas: ['a'],
    explicacion: 'NOT IN (10, NULL) equivale a dept_id <> 10 AND dept_id <> NULL. Cualquier comparación con NULL da UNKNOWN, así que la condición nunca es TRUE y no se devuelve ninguna fila.',
    porQueNo: {
      b: 'Sería el resultado si la lista no tuviera NULL (Lee y Mora), pero el NULL hace que toda la condición sea UNKNOWN.',
      c: 'Además del efecto del NULL en la lista, la fila de Diaz (dept_id NULL) nunca cumpliría la condición.',
      d: 'Ninguna fila evalúa a TRUE: "dept_id <> NULL" siempre es UNKNOWN.'
    }
  },
  {
    id: 'X002', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar esta consulta?',
    codigo: 'SELECT last_name, salary * 12 AS annual\nFROM   employees\nWHERE  annual > 100000\nORDER BY annual;',
    opciones: [
      { id: 'a', texto: 'Falla con ORA-00904: "ANNUAL": invalid identifier, porque el alias no puede usarse en WHERE.' },
      { id: 'b', texto: 'Se ejecuta correctamente y ordena por el salario anual.' },
      { id: 'c', texto: 'Falla porque el alias no puede usarse en ORDER BY.' },
      { id: 'd', texto: 'Se ejecuta, pero ignora la cláusula WHERE.' }
    ],
    correctas: ['a'],
    explicacion: 'WHERE se evalúa antes que la lista del SELECT, así que los alias de columna no existen todavía en WHERE. En ORDER BY sí se pueden usar, porque se procesa al final.',
    porQueNo: {
      b: 'El uso del alias en WHERE provoca un error antes de llegar a ordenar.',
      c: 'ORDER BY sí admite alias de columna; el problema está en WHERE.',
      d: 'Oracle no ignora cláusulas: el identificador inválido produce un error.'
    }
  },
  {
    id: 'X003', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'multiple',
    enunciado: 'La tabla EMPLOYEES tiene las columnas EMPLOYEE_ID, DEPARTMENT_ID, JOB_ID y SALARY. ¿Qué dos consultas se ejecutan correctamente? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'SELECT department_id, job_id, SUM(salary)\nFROM   employees\nGROUP BY department_id;' },
      { id: 'b', texto: 'SELECT department_id, MAX(AVG(salary))\nFROM   employees\nGROUP BY department_id;' },
      { id: 'c', texto: 'SELECT MAX(AVG(salary))\nFROM   employees\nGROUP BY department_id;' },
      { id: 'd', texto: 'SELECT SUM(salary)\nFROM   employees\nGROUP BY department_id, job_id;' },
      { id: 'e', texto: 'SELECT department_id, SUM(salary)\nFROM   employees\nWHERE  SUM(salary) > 10000\nGROUP BY department_id;' }
    ],
    correctas: ['c', 'd'],
    explicacion: 'Las funciones de grupo anidadas (máximo dos niveles) requieren GROUP BY y no admiten columnas individuales en el SELECT. Las columnas del GROUP BY no tienen que aparecer en el SELECT.',
    porQueNo: {
      a: 'job_id está en el SELECT pero no en el GROUP BY: ORA-00979: not a GROUP BY expression.',
      b: 'Con funciones de grupo anidadas, el SELECT no puede incluir columnas individuales como department_id (ORA-00937).',
      e: 'Las funciones de grupo no pueden usarse en WHERE (ORA-00934); debe usarse HAVING.'
    }
  },
  {
    id: 'X004', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar esta sentencia?',
    codigo: 'SELECT employee_id, last_name AS name FROM employees\nUNION\nSELECT department_id, department_name FROM departments\nORDER BY last_name;',
    opciones: [
      { id: 'a', texto: 'Falla: en un operador de conjunto, ORDER BY solo reconoce los nombres o alias de columna de la primera consulta.' },
      { id: 'b', texto: 'Ordena el resultado por apellido.' },
      { id: 'c', texto: 'Falla porque los tipos de las columnas no coinciden.' },
      { id: 'd', texto: 'Falla porque ORDER BY no está permitido con UNION.' }
    ],
    correctas: ['a'],
    explicacion: 'Cuando la primera consulta define el alias NAME, el nombre de columna del resultado es NAME. ORDER BY debe usar ese alias o la posición (ORDER BY 2); last_name ya no es reconocido: ORA-00904.',
    porQueNo: {
      b: 'last_name quedó reemplazado por el alias NAME en el resultado compuesto.',
      c: 'Los tipos coinciden por posición: NUMBER con NUMBER y VARCHAR2 con VARCHAR2.',
      d: 'Se permite un único ORDER BY al final de la sentencia compuesta.'
    }
  },
  {
    id: 'X005', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: 'Se acaba de crear la secuencia SEQ1 y, en una sesión nueva, se ejecuta de inmediato esta consulta. ¿Qué ocurre?',
    codigo: 'CREATE SEQUENCE seq1 START WITH 100;\n\nSELECT seq1.CURRVAL FROM dual;',
    opciones: [
      { id: 'a', texto: 'Error ORA-08002: sequence SEQ1.CURRVAL is not yet defined in this session.' },
      { id: 'b', texto: 'Devuelve 100.' },
      { id: 'c', texto: 'Devuelve 99.' },
      { id: 'd', texto: 'Devuelve NULL.' }
    ],
    correctas: ['a'],
    explicacion: 'CURRVAL devuelve el último valor generado por NEXTVAL en la sesión actual. Si NEXTVAL no se ha usado en la sesión, CURRVAL no está definido.',
    porQueNo: {
      b: '100 se obtendría con el primer NEXTVAL, no con CURRVAL.',
      c: 'Las secuencias no tienen un valor "anterior" accesible.',
      d: 'Oracle no devuelve NULL; lanza ORA-08002.'
    }
  },
  {
    id: 'X006', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'unica',
    enunciado: 'En una sesión sin transacciones pendientes se ejecutan estas sentencias. ¿Cuántas filas tiene T1 al final?',
    codigo: "CREATE TABLE t1 (c1 NUMBER);\nINSERT INTO t1 VALUES (1);\nINSERT INTO t1 VALUES (2);\nCREATE TABLE t2 (c1 NUMBER);\nINSERT INTO t1 VALUES (3);\nROLLBACK;",
    opciones: [
      { id: 'a', texto: '2' },
      { id: 'b', texto: '0' },
      { id: 'c', texto: '3' },
      { id: 'd', texto: '1' }
    ],
    correctas: ['a'],
    explicacion: 'Las sentencias DDL hacen un COMMIT implícito antes y después de ejecutarse. CREATE TABLE t2 confirma los INSERT de 1 y 2. El ROLLBACK solo deshace el INSERT de 3.',
    porQueNo: {
      b: 'Ignora el COMMIT implícito del segundo CREATE TABLE.',
      c: 'El ROLLBACK deshace el último INSERT, que no fue confirmado.',
      d: 'Ambos INSERT previos al DDL quedan confirmados.'
    }
  },
  {
    id: 'X007', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta consulta?',
    codigo: "SELECT 'Total: ' || NULL || 5 + 3\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'Error ORA-01722: invalid number' },
      { id: 'b', texto: 'Total: 8' },
      { id: 'c', texto: 'Total: 53' },
      { id: 'd', texto: 'NULL' }
    ],
    correctas: ['a'],
    explicacion: "En Oracle, || y + tienen la misma precedencia y se evalúan de izquierda a derecha. Primero se forma 'Total: 5' (concatenar con NULL no anula el texto) y luego se intenta 'Total: 5' + 3, cuya conversión implícita a número falla.",
    porQueNo: {
      b: 'La suma no se evalúa antes que la concatenación; se procesan de izquierda a derecha.',
      c: 'El + no concatena: intenta convertir el texto en número.',
      d: 'Concatenar con NULL no produce NULL en Oracle; NULL se trata como cadena vacía.'
    }
  },
  {
    id: 'X008', examen: 'exam071', tema: 'Joins',
    tipo: 'multiple',
    enunciado: 'Las tablas EMPLOYEES y DEPARTMENTS tienen en común las columnas DEPARTMENT_ID y MANAGER_ID. ¿Qué dos afirmaciones sobre la consulta son verdaderas? (Elige dos)',
    codigo: 'SELECT last_name, department_name\nFROM   employees NATURAL JOIN departments;',
    opciones: [
      { id: 'a', texto: 'Une las tablas usando ambas columnas: DEPARTMENT_ID y MANAGER_ID.' },
      { id: 'b', texto: 'Solo devuelve los empleados cuyo gerente es el mismo que el gerente de su departamento.' },
      { id: 'c', texto: 'Une las tablas solo por DEPARTMENT_ID, porque es la clave foránea.' },
      { id: 'd', texto: 'Falla porque hay más de una columna en común.' },
      { id: 'e', texto: 'Incluye a los empleados sin departamento asignado.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'NATURAL JOIN une por todas las columnas con el mismo nombre en ambas tablas, sin importar las restricciones definidas. Así exige igual departamento e igual MANAGER_ID.',
    porQueNo: {
      c: 'NATURAL JOIN no considera las claves foráneas, solo los nombres de columna.',
      d: 'Varias columnas en común no son un error; simplemente se usan todas.',
      e: 'Es un inner join; una fila con DEPARTMENT_ID NULL nunca cumple la igualdad.'
    }
  },
  {
    id: 'X009', examen: 'exam071', tema: 'Privilegios y roles',
    tipo: 'unica',
    enunciado: 'El usuario A ejecuta `GRANT SELECT ON a.t TO b WITH GRANT OPTION;` y luego B ejecuta `GRANT SELECT ON a.t TO c;`. Después A ejecuta `REVOKE SELECT ON a.t FROM b;`. ¿Qué pasa con el privilegio de C?',
    opciones: [
      { id: 'a', texto: 'C también pierde el privilegio (revocación en cascada).' },
      { id: 'b', texto: 'C conserva el privilegio.' },
      { id: 'c', texto: 'El REVOKE falla porque B otorgó el privilegio a otro usuario.' },
      { id: 'd', texto: 'C conserva el privilegio, pero ya no puede otorgarlo.' }
    ],
    correctas: ['a'],
    explicacion: 'Los privilegios de objeto otorgados WITH GRANT OPTION se revocan en cascada. Esto es lo contrario de los privilegios de sistema WITH ADMIN OPTION, cuya revocación no se propaga.',
    porQueNo: {
      b: 'Eso ocurriría con privilegios de sistema otorgados WITH ADMIN OPTION, no con privilegios de objeto.',
      c: 'El REVOKE es válido y se propaga.',
      d: 'C nunca tuvo GRANT OPTION, y aun así pierde el privilegio por la cascada.'
    }
  },
  {
    id: 'X010', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'unica',
    enunciado: '¿Qué afirmación sobre la vista V_DEPT es verdadera?',
    codigo: 'CREATE VIEW v_dept AS\n  SELECT department_id, COUNT(*) AS total\n  FROM   employees\n  GROUP BY department_id;',
    opciones: [
      { id: 'a', texto: 'No se pueden ejecutar INSERT, UPDATE ni DELETE a través de la vista.' },
      { id: 'b', texto: 'Se pueden borrar filas de EMPLOYEES a través de la vista.' },
      { id: 'c', texto: 'La vista no se puede crear porque COUNT(*) requiere alias en la tabla base.' },
      { id: 'd', texto: 'Solo se puede actualizar la columna TOTAL.' }
    ],
    correctas: ['a'],
    explicacion: 'Una vista que contiene funciones de grupo, GROUP BY, DISTINCT o ROWNUM no admite operaciones DML, porque una fila de la vista no corresponde a una sola fila de la tabla base.',
    porQueNo: {
      b: 'GROUP BY impide el DELETE: una fila de la vista representa muchas filas base.',
      c: 'La vista se crea sin problema: el alias TOTAL ya nombra a la expresión.',
      d: 'TOTAL es una expresión derivada de una función de grupo; no puede actualizarse.'
    }
  },
  {
    id: 'X011', examen: 'exam071', tema: 'Variables de sustitución',
    tipo: 'unica',
    enunciado: 'En SQL*Plus o SQL Developer se ejecuta este script (sin DEFINE previo de la variable). ¿Cuántas veces se pide al usuario el valor de COL?',
    codigo: "SELECT employee_id, &&col\nFROM   employees\nORDER BY &col;\n\nSELECT &col FROM departments;",
    opciones: [
      { id: 'a', texto: 'Una vez' },
      { id: 'b', texto: 'Dos veces' },
      { id: 'c', texto: 'Tres veces' },
      { id: 'd', texto: 'Ninguna; da error porque COL no está definida' }
    ],
    correctas: ['a'],
    explicacion: '&& pide el valor y lo define (como DEFINE) para el resto de la sesión. Las referencias posteriores con & o && reutilizan ese valor hasta hacer UNDEFINE.',
    porQueNo: {
      b: 'La segunda sentencia también reutiliza la variable ya definida por &&.',
      c: 'Solo la primera aparición pide el valor.',
      d: 'Una variable no definida no da error: se le pide el valor al usuario.'
    }
  },
{
    id: 'X012', examen: 'exam071', tema: 'Conceptos relacionales y tipos de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las bases de datos relacionales en Oracle son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Una clave primaria puede estar formada por varias columnas.' },
      { id: 'b', texto: 'Una clave foránea debe hacer referencia a una clave primaria o a una clave única.' },
      { id: 'c', texto: 'Toda tabla debe tener una clave primaria para poder crearse.' },
      { id: 'd', texto: 'Una columna de clave foránea debe tener el mismo nombre que la columna a la que hace referencia.' },
      { id: 'e', texto: 'Si no se usa ORDER BY, las filas se devuelven siempre en el orden en que se insertaron.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Una PK puede ser compuesta. Una FK debe referenciar columnas con restricción PRIMARY KEY o UNIQUE en la tabla padre (ORA-02270 en caso contrario).',
    porQueNo: {
      c: 'Oracle permite crear tablas sin clave primaria; es una buena práctica, no un requisito.',
      d: 'Los nombres de las columnas pueden ser distintos; lo que debe coincidir es el tipo de dato.',
      e: 'Sin ORDER BY el orden de las filas no está garantizado.'
    }
  },
  {
    id: 'X013', examen: 'exam071', tema: 'Conceptos relacionales y tipos de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los tipos de datos de Oracle son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Un valor guardado en una columna CHAR(10) se rellena con espacios a la derecha hasta ocupar 10 caracteres.' },
      { id: 'b', texto: 'Una tabla solo puede tener una columna de tipo LONG.' },
      { id: 'c', texto: 'Una columna VARCHAR2 puede declararse sin longitud; por defecto tiene longitud 1.' },
      { id: 'd', texto: 'Una columna NUMBER(5,2) puede almacenar el valor 1234.5.' },
      { id: 'e', texto: 'Una columna BLOB puede usarse en una cláusula ORDER BY.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'CHAR es de longitud fija y rellena con espacios. Oracle permite como máximo una columna LONG por tabla (ORA-01754 si se intenta una segunda).',
    porQueNo: {
      c: 'VARCHAR2 exige longitud (ORA-00906: missing left parenthesis). El que tiene longitud 1 por defecto es CHAR.',
      d: 'NUMBER(5,2) admite 3 dígitos enteros (máximo 999.99); 1234.5 produce ORA-01438.',
      e: 'Los LOB no pueden usarse en ORDER BY, GROUP BY ni DISTINCT.'
    }
  },
  {
    id: 'X014', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'unica',
    enunciado: '¿Qué afirmación sobre esta consulta es verdadera?',
    codigo: 'SELECT DISTINCT department_id, job_id\nFROM   employees;',
    opciones: [
      { id: 'a', texto: 'Elimina las filas duplicadas considerando la combinación de DEPARTMENT_ID y JOB_ID.' },
      { id: 'b', texto: 'DISTINCT solo se aplica a DEPARTMENT_ID, la primera columna.' },
      { id: 'c', texto: 'Falla, porque DISTINCT solo admite una columna.' },
      { id: 'd', texto: 'Excluye las filas en las que DEPARTMENT_ID es NULL.' }
    ],
    correctas: ['a'],
    explicacion: 'DISTINCT se aplica a toda la lista del SELECT: dos filas son duplicadas solo si coinciden en todas las columnas seleccionadas. Las filas con NULL se tratan como iguales entre sí y aparecen una vez.',
    porQueNo: {
      b: 'DISTINCT afecta a todas las columnas de la lista, no solo a la primera.',
      c: 'DISTINCT admite cualquier número de columnas.',
      d: 'DISTINCT no elimina los NULL; agrupa todos los NULL de una columna como un mismo valor.'
    }
  },
  {
    id: 'X015', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'unica',
    enunciado: 'Observa los datos. ¿Qué valor muestra la columna TOTAL para King?',
    exhibit: [{ titulo: 'EMPLOYEES (extracto)', columnas: ['LAST_NAME', 'SALARY', 'COMMISSION_PCT'], filas: [['King', '24000', null], ['Abel', '11000', '.3']] }],
    codigo: 'SELECT last_name, salary + salary * commission_pct AS total\nFROM   employees;',
    opciones: [
      { id: 'a', texto: 'NULL' },
      { id: 'b', texto: '24000' },
      { id: 'c', texto: '0' },
      { id: 'd', texto: 'La consulta falla por la presencia de NULL.' }
    ],
    correctas: ['a'],
    explicacion: 'Cualquier expresión aritmética con un operando NULL da NULL: salary * NULL es NULL y 24000 + NULL también es NULL. Para obtener 24000 habría que usar NVL(commission_pct, 0).',
    porQueNo: {
      b: 'Ese sería el resultado con NVL(commission_pct, 0); NULL no se trata como cero.',
      c: 'NULL no equivale a cero en aritmética.',
      d: 'Operar con NULL no produce error; solo produce NULL.'
    }
  },
  {
    id: 'X016', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'unica',
    enunciado: 'El empleado 100 se apellida King y gana 24000. ¿Qué devuelve la consulta?',
    codigo: "SELECT last_name || q'['s salary is ]' || salary AS info\nFROM   employees\nWHERE  employee_id = 100;",
    opciones: [
      { id: 'a', texto: "King's salary is 24000" },
      { id: 'b', texto: "King[\'s salary is ]24000" },
      { id: 'c', texto: "Kings salary is 24000" },
      { id: 'd', texto: 'Error ORA-01756: quoted string not properly terminated' }
    ],
    correctas: ['a'],
    explicacion: "El operador de comillas alternativo q'[...]' delimita el literal con los corchetes, permitiendo incluir un apóstrofo sin duplicarlo. Los corchetes no forman parte del texto.",
    porQueNo: {
      b: 'Los delimitadores [ ] no se incluyen en el resultado.',
      c: 'El apóstrofo sí forma parte del literal.',
      d: 'Con el operador q el apóstrofo interior no cierra la cadena.'
    }
  },
  {
    id: 'X017', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'multiple',
    enunciado: 'Se quiere mostrar la columna LAST_NAME con el encabezado Employee Name (con espacio y respetando mayúsculas). ¿Qué dos sentencias lo logran? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'SELECT last_name "Employee Name" FROM employees;' },
      { id: 'b', texto: 'SELECT last_name AS "Employee Name" FROM employees;' },
      { id: 'c', texto: "SELECT last_name AS 'Employee Name' FROM employees;" },
      { id: 'd', texto: 'SELECT last_name Employee Name FROM employees;' },
      { id: 'e', texto: 'SELECT last_name AS [Employee Name] FROM employees;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Un alias con espacios, caracteres especiales o mayúsculas/minúsculas exactas debe ir entre comillas dobles. La palabra AS es opcional.',
    porQueNo: {
      c: 'Las comillas simples delimitan literales, no alias: ORA-00923: FROM keyword not found where expected.',
      d: 'Sin comillas, Employee se toma como alias y Name sobra: ORA-00923.',
      e: 'Los corchetes son sintaxis de SQL Server; en Oracle producen error.'
    }
  },
  {
    id: 'X018', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: 'La tabla EMPLOYEES tiene empleados con salarios entre 2500 y 24000. ¿Qué devuelve la consulta?',
    codigo: 'SELECT last_name\nFROM   employees\nWHERE  salary BETWEEN 10000 AND 5000;',
    opciones: [
      { id: 'a', texto: 'Ninguna fila.' },
      { id: 'b', texto: 'Los empleados con salario entre 5000 y 10000.' },
      { id: 'c', texto: 'Error: el límite inferior es mayor que el superior.' },
      { id: 'd', texto: 'Los empleados con salario menor que 5000 o mayor que 10000.' }
    ],
    correctas: ['a'],
    explicacion: 'BETWEEN a AND b equivale a >= a AND <= b. Con salary >= 10000 AND salary <= 5000 ninguna fila cumple la condición. Oracle no reordena los límites ni da error.',
    porQueNo: {
      b: 'Oracle no intercambia los límites automáticamente.',
      c: 'No es un error de sintaxis ni de ejecución; solo es una condición imposible.',
      d: 'Eso sería NOT BETWEEN 5000 AND 10000.'
    }
  },
  {
    id: 'X019', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: 'La tabla JOBS contiene, entre otros, los valores de JOB_ID SA_MAN, SA_REP y SAX1. ¿Qué condición devuelve únicamente los JOB_ID que empiezan con los tres caracteres "SA_" (incluido el guion bajo)?',
    opciones: [
      { id: 'a', texto: "WHERE job_id LIKE 'SA\\_%' ESCAPE '\\'" },
      { id: 'b', texto: "WHERE job_id LIKE 'SA_%'" },
      { id: 'c', texto: "WHERE job_id LIKE 'SA\\_%'" },
      { id: 'd', texto: "WHERE job_id = 'SA_%'" }
    ],
    correctas: ['a'],
    explicacion: 'En LIKE, el guion bajo es un comodín de un carácter. Para buscarlo literalmente se define un carácter de escape con ESCAPE y se antepone al guion bajo.',
    porQueNo: {
      b: 'Aquí el guion bajo es comodín: también devuelve SAX1.',
      c: 'Sin la cláusula ESCAPE la barra invertida es un carácter literal, así que busca valores que empiecen con "SA\\" y no devuelve SA_MAN ni SA_REP.',
      d: 'Con = no hay comodines: busca el texto exacto "SA_%".'
    }
  },
  {
    id: 'X020', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: '¿Qué filas devuelve esta consulta?',
    codigo: "SELECT last_name, job_id, salary\nFROM   employees\nWHERE  job_id = 'SA_REP'\nOR     job_id = 'AD_PRES'\nAND    salary > 15000;",
    opciones: [
      { id: 'a', texto: 'Todos los SA_REP, sin importar su salario, y los AD_PRES que ganan más de 15000.' },
      { id: 'b', texto: 'Los SA_REP y los AD_PRES que ganan más de 15000.' },
      { id: 'c', texto: 'Todos los SA_REP y todos los AD_PRES.' },
      { id: 'd', texto: 'Ninguna: falta usar paréntesis para combinar AND y OR.' }
    ],
    correctas: ['a'],
    explicacion: 'AND tiene mayor precedencia que OR. La condición equivale a job_id = \'SA_REP\' OR (job_id = \'AD_PRES\' AND salary > 15000).',
    porQueNo: {
      b: 'Eso requeriría (job_id = \'SA_REP\' OR job_id = \'AD_PRES\') AND salary > 15000.',
      c: 'La condición de salario sí se aplica, pero solo a los AD_PRES.',
      d: 'Los paréntesis son opcionales; sin ellos se aplica la precedencia normal.'
    }
  },
  {
    id: 'X021', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'multiple',
    enunciado: 'Dada la consulta `SELECT last_name, salary * 12 annual FROM employees`, ¿qué tres cláusulas ORDER BY pueden añadirse al final sin provocar error? (Elige tres)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: 'ORDER BY annual' },
      { id: 'b', texto: 'ORDER BY 2' },
      { id: 'c', texto: 'ORDER BY department_id' },
      { id: 'd', texto: 'ORDER BY 3' },
      { id: 'e', texto: 'ORDER BY "Annual"' }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: 'ORDER BY admite alias de columna, la posición en la lista del SELECT y columnas de la tabla que no se seleccionan (si no hay DISTINCT).',
    porQueNo: {
      d: 'La lista del SELECT solo tiene dos expresiones: ORA-01785: ORDER BY item must be the number of a SELECT-list expression.',
      e: 'El alias sin comillas se guarda en mayúsculas (ANNUAL). "Annual" entre comillas es otro identificador: ORA-00904.'
    }
  },
  {
    id: 'X022', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas devuelve la consulta?',
    exhibit: [{ titulo: 'SALES_REPS', columnas: ['REP_ID', 'NAME', 'COMMISSION_PCT'], filas: [['1', 'Abel', '.3'], ['2', 'Grant', null], ['3', 'Vargas', null], ['4', 'Taylor', '.2']] }],
    codigo: 'SELECT name\nFROM   sales_reps\nWHERE  commission_pct = NULL\nOR     commission_pct != NULL;',
    opciones: [
      { id: 'a', texto: '0' },
      { id: 'b', texto: '2' },
      { id: 'c', texto: '4' },
      { id: 'd', texto: 'Error: NULL no puede compararse con = ni con !=' }
    ],
    correctas: ['a'],
    explicacion: 'Cualquier comparación con NULL mediante =, != o <> da UNKNOWN, nunca TRUE. Para comprobar nulos hay que usar IS NULL o IS NOT NULL.',
    porQueNo: {
      b: 'Ese sería el resultado de WHERE commission_pct IS NULL (o de IS NOT NULL).',
      c: 'Ese sería el resultado de IS NULL OR IS NOT NULL.',
      d: 'La sintaxis es válida; simplemente ninguna fila evalúa a TRUE.'
    }
  },
  {
    id: 'X023', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT DISTINCT department_id\nFROM   employees\nORDER BY last_name;',
    opciones: [
      { id: 'a', texto: 'Error ORA-01791: not a SELECTed expression.' },
      { id: 'b', texto: 'Devuelve los departamentos ordenados por el apellido del primer empleado de cada uno.' },
      { id: 'c', texto: 'Devuelve los departamentos sin ordenar, porque ORDER BY se ignora con DISTINCT.' },
      { id: 'd', texto: 'Devuelve una fila por empleado ordenada por apellido.' }
    ],
    correctas: ['a'],
    explicacion: 'Con SELECT DISTINCT, las expresiones de ORDER BY deben aparecer en la lista del SELECT; si no, Oracle no sabe qué valor de last_name usar para cada departamento.',
    porQueNo: {
      b: 'Oracle no elige un "primer empleado"; rechaza la consulta.',
      c: 'ORDER BY nunca se ignora: provoca un error.',
      d: 'DISTINCT sobre department_id devuelve una fila por departamento, no por empleado; de todos modos, la consulta falla.'
    }
  },
  {
    id: 'X024', examen: 'exam071', tema: 'Variables de sustitución',
    tipo: 'unica',
    enunciado: 'En SQL*Plus se ejecuta el siguiente script. ¿Qué sucede?',
    codigo: 'DEFINE dept = 50\nSET VERIFY ON\nSELECT last_name FROM employees WHERE department_id = &dept;',
    opciones: [
      { id: 'a', texto: 'No se pide ningún valor; antes del resultado se muestran las líneas "old" y "new" con la sentencia antes y después de la sustitución.' },
      { id: 'b', texto: 'Se pide el valor de DEPT porque & siempre solicita un valor.' },
      { id: 'c', texto: 'No se pide ningún valor y no se muestra nada adicional al resultado.' },
      { id: 'd', texto: 'Falla porque DEFINE requiere comillas alrededor del valor.' }
    ],
    correctas: ['a'],
    explicacion: 'Si la variable ya está definida (con DEFINE o con &&), & usa su valor sin preguntar. SET VERIFY ON muestra el texto de la sentencia antes (old) y después (new) de la sustitución.',
    porQueNo: {
      b: '& solo pide el valor cuando la variable no está definida.',
      c: 'Con VERIFY ON sí se muestran las líneas old/new.',
      d: 'Las comillas en DEFINE son opcionales para valores sin espacios.'
    }
  },
  {
    id: 'X025', examen: 'exam071', tema: 'Variables de sustitución',
    tipo: 'unica',
    enunciado: 'Se ejecuta la consulta y, cuando SQL*Plus pide el valor de NAME, el usuario escribe King (sin comillas). ¿Qué ocurre?',
    codigo: 'SELECT employee_id, salary\nFROM   employees\nWHERE  last_name = &name;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00904: "KING": invalid identifier.' },
      { id: 'b', texto: 'Devuelve los datos de King.' },
      { id: 'c', texto: 'No devuelve filas, porque busca KING en mayúsculas.' },
      { id: 'd', texto: 'SQL*Plus agrega las comillas automáticamente porque LAST_NAME es VARCHAR2.' }
    ],
    correctas: ['a'],
    explicacion: "La sustitución es textual: la sentencia queda WHERE last_name = King, y King se interpreta como nombre de columna. Para valores de texto la variable debe ir entre comillas: '&name'.",
    porQueNo: {
      b: 'Solo funcionaría si el usuario escribiera \'King\' con comillas, o si el script usara \'&name\'.',
      c: 'No llega a ejecutar la búsqueda: el identificador no existe.',
      d: 'SQL*Plus no conoce el tipo de la columna; sustituye el texto tal cual.'
    }
  },
  {
    id: 'X026', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta consulta?',
    codigo: 'SELECT ROUND(1572.36, -2), TRUNC(1572.36, 1), MOD(17, -5)\nFROM   dual;',
    opciones: [
      { id: 'a', texto: '1600, 1572.3, 2' },
      { id: 'b', texto: '1500, 1572.3, -3' },
      { id: 'c', texto: '1600, 1572.4, 2' },
      { id: 'd', texto: '1572.4, 1500, -2' }
    ],
    correctas: ['a'],
    explicacion: 'ROUND con -2 redondea a las centenas: 1600. TRUNC con 1 corta a un decimal sin redondear: 1572.3. MOD conserva el signo del dividendo: 17 - (-5 * -3) = 2.',
    porQueNo: {
      b: 'ROUND(1572.36, -2) redondea hacia arriba porque 72 ≥ 50; y MOD(17, -5) toma el signo del dividendo (positivo).',
      c: 'TRUNC no redondea: 1572.36 truncado a un decimal es 1572.3.',
      d: 'Confunde las posiciones: -2 actúa a la izquierda del punto decimal y 1 a la derecha.'
    }
  },
  {
    id: 'X027', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta consulta?',
    codigo: "SELECT TRIM('A' FROM 'AABCAA') AS t1,\n       LTRIM('xxyxHix', 'xy') AS t2,\n       LPAD('7', 3, '0')       AS t3\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'BC, Hix, 007' },
      { id: 'b', texto: 'ABCA, Hix, 700' },
      { id: 'c', texto: 'BC, Hi, 007' },
      { id: 'd', texto: 'BCAA, yxHix, 007' }
    ],
    correctas: ['a'],
    explicacion: "TRIM('A' FROM ...) quita todas las A iniciales y finales: 'BC'. LTRIM quita por la izquierda cualquier carácter del conjunto {x, y} hasta encontrar uno que no esté: 'Hix'. LPAD rellena por la izquierda hasta 3 caracteres: '007'.",
    porQueNo: {
      b: 'TRIM elimina todas las repeticiones del carácter en ambos extremos, no solo una; y LPAD rellena a la izquierda.',
      c: 'LTRIM solo actúa por la izquierda; la x final se conserva.',
      d: 'TRIM sin LEADING/TRAILING actúa en ambos extremos; y LTRIM trata el segundo argumento como un conjunto de caracteres, no como una cadena.'
    }
  },
  {
    id: 'X028', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué devuelve esta consulta?',
    codigo: "SELECT REPLACE('JACK AND JUE', 'J', 'BL'),\n       TRANSLATE('ABC123', 'A1', 'X')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'BLACK AND BLUE, XBC23' },
      { id: 'b', texto: 'BLACK AND BLUE, XBC123' },
      { id: 'c', texto: 'BLACK AND JUE, XBCX23' },
      { id: 'd', texto: 'BACK AND BUE, XBC23' }
    ],
    correctas: ['a'],
    explicacion: "REPLACE sustituye cada aparición de la cadena 'J' por 'BL'. TRANSLATE cambia carácter por carácter: A→X; el 1 no tiene correspondiente en la tercera lista, por lo que se elimina.",
    porQueNo: {
      b: 'En TRANSLATE, los caracteres de la segunda lista sin correspondiente en la tercera se eliminan.',
      c: 'REPLACE reemplaza todas las apariciones, no solo la primera; y el 1 se elimina, no se convierte en X.',
      d: 'REPLACE inserta la cadena completa de reemplazo, \'BL\'.'
    }
  },
  {
    id: 'X029', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'multiple',
    enunciado: '¿Qué tres expresiones devuelven exactamente el valor 3? (Elige tres)',
    opciones: [
      { id: 'a', texto: "INSTR('ABCABC', 'C', 1, 2)" },
      { id: 'b', texto: "LENGTH(TRIM(' AB '))" },
      { id: 'c', texto: 'CEIL(2.01)' },
      { id: 'd', texto: 'FLOOR(3.99)' },
      { id: 'e', texto: 'ROUND(2.5)' },
      { id: 'f', texto: 'TRUNC(3.999, 1)' }
    ],
    correctas: ['c', 'd', 'e'],
    explicacion: 'CEIL redondea hacia arriba (3), FLOOR hacia abajo (3) y ROUND con NUMBER redondea los .5 alejándose de cero (3).',
    porQueNo: {
      a: 'Busca la segunda aparición de C, que está en la posición 6.',
      b: "TRIM quita los espacios de ambos extremos y queda 'AB', de longitud 2.",
      f: 'TRUNC con 1 conserva un decimal: 3.9.'
    }
  },
  {
    id: 'X030', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'unica',
    enunciado: 'La consulta se ejecuta en el año 2026. ¿Qué devuelve?',
    codigo: "SELECT TO_CHAR(TO_DATE('10-MAR-50', 'DD-MON-RR'), 'YYYY') AS rr,\n       TO_CHAR(TO_DATE('10-MAR-50', 'DD-MON-YY'), 'YYYY') AS yy\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'RR = 1950, YY = 2050' },
      { id: 'b', texto: 'RR = 2050, YY = 2050' },
      { id: 'c', texto: 'RR = 1950, YY = 1950' },
      { id: 'd', texto: 'RR = 2050, YY = 1950' }
    ],
    correctas: ['a'],
    explicacion: 'YY siempre usa el siglo actual (2050). RR depende de los dos últimos dígitos: si el año actual está entre 00 y 49 y el año indicado entre 50 y 99, se toma el siglo anterior (1950).',
    porQueNo: {
      b: 'Con RR, un año 50-99 escrito durante 2000-2049 se interpreta en el siglo anterior.',
      c: 'YY no aplica ninguna regla: siempre toma el siglo actual.',
      d: 'Invierte el comportamiento de RR y YY.'
    }
  },
  {
    id: 'X031', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'multiple',
    enunciado: '¿Qué dos sentencias se ejecutan sin error? (Elige dos)',
    opciones: [
      { id: 'a', texto: "SELECT TO_NUMBER('$1,000.50', '$9,999.99') FROM dual;" },
      { id: 'b', texto: "SELECT TO_NUMBER('$1,000') FROM dual;" },
      { id: 'c', texto: "SELECT TO_CHAR(SYSDATE, 'fmMonth DD, YYYY') FROM dual;" },
      { id: 'd', texto: "SELECT TO_DATE('2024-13-01', 'YYYY-MM-DD') FROM dual;" },
      { id: 'e', texto: "SELECT TO_CHAR('2024-01-01', 'YYYY') FROM dual;" }
    ],
    correctas: ['a', 'c'],
    explicacion: 'TO_NUMBER con un modelo adecuado interpreta el símbolo $ y la coma de miles. TO_CHAR sobre una fecha acepta modelos como fmMonth DD, YYYY.',
    porQueNo: {
      b: 'Sin modelo de formato, $ y la coma no son válidos en un número: ORA-01722: invalid number.',
      d: 'No existe el mes 13: ORA-01843: not a valid month.',
      e: "El literal es texto, no fecha. Con un modelo de formato, Oracle intenta convertirlo a número y falla con ORA-01722."
    }
  },
  {
    id: 'X032', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'unica',
    enunciado: 'Se desea mostrar "No commission" para los empleados sin comisión. ¿Qué ocurre con esta consulta?',
    exhibit: [T_EMP],
    codigo: "SELECT last_name, NVL(commission_pct, 'No commission')\nFROM   employees;",
    opciones: [
      { id: 'a', texto: 'Falla con ORA-01722: invalid number, porque ambos argumentos de NVL deben ser del mismo tipo de dato que el primero.' },
      { id: 'b', texto: 'Funciona y muestra "No commission" para los NULL.' },
      { id: 'c', texto: 'Funciona, pero muestra 0 para los NULL.' },
      { id: 'd', texto: 'Falla porque NVL solo admite argumentos numéricos.' }
    ],
    correctas: ['a'],
    explicacion: "Si el primer argumento de NVL es numérico, Oracle convierte el segundo a número, y 'No commission' no es convertible. La solución es NVL(TO_CHAR(commission_pct), 'No commission').",
    porQueNo: {
      b: 'El resultado de NVL toma el tipo del primer argumento (NUMBER).',
      c: 'NVL no sustituye por cero; intenta convertir el texto y falla.',
      d: 'NVL admite cualquier tipo, siempre que ambos argumentos sean compatibles.'
    }
  },
  {
    id: 'X033', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'multiple',
    enunciado: 'Para un empleado con COMMISSION_PCT NULL, ¿qué dos expresiones devuelven \'None\'? (Elige dos)',
    opciones: [
      { id: 'a', texto: "DECODE(commission_pct, NULL, 'None', 'Has')" },
      { id: 'b', texto: "CASE commission_pct WHEN NULL THEN 'None' ELSE 'Has' END" },
      { id: 'c', texto: "CASE WHEN commission_pct IS NULL THEN 'None' ELSE 'Has' END" },
      { id: 'd', texto: "NVL2(commission_pct, 'None', 'Has')" },
      { id: 'e', texto: "NVL(TO_CHAR(commission_pct), 'Has')" }
    ],
    correctas: ['a', 'c'],
    explicacion: 'DECODE considera que dos NULL son iguales, así que encuentra la coincidencia. El CASE buscado (searched CASE) con IS NULL también funciona.',
    porQueNo: {
      b: "El CASE simple compara con =, y commission_pct = NULL nunca es TRUE: devuelve 'Has'.",
      d: "NVL2 devuelve el segundo argumento si la expresión NO es NULL y el tercero si lo es: 'Has'.",
      e: "Devuelve 'Has' para los NULL, no 'None'."
    }
  },
  {
    id: 'X034', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'unica',
    enunciado: 'La tabla EMPLOYEES tiene 21 filas. ¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT COUNT(*)\nFROM   employees\nHAVING COUNT(*) > 5;',
    opciones: [
      { id: 'a', texto: 'Devuelve una fila con el valor 21.' },
      { id: 'b', texto: 'Falla porque HAVING requiere GROUP BY.' },
      { id: 'c', texto: 'Devuelve 21 filas con el valor 1.' },
      { id: 'd', texto: 'No devuelve filas.' }
    ],
    correctas: ['a'],
    explicacion: 'Sin GROUP BY, toda la tabla forma un único grupo. HAVING puede filtrar ese grupo: como 21 > 5, se devuelve la fila.',
    porQueNo: {
      b: 'HAVING puede usarse sin GROUP BY; se aplica al grupo único formado por todas las filas.',
      c: 'COUNT(*) sin GROUP BY devuelve una sola fila.',
      d: 'La condición 21 > 5 es verdadera, así que el grupo no se descarta.'
    }
  },
  {
    id: 'X035', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Qué devuelve la consulta?',
    exhibit: [{ titulo: 'STAFF', columnas: ['STAFF_ID', 'DEPT'], filas: [['1', '10'], ['2', '10'], ['3', '20'], ['4', null], ['5', null]] }],
    codigo: 'SELECT COUNT(*), COUNT(dept), COUNT(DISTINCT dept)\nFROM   staff;',
    opciones: [
      { id: 'a', texto: '5, 3, 2' },
      { id: 'b', texto: '5, 5, 3' },
      { id: 'c', texto: '5, 3, 3' },
      { id: 'd', texto: '3, 3, 2' }
    ],
    correctas: ['a'],
    explicacion: 'COUNT(*) cuenta las 5 filas. COUNT(dept) ignora los NULL: 3. COUNT(DISTINCT dept) cuenta valores distintos no nulos: 10 y 20, es decir, 2.',
    porQueNo: {
      b: 'COUNT(columna) no cuenta los NULL.',
      c: 'COUNT(DISTINCT ...) tampoco cuenta el NULL como un valor distinto.',
      d: 'COUNT(*) cuenta todas las filas, incluso las que tienen NULL.'
    }
  },
  {
    id: 'X036', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'multiple',
    enunciado: '¿Qué dos consultas se ejecutan correctamente en Oracle Database 19c? (Elige dos)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: 'SELECT department_id, SUM(salary)\nFROM   employees\nHAVING SUM(salary) > 20000\nGROUP BY department_id;' },
      { id: 'b', texto: 'SELECT department_id dept, SUM(salary)\nFROM   employees\nGROUP BY dept;' },
      { id: 'c', texto: 'SELECT department_id, SUM(salary)\nFROM   employees\nGROUP BY department_id\nORDER BY SUM(salary);' },
      { id: 'd', texto: 'SELECT last_name\nFROM   employees\nWHERE  salary > AVG(salary);' },
      { id: 'e', texto: 'SELECT department_id, SUM(salary)\nFROM   employees\nGROUP BY 1;' }
    ],
    correctas: ['a', 'c'],
    explicacion: 'Oracle permite escribir HAVING antes de GROUP BY (aunque lo habitual es después). ORDER BY puede usar funciones de grupo cuando la consulta agrupa.',
    porQueNo: {
      b: 'En 19c, GROUP BY no admite alias de columna: ORA-00904: "DEPT": invalid identifier.',
      d: 'Las funciones de grupo no se permiten en WHERE (ORA-00934); se necesita una subconsulta.',
      e: 'En 19c GROUP BY 1 agrupa por la constante 1, no por la primera columna, así que department_id no está agrupada: ORA-00979.'
    }
  },
  {
    id: 'X037', examen: 'exam071', tema: 'Joins',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas devuelve la consulta?',
    exhibit: [
      { titulo: 'EMP', columnas: ['EMP_ID', 'NAME', 'DEPT_ID'], filas: [['1', 'Ana', '10'], ['2', 'Beto', '20'], ['3', 'Carla', null], ['4', 'Dario', '10'], ['5', 'Eva', '40']] },
      { titulo: 'DEPT', columnas: ['DEPT_ID', 'DNAME'], filas: [['10', 'Ventas'], ['20', 'TI'], ['30', 'RRHH']] }
    ],
    codigo: 'SELECT e.name, d.dname\nFROM   emp e FULL OUTER JOIN dept d\nON     e.dept_id = d.dept_id;',
    opciones: [
      { id: 'a', texto: '6' },
      { id: 'b', texto: '5' },
      { id: 'c', texto: '8' },
      { id: 'd', texto: '3' }
    ],
    correctas: ['a'],
    explicacion: 'Coincidencias: Ana, Beto y Dario (3). Empleados sin coincidencia: Carla (NULL) y Eva (40), 2. Departamentos sin coincidencia: RRHH (30), 1. Total: 6.',
    porQueNo: {
      b: 'Ese es el resultado del LEFT OUTER JOIN (todos los empleados); falta RRHH.',
      c: 'Un FULL OUTER JOIN no suma las filas de ambas tablas; las coincidencias aparecen una sola vez.',
      d: 'Ese es el resultado del INNER JOIN.'
    }
  },
  {
    id: 'X038', examen: 'exam071', tema: 'Joins',
    tipo: 'multiple',
    enunciado: '¿Qué dos consultas devuelven el mismo resultado que esta? (Elige dos)',
    codigo: 'SELECT e.name, d.dname\nFROM   emp e LEFT OUTER JOIN dept d\nON     e.dept_id = d.dept_id;',
    opciones: [
      { id: 'a', texto: 'SELECT e.name, d.dname\nFROM   emp e, dept d\nWHERE  e.dept_id = d.dept_id(+);' },
      { id: 'b', texto: 'SELECT e.name, d.dname\nFROM   dept d RIGHT OUTER JOIN emp e\nON     e.dept_id = d.dept_id;' },
      { id: 'c', texto: 'SELECT e.name, d.dname\nFROM   emp e, dept d\nWHERE  e.dept_id(+) = d.dept_id;' },
      { id: 'd', texto: 'SELECT e.name, d.dname\nFROM   emp e, dept d\nWHERE  e.dept_id(+) = d.dept_id(+);' },
      { id: 'e', texto: 'SELECT e.name, d.dname\nFROM   emp e FULL OUTER JOIN dept d\nON     e.dept_id = d.dept_id;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'En la sintaxis de Oracle, (+) se coloca en el lado de la tabla que puede "faltar" (la deficiente). LEFT JOIN de emp a dept equivale a poner (+) en dept, o a un RIGHT JOIN con las tablas invertidas.',
    porQueNo: {
      c: 'Con (+) en emp se conservan todos los departamentos: equivale a un RIGHT OUTER JOIN.',
      d: '(+) no puede ir en ambos lados: ORA-01468: a predicate may reference only one outer-joined table.',
      e: 'El FULL OUTER JOIN incluye además los departamentos sin empleados.'
    }
  },
  {
    id: 'X039', examen: 'exam071', tema: 'Joins',
    tipo: 'unica',
    enunciado: 'En EMPLOYEES, King (EMPLOYEE_ID 100) es el único empleado con MANAGER_ID NULL. ¿Qué afirmación sobre el resultado de esta consulta es verdadera?',
    exhibit: [T_EMP],
    codigo: 'SELECT w.last_name AS worker, m.last_name AS manager\nFROM   employees w JOIN employees m\nON     w.manager_id = m.employee_id;',
    opciones: [
      { id: 'a', texto: 'King no aparece en la columna WORKER.' },
      { id: 'b', texto: 'King aparece en la columna WORKER con MANAGER NULL.' },
      { id: 'c', texto: 'Falla, porque una tabla no puede unirse consigo misma.' },
      { id: 'd', texto: 'Solo aparecen los empleados que son gerentes.' }
    ],
    correctas: ['a'],
    explicacion: 'Es un self join interno: King no tiene manager_id, así que no tiene pareja y se excluye. Para incluirlo haría falta LEFT OUTER JOIN.',
    porQueNo: {
      b: 'Eso ocurriría con employees w LEFT OUTER JOIN employees m.',
      c: 'Un self join es válido usando alias distintos para cada instancia de la tabla.',
      d: 'En WORKER aparecen todos los empleados que tienen gerente, sean o no gerentes.'
    }
  },
  {
    id: 'X040', examen: 'exam071', tema: 'Joins',
    tipo: 'unica',
    enunciado: 'Examina los datos. El empleado Ruiz tiene un salario de 3000. ¿Cuántas filas devuelve la consulta para Ruiz?',
    exhibit: [
      { titulo: 'JOB_GRADES', columnas: ['GRADE', 'LOWEST_SAL', 'HIGHEST_SAL'], filas: [['A', '1000', '3000'], ['B', '3000', '5999'], ['C', '6000', '9999']] }
    ],
    codigo: "SELECT e.last_name, g.grade\nFROM   employees e JOIN job_grades g\nON     e.salary BETWEEN g.lowest_sal AND g.highest_sal\nWHERE  e.last_name = 'Ruiz';",
    opciones: [
      { id: 'a', texto: '2' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: '0' },
      { id: 'd', texto: 'Error: un join debe usar el operador =' }
    ],
    correctas: ['a'],
    explicacion: 'Es un non-equijoin. BETWEEN incluye ambos límites, y 3000 está dentro de los rangos A (1000-3000) y B (3000-5999), por lo que se obtienen dos filas.',
    porQueNo: {
      b: 'BETWEEN es inclusivo en ambos extremos, así que 3000 cae en dos grados.',
      c: '3000 sí está dentro de ambos rangos.',
      d: 'La condición de join puede usar cualquier operador; los non-equijoins son válidos.'
    }
  },
{
    id: 'X041', examen: 'exam071', tema: 'Joins',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    exhibit: [T_EMP, T_DEPT],
    codigo: 'SELECT department_id, last_name, department_name\nFROM   employees e JOIN departments d\nON     e.department_id = d.department_id;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00918: column ambiguously defined.' },
      { id: 'b', texto: 'Devuelve los datos; Oracle toma DEPARTMENT_ID de la primera tabla del FROM.' },
      { id: 'c', texto: 'Error ORA-25154, porque con ON no se pueden usar alias.' },
      { id: 'd', texto: 'Devuelve los datos, porque ambas columnas DEPARTMENT_ID tienen el mismo valor en cada fila.' }
    ],
    correctas: ['a'],
    explicacion: 'DEPARTMENT_ID existe en ambas tablas. Con JOIN ... ON (a diferencia de USING o NATURAL JOIN) cada referencia a una columna común debe calificarse: e.department_id o d.department_id.',
    porQueNo: {
      b: 'Oracle no elige una tabla por defecto ante una columna ambigua.',
      c: 'ORA-25154 se refiere a calificar columnas de USING; con ON los alias son obligatorios para las columnas comunes.',
      d: 'Aunque los valores coincidan, el analizador rechaza la referencia ambigua antes de ejecutar.'
    }
  },
  {
    id: 'X042', examen: 'exam071', tema: 'Joins',
    tipo: 'multiple',
    enunciado: 'EMPLOYEES y DEPARTMENTS tienen en común las columnas DEPARTMENT_ID y MANAGER_ID. ¿Qué dos consultas se ejecutan sin error? (Elige dos)',
    exhibit: [T_EMP, T_DEPT],
    opciones: [
      { id: 'a', texto: 'SELECT department_id, e.last_name\nFROM   employees e JOIN departments d\nUSING  (department_id);' },
      { id: 'b', texto: 'SELECT e.department_id, e.last_name\nFROM   employees e NATURAL JOIN departments d;' },
      { id: 'c', texto: 'SELECT d.department_name, e.manager_id\nFROM   employees e JOIN departments d\nUSING  (department_id);' },
      { id: 'd', texto: 'SELECT e.last_name\nFROM   employees e JOIN departments d\nUSING  (e.department_id);' },
      { id: 'e', texto: 'SELECT last_name, department_name\nFROM   employees NATURAL JOIN departments\nWHERE  employees.manager_id = 100;' }
    ],
    correctas: ['a', 'c'],
    explicacion: 'Con USING solo la columna de la cláusula USING no puede llevar prefijo; las demás columnas comunes (como MANAGER_ID) sí pueden y deben calificarse. Las columnas que no participan en el join se pueden calificar con el alias.',
    porQueNo: {
      b: 'En un NATURAL JOIN las columnas comunes no pueden calificarse: ORA-25155: column used in NATURAL join cannot have qualifier.',
      d: 'Dentro de USING tampoco se permite el prefijo: la columna debe escribirse sin alias.',
      e: 'MANAGER_ID es una columna del NATURAL JOIN y no puede calificarse con el nombre de la tabla (ORA-25155).'
    }
  },
  {
    id: 'X043', examen: 'exam071', tema: 'Joins',
    tipo: 'unica',
    enunciado: 'T1 tiene 4 filas, T2 tiene 3 filas y T3 tiene 2 filas. ¿Cuántas filas devuelve la consulta?',
    codigo: 'SELECT *\nFROM   t1 CROSS JOIN t2\n       CROSS JOIN t3;',
    opciones: [
      { id: 'a', texto: '24' },
      { id: 'b', texto: '9' },
      { id: 'c', texto: '12' },
      { id: 'd', texto: 'Error: CROSS JOIN solo admite dos tablas.' }
    ],
    correctas: ['a'],
    explicacion: 'CROSS JOIN produce el producto cartesiano: 4 × 3 × 2 = 24 filas.',
    porQueNo: {
      b: 'El producto cartesiano multiplica las filas, no las suma.',
      c: 'Ese sería el producto de T1 y T2 solamente.',
      d: 'Se pueden encadenar varios CROSS JOIN.'
    }
  },
  {
    id: 'X044', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'En EMPLOYEES, el empleado King tiene MANAGER_ID NULL. Se quiere listar a los empleados que no son gerentes de nadie. ¿Qué devuelve la consulta?',
    exhibit: [T_EMP],
    codigo: 'SELECT last_name\nFROM   employees\nWHERE  employee_id NOT IN (SELECT manager_id\n                           FROM   employees);',
    opciones: [
      { id: 'a', texto: 'Ninguna fila.' },
      { id: 'b', texto: 'Los empleados que no son gerentes de nadie.' },
      { id: 'c', texto: 'Todos los empleados excepto King.' },
      { id: 'd', texto: 'Error, porque la subconsulta devuelve más de una fila.' }
    ],
    correctas: ['a'],
    explicacion: 'La subconsulta devuelve un NULL (el MANAGER_ID de King). NOT IN equivale a una serie de <> unidas con AND, y "x <> NULL" es UNKNOWN, así que ninguna fila cumple. Se corrige con WHERE manager_id IS NOT NULL en la subconsulta, o usando NOT EXISTS.',
    porQueNo: {
      b: 'Es lo que se busca, pero el NULL de la subconsulta lo impide.',
      c: 'El NULL afecta a todas las filas, no solo a la de King.',
      d: 'NOT IN es un operador multifila; acepta varias filas.'
    }
  },
  {
    id: 'X045', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'multiple',
    enunciado: 'Suponiendo que la subconsulta devuelve al menos una fila y ningún NULL, ¿qué dos equivalencias son correctas? (Elige dos)',
    opciones: [
      { id: 'a', texto: '> ALL (subconsulta) equivale a > que el máximo de la subconsulta.' },
      { id: 'b', texto: '< ANY (subconsulta) equivale a < que el máximo de la subconsulta.' },
      { id: 'c', texto: '= ANY (subconsulta) equivale a NOT IN (subconsulta).' },
      { id: 'd', texto: '> ANY (subconsulta) equivale a > que el máximo de la subconsulta.' },
      { id: 'e', texto: '<> ALL (subconsulta) equivale a IN (subconsulta).' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'ALL exige cumplir la condición contra todos los valores (> ALL → mayor que el máximo; < ALL → menor que el mínimo). ANY exige cumplirla contra al menos uno (> ANY → mayor que el mínimo; < ANY → menor que el máximo).',
    porQueNo: {
      c: '= ANY equivale a IN.',
      d: '> ANY equivale a mayor que el mínimo.',
      e: '<> ALL equivale a NOT IN.'
    }
  },
  {
    id: 'X046', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'EMPLOYEES tiene 21 filas y no existe el departamento 999. ¿Cuántas filas devuelve la consulta?',
    codigo: 'SELECT last_name\nFROM   employees\nWHERE  salary > ALL (SELECT salary\n                     FROM   employees\n                     WHERE  department_id = 999);',
    opciones: [
      { id: 'a', texto: '21' },
      { id: 'b', texto: '0' },
      { id: 'c', texto: 'Solo las filas cuyo salario no es NULL.' },
      { id: 'd', texto: 'Error ORA-01427.' }
    ],
    correctas: ['a'],
    explicacion: 'Si la subconsulta no devuelve filas, una condición con ALL se evalúa como TRUE para todas las filas (incluso con salary NULL), porque no hay ningún valor que la contradiga. Con ANY ocurriría lo contrario: FALSE para todas.',
    porQueNo: {
      b: 'Ese sería el resultado con > ANY ante una subconsulta vacía.',
      c: 'Con un conjunto vacío no se llega a comparar salary, así que los NULL también cumplen.',
      d: 'ORA-01427 aparece cuando un operador de una sola fila recibe varias filas, no con ALL.'
    }
  },
  {
    id: 'X047', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Qué empleados devuelve la consulta?',
    exhibit: [{ titulo: 'STAFF', columnas: ['NAME', 'DEPT', 'SALARY'], filas: [['Hunold', '60', '9000'], ['Ernst', '60', '6000'], ['Lorentz', '60', '4200'], ['Rajs', '50', '3500'], ['Davies', '50', '3100']] }],
    codigo: 'SELECT s.name\nFROM   staff s\nWHERE  s.salary > (SELECT AVG(i.salary)\n                   FROM   staff i\n                   WHERE  i.dept = s.dept);',
    opciones: [
      { id: 'a', texto: 'Hunold y Rajs' },
      { id: 'b', texto: 'Solo Hunold' },
      { id: 'c', texto: 'Hunold y Ernst' },
      { id: 'd', texto: 'Hunold, Ernst y Rajs' }
    ],
    correctas: ['a'],
    explicacion: 'Es una subconsulta correlacionada: se evalúa para cada fila externa con su propio departamento. Promedio del 60 = 6400 (solo Hunold lo supera); promedio del 50 = 3300 (Rajs lo supera).',
    porQueNo: {
      b: 'Rajs (3500) supera el promedio de su departamento (3300).',
      c: 'Ernst (6000) no supera el promedio del departamento 60 (6400).',
      d: 'Ernst no supera el promedio de su departamento.'
    }
  },
  {
    id: 'X048', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'El departamento 190 (Contracting) no tiene empleados, y algunos empleados tienen DEPARTMENT_ID NULL. ¿Qué devuelve la consulta?',
    exhibit: [T_EMP, T_DEPT],
    codigo: 'SELECT department_name\nFROM   departments d\nWHERE  NOT EXISTS (SELECT 1\n                   FROM   employees e\n                   WHERE  e.department_id = d.department_id);',
    opciones: [
      { id: 'a', texto: 'Los departamentos sin empleados, como Contracting.' },
      { id: 'b', texto: 'Ninguna fila, porque hay empleados con DEPARTMENT_ID NULL.' },
      { id: 'c', texto: 'Error: la subconsulta debe seleccionar una columna, no una constante.' },
      { id: 'd', texto: 'Todos los departamentos.' }
    ],
    correctas: ['a'],
    explicacion: 'NOT EXISTS solo comprueba si la subconsulta correlacionada devuelve alguna fila. A diferencia de NOT IN, los NULL de EMPLOYEES no afectan al resultado.',
    porQueNo: {
      b: 'Ese problema afecta a NOT IN, no a NOT EXISTS.',
      c: 'En EXISTS lo seleccionado es irrelevante; SELECT 1 es una práctica habitual.',
      d: 'Los departamentos con empleados hacen que la subconsulta devuelva filas y quedan excluidos.'
    }
  },
  {
    id: 'X049', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'multiple',
    enunciado: '¿En qué tres lugares puede usarse una subconsulta escalar (que devuelve una fila y una columna)? (Elige tres)',
    opciones: [
      { id: 'a', texto: 'En la lista del SELECT.' },
      { id: 'b', texto: 'En la condición de la cláusula WHERE.' },
      { id: 'c', texto: 'En la cláusula ORDER BY.' },
      { id: 'd', texto: 'En la cláusula GROUP BY.' },
      { id: 'e', texto: 'Como valor DEFAULT de una columna en CREATE TABLE.' },
      { id: 'f', texto: 'En una restricción CHECK.' }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: 'Las subconsultas escalares pueden usarse en casi cualquier lugar donde se admita una expresión: SELECT, WHERE, ORDER BY, CASE, VALUES de INSERT, SET de UPDATE, etc.',
    porQueNo: {
      d: 'No se permiten en GROUP BY: ORA-22818: subquery expressions not allowed here.',
      e: 'Un DEFAULT no puede contener subconsultas.',
      f: 'Una restricción CHECK no puede contener subconsultas.'
    }
  },
  {
    id: 'X050', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas devuelve la sentencia?',
    exhibit: [
      { titulo: 'A', columnas: ['N'], filas: [['1'], ['2'], ['2'], ['3']] },
      { titulo: 'B', columnas: ['N'], filas: [['2'], ['3'], ['3'], ['4']] }
    ],
    codigo: 'SELECT n FROM a\nUNION ALL\nSELECT n FROM b\nMINUS\nSELECT n FROM b;',
    opciones: [
      { id: 'a', texto: '1' },
      { id: 'b', texto: '4' },
      { id: 'c', texto: '2' },
      { id: 'd', texto: '0' }
    ],
    correctas: ['a'],
    explicacion: 'Todos los operadores de conjunto tienen la misma precedencia y se evalúan de izquierda a derecha: (A UNION ALL B) MINUS B. MINUS elimina duplicados y quita los valores de B: queda {1}.',
    porQueNo: {
      b: 'Ese sería el resultado de A UNION ALL (B MINUS B) = A, con sus 4 filas; pero la evaluación es de izquierda a derecha.',
      c: 'MINUS devuelve filas distintas: los valores 2 y 3 están en B y se eliminan.',
      d: 'El valor 1 no está en B, así que permanece.'
    }
  },
  {
    id: 'X051', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los operadores de conjunto son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Las consultas deben tener el mismo número de columnas, y las columnas correspondientes deben pertenecer al mismo grupo de tipos de datos.' },
      { id: 'b', texto: 'UNION ALL no elimina duplicados.' },
      { id: 'c', texto: 'Las columnas correspondientes deben tener el mismo nombre en ambas consultas.' },
      { id: 'd', texto: 'INTERSECT ignora las filas con NULL, porque NULL nunca es igual a NULL.' },
      { id: 'e', texto: 'Cada consulta del bloque puede tener su propia cláusula ORDER BY.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Se exige igual número de columnas y tipos compatibles por posición. UNION ALL conserva todas las filas, incluidos los duplicados.',
    porQueNo: {
      c: 'Los nombres pueden ser distintos; el resultado usa los de la primera consulta.',
      d: 'Los operadores de conjunto consideran iguales dos NULL al comparar filas: SELECT NULL FROM dual INTERSECT SELECT NULL FROM dual devuelve una fila.',
      e: 'Solo se permite un ORDER BY al final de toda la sentencia compuesta.'
    }
  },
  {
    id: 'X052', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la sentencia?',
    exhibit: [T_EMP, T_DEPT],
    codigo: 'SELECT employee_id, hire_date FROM employees\nUNION\nSELECT department_id, department_name FROM departments;',
    opciones: [
      { id: 'a', texto: 'Error ORA-01790: expression must have same datatype as corresponding expression.' },
      { id: 'b', texto: 'Se ejecuta; Oracle convierte HIRE_DATE a texto implícitamente.' },
      { id: 'c', texto: 'Se ejecuta; la segunda columna toma el tipo VARCHAR2.' },
      { id: 'd', texto: 'Error, porque los nombres de las columnas no coinciden.' }
    ],
    correctas: ['a'],
    explicacion: 'En los operadores de conjunto, las columnas por posición deben ser del mismo grupo de tipos. DATE y VARCHAR2 no lo son, y Oracle no hace conversión implícita en este caso.',
    porQueNo: {
      b: 'Oracle no convierte implícitamente entre grupos de tipos en un operador de conjunto.',
      c: 'El tipo no se promueve; se produce un error.',
      d: 'Los nombres de columna no necesitan coincidir.'
    }
  },
  {
    id: 'X053', examen: 'exam071', tema: 'DML',
    tipo: 'multiple',
    enunciado: 'Examina la estructura de DEPT_COPY. ¿Qué dos sentencias INSERT se ejecutan correctamente? (Elige dos)',
    exhibit: [{ titulo: 'DEPT_COPY', estructura: [['DEPARTMENT_ID', 'NUMBER(4)', 'PRIMARY KEY'], ['DEPARTMENT_NAME', 'VARCHAR2(30)', 'NOT NULL'], ['LOCATION_ID', 'NUMBER(4)', 'DEFAULT 1700']] }],
    opciones: [
      { id: 'a', texto: 'INSERT INTO dept_copy (department_id, department_name)\n  SELECT department_id, department_name FROM departments;' },
      { id: 'b', texto: 'INSERT INTO dept_copy\n  VALUES (SELECT department_id, department_name, location_id FROM departments);' },
      { id: 'c', texto: 'INSERT INTO dept_copy (department_id, department_name)\n  VALUES (300, DEFAULT);' },
      { id: 'd', texto: "INSERT INTO dept_copy (department_id, department_name, location_id)\n  VALUES (310, 'QA', DEFAULT);" },
      { id: 'e', texto: 'INSERT INTO dept_copy (department_id, department_name)\n  VALUES (320);' }
    ],
    correctas: ['a', 'd'],
    explicacion: 'INSERT ... SELECT no lleva la palabra VALUES. La palabra clave DEFAULT en VALUES inserta el valor por defecto de la columna (1700).',
    porQueNo: {
      b: 'Una subconsulta que inserta filas no va dentro de VALUES: produce error.',
      c: 'DEPARTMENT_NAME no tiene DEFAULT, así que DEFAULT inserta NULL y viola NOT NULL: ORA-01400.',
      e: 'Se indican dos columnas pero un solo valor: ORA-00947: not enough values.'
    }
  },
  {
    id: 'X054', examen: 'exam071', tema: 'DML',
    tipo: 'unica',
    enunciado: 'Examina los datos. Después de ejecutar el MERGE, ¿qué filas contiene TARGET?',
    exhibit: [
      { titulo: 'TARGET', columnas: ['ID', 'NAME', 'VAL'], filas: [['1', 'A', '100'], ['2', 'B', '200']] },
      { titulo: 'SOURCE', columnas: ['ID', 'NAME', 'VAL'], filas: [['2', 'B2', '250'], ['3', 'C', '300']] }
    ],
    codigo: 'MERGE INTO target t\nUSING source s\nON (t.id = s.id)\nWHEN MATCHED THEN\n  UPDATE SET t.name = s.name, t.val = s.val\n  DELETE WHERE t.val > 240\nWHEN NOT MATCHED THEN\n  INSERT VALUES (s.id, s.name, s.val);',
    opciones: [
      { id: 'a', texto: 'Las filas con ID 1 y 3.' },
      { id: 'b', texto: 'Las filas con ID 1, 2 (B2, 250) y 3.' },
      { id: 'c', texto: 'Las filas con ID 1, 2 (B, 200) y 3.' },
      { id: 'd', texto: 'Solo la fila con ID 1.' }
    ],
    correctas: ['a'],
    explicacion: 'La fila 2 coincide y se actualiza a (B2, 250). La cláusula DELETE WHERE se evalúa sobre los valores ya actualizados: 250 > 240, así que se borra. La fila 3 no coincide y se inserta. La fila 1 no está en SOURCE y no se toca.',
    porQueNo: {
      b: 'DELETE WHERE elimina la fila actualizada porque su nuevo VAL (250) cumple la condición.',
      c: 'La condición se evalúa después de la actualización, no sobre el valor original.',
      d: 'DELETE WHERE solo afecta a las filas que coincidieron, y la fila 3 se inserta porque no coincide.'
    }
  },
  {
    id: 'X055', examen: 'exam071', tema: 'DML',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar el MERGE?',
    codigo: 'MERGE INTO target t\nUSING source s\nON (t.id = s.id)\nWHEN MATCHED THEN\n  UPDATE SET t.id = s.id, t.val = s.val;',
    opciones: [
      { id: 'a', texto: 'Error ORA-38104: Columns referenced in the ON Clause cannot be updated.' },
      { id: 'b', texto: 'Se ejecuta correctamente, porque t.id ya es igual a s.id.' },
      { id: 'c', texto: 'Error, porque falta la cláusula WHEN NOT MATCHED.' },
      { id: 'd', texto: 'Actualiza solo VAL e ignora la asignación a ID.' }
    ],
    correctas: ['a'],
    explicacion: 'En MERGE no se pueden actualizar las columnas usadas en la condición ON. Las cláusulas WHEN MATCHED y WHEN NOT MATCHED son opcionales: basta con una.',
    porQueNo: {
      b: 'Oracle rechaza la sentencia al analizarla, sin importar los valores.',
      c: 'Desde Oracle 10g ambas cláusulas son opcionales.',
      d: 'Oracle no ignora asignaciones: la sentencia falla.'
    }
  },
  {
    id: 'X056', examen: 'exam071', tema: 'DML',
    tipo: 'unica',
    enunciado: 'La tabla PAY tiene cuatro filas con SAL = 15000, 12000, 8000 y 3000. Las tablas BIG, MID y SMALL están vacías. ¿Cuántas filas se insertan en total?',
    codigo: 'INSERT ALL\n  WHEN sal > 10000 THEN INTO big   VALUES (sal)\n  WHEN sal > 5000  THEN INTO mid   VALUES (sal)\n  ELSE                  INTO small VALUES (sal)\nSELECT sal FROM pay;',
    opciones: [
      { id: 'a', texto: '6' },
      { id: 'b', texto: '4' },
      { id: 'c', texto: '5' },
      { id: 'd', texto: '7' }
    ],
    correctas: ['a'],
    explicacion: 'Con INSERT ALL se evalúan todas las cláusulas WHEN para cada fila. 15000 y 12000 van a BIG y a MID (4 filas); 8000 va a MID (1); 3000 no cumple ningún WHEN y va a SMALL por ELSE (1). Total: 6.',
    porQueNo: {
      b: 'Ese sería el resultado con INSERT FIRST, que se detiene en el primer WHEN verdadero.',
      c: 'Las filas de 15000 y 12000 cumplen ambas condiciones y se insertan dos veces cada una.',
      d: 'ELSE solo se aplica cuando ningún WHEN se cumple, así que las filas mayores de 5000 no van a SMALL.'
    }
  },
  {
    id: 'X057', examen: 'exam071', tema: 'DML',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre TRUNCATE TABLE son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Es una sentencia DDL y no se puede deshacer con ROLLBACK.' },
      { id: 'b', texto: 'Falla con ORA-02266 si otra tabla tiene filas que la referencian mediante una clave foránea habilitada.' },
      { id: 'c', texto: 'Ejecuta los triggers DELETE definidos sobre la tabla.' },
      { id: 'd', texto: 'Admite una cláusula WHERE para eliminar solo algunas filas.' },
      { id: 'e', texto: 'Elimina la definición de la tabla del diccionario de datos.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'TRUNCATE es DDL (hace commit implícito) y no genera undo para las filas, así que no puede deshacerse. Si una FK habilitada de otra tabla la referencia y existen filas hijas, falla con ORA-02266: unique/primary keys in table referenced by enabled foreign keys. Para truncarla hay que deshabilitar la FK (o vaciar la tabla hija).',
    porQueNo: {
      c: 'TRUNCATE no dispara los triggers DELETE.',
      d: 'TRUNCATE elimina todas las filas; para filtrar se usa DELETE ... WHERE.',
      e: 'La estructura de la tabla se conserva; eso lo hace DROP TABLE.'
    }
  },
  {
    id: 'X058', examen: 'exam071', tema: 'FETCH FIRST y OFFSET',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas devuelve la consulta?',
    exhibit: [{ titulo: 'PLAYERS', columnas: ['NAME', 'SCORE'], filas: [['Ana', '95'], ['Beto', '90'], ['Carla', '90'], ['Dario', '85'], ['Eva', '80']] }],
    codigo: 'SELECT name, score\nFROM   players\nORDER BY score DESC\nFETCH FIRST 2 ROWS WITH TIES;',
    opciones: [
      { id: 'a', texto: '3' },
      { id: 'b', texto: '2' },
      { id: 'c', texto: '4' },
      { id: 'd', texto: 'Error: WITH TIES requiere PERCENT.' }
    ],
    correctas: ['a'],
    explicacion: 'Las dos primeras filas son Ana (95) y una de las que tienen 90. WITH TIES añade las filas que empatan con la última devuelta según el ORDER BY, así que se incluyen Beto y Carla.',
    porQueNo: {
      b: 'Ese sería el resultado con ROWS ONLY.',
      c: 'Dario (85) no empata con la última fila (90).',
      d: 'WITH TIES funciona con un número de filas o con PERCENT.'
    }
  },
  {
    id: 'X059', examen: 'exam071', tema: 'FETCH FIRST y OFFSET',
    tipo: 'unica',
    enunciado: 'La tabla PLAYERS tiene 10 filas con SCORE distintos. ¿Qué filas devuelve la consulta?',
    codigo: 'SELECT name, score\nFROM   players\nORDER BY score DESC\nOFFSET 3 ROWS FETCH NEXT 20 PERCENT ROWS ONLY;',
    opciones: [
      { id: 'a', texto: 'Las filas 4 y 5 del orden.' },
      { id: 'b', texto: 'Las filas 4, 5 y 6 del orden.' },
      { id: 'c', texto: 'Las filas 1 y 2 del orden.' },
      { id: 'd', texto: 'Error: OFFSET no puede combinarse con PERCENT.' }
    ],
    correctas: ['a'],
    explicacion: 'El porcentaje se calcula sobre el total de filas del resultado (20% de 10 = 2). OFFSET 3 salta las tres primeras, así que se devuelven la cuarta y la quinta.',
    porQueNo: {
      b: 'Se devuelven 2 filas (20% de 10), no 3.',
      c: 'OFFSET 3 omite las tres primeras filas.',
      d: 'OFFSET y FETCH ... PERCENT pueden usarse juntos.'
    }
  },
  {
    id: 'X060', examen: 'exam071', tema: 'FETCH FIRST y OFFSET',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre la cláusula de limitación de filas son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Las palabras ROW y ROWS son intercambiables, igual que FIRST y NEXT.' },
      { id: 'b', texto: 'Si OFFSET es negativo, se trata como 0.' },
      { id: 'c', texto: 'Un OFFSET negativo cuenta las filas desde el final del resultado.' },
      { id: 'd', texto: 'La cláusula FETCH debe escribirse antes de ORDER BY.' },
      { id: 'e', texto: 'PERCENT y WITH TIES no pueden usarse en la misma cláusula.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'ROW/ROWS y FIRST/NEXT existen solo por legibilidad. Un OFFSET negativo se trata como 0 y no produce error.',
    porQueNo: {
      c: 'Oracle no cuenta desde el final; un OFFSET negativo equivale a 0.',
      d: 'OFFSET/FETCH van después de ORDER BY, al final de la consulta.',
      e: 'Se permite FETCH FIRST n PERCENT ROWS WITH TIES.'
    }
  },
  {
    id: 'X061', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'unica',
    enunciado: 'La tabla T está vacía y no hay transacciones pendientes. ¿Cuántas filas tiene T al final?',
    codigo: 'INSERT INTO t VALUES (1);\nSAVEPOINT a;\nINSERT INTO t VALUES (2);\nSAVEPOINT b;\nINSERT INTO t VALUES (3);\nROLLBACK TO SAVEPOINT a;\nROLLBACK TO SAVEPOINT b;\nCOMMIT;',
    opciones: [
      { id: 'a', texto: '1' },
      { id: 'b', texto: '2' },
      { id: 'c', texto: '0' },
      { id: 'd', texto: '3' }
    ],
    correctas: ['a'],
    explicacion: 'ROLLBACK TO a deshace los inserts 2 y 3 y borra el savepoint b, que se estableció después de a. El ROLLBACK TO b falla con ORA-01086: savepoint \'B\' never established, sin afectar a la transacción. COMMIT confirma la fila 1.',
    porQueNo: {
      b: 'El savepoint b ya no existe, así que no se puede "volver" a él para recuperar la fila 2.',
      c: 'Un error en ROLLBACK TO no deshace la transacción completa; la fila 1 se confirma.',
      d: 'ROLLBACK TO a deshace todo lo hecho después de a.'
    }
  },
  {
    id: 'X062', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'multiple',
    enunciado: '¿Qué dos acciones terminan la transacción actual? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Ejecutar CREATE INDEX.' },
      { id: 'b', texto: 'Salir de SQL*Plus normalmente con EXIT.' },
      { id: 'c', texto: 'Crear un SAVEPOINT.' },
      { id: 'd', texto: 'Ejecutar SELECT ... FOR UPDATE.' },
      { id: 'e', texto: 'Un INSERT que falla por violar una restricción.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Las sentencias DDL (como CREATE INDEX) hacen COMMIT implícito. Por defecto, EXIT en SQL*Plus también confirma la transacción (EXITCOMMIT ON).',
    porQueNo: {
      c: 'Un SAVEPOINT solo marca un punto dentro de la transacción.',
      d: 'SELECT ... FOR UPDATE bloquea filas y forma parte de la transacción; no la termina.',
      e: 'Un error en una sentencia DML solo deshace esa sentencia (rollback a nivel de sentencia); la transacción continúa.'
    }
  },
  {
    id: 'X063', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'unica',
    enunciado: 'La sesión 1 ejecuta `UPDATE employees SET salary = 0 WHERE employee_id = 100;` sin COMMIT. La sesión 2 consulta luego el salario del empleado 100. ¿Qué ve la sesión 2?',
    opciones: [
      { id: 'a', texto: 'El salario anterior, porque los cambios no confirmados no son visibles para otras sesiones.' },
      { id: 'b', texto: 'El valor 0.' },
      { id: 'c', texto: 'La consulta espera hasta que la sesión 1 haga COMMIT o ROLLBACK.' },
      { id: 'd', texto: 'NULL, porque la fila está bloqueada.' }
    ],
    correctas: ['a'],
    explicacion: 'Oracle garantiza la consistencia de lectura: las consultas ven los datos confirmados al inicio de la sentencia (usando undo). Los lectores no esperan a los escritores.',
    porQueNo: {
      b: 'Solo la sesión 1 ve sus cambios no confirmados.',
      c: 'Un SELECT normal no se bloquea; solo esperaría otro UPDATE o un SELECT ... FOR UPDATE sobre la misma fila.',
      d: 'Un bloqueo de fila no altera los valores que ven los demás.'
    }
  },
  {
    id: 'X064', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'multiple',
    enunciado: 'HIRE_DATE es de tipo DATE. ¿Qué dos expresiones son válidas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'hire_date + 30' },
      { id: 'b', texto: 'SYSDATE - hire_date' },
      { id: 'c', texto: 'SYSDATE + hire_date' },
      { id: 'd', texto: 'hire_date * 2' },
      { id: 'e', texto: 'MONTHS_BETWEEN(hire_date)' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'A una fecha se le pueden sumar o restar días (números), y la resta de dos fechas devuelve el número de días entre ellas.',
    porQueNo: {
      c: 'No se pueden sumar dos fechas: ORA-00975: date + date not allowed.',
      d: 'No se puede multiplicar una fecha: ORA-00932: inconsistent datatypes.',
      e: 'MONTHS_BETWEEN requiere dos fechas: ORA-00909: invalid number of arguments.'
    }
  },
  {
    id: 'X065', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT TO_CHAR(DATE '2024-03-15' + 1/24 * 30, 'DD-MON-YYYY HH24:MI') AS r\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '16-MAR-2024 06:00' },
      { id: 'b', texto: '15-MAR-2024 06:00' },
      { id: 'c', texto: '14-APR-2024 00:00' },
      { id: 'd', texto: '15-MAR-2024 00:30' }
    ],
    correctas: ['a'],
    explicacion: '1/24 de día es una hora; 1/24 * 30 son 30 horas (un día y 6 horas). Sumado a la medianoche del 15 de marzo da el 16 de marzo a las 06:00.',
    porQueNo: {
      b: '30 horas superan un día completo, así que la fecha cambia al 16.',
      c: 'Sería el resultado de sumar 30 días, no 30/24.',
      d: 'No se suman 30 minutos: 1/24 representa una hora.'
    }
  },
  {
    id: 'X066', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT ROUND(MONTHS_BETWEEN(DATE '2024-01-01', DATE '2024-07-01')) AS m\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '-6' },
      { id: 'b', texto: '6' },
      { id: 'c', texto: '-182' },
      { id: 'd', texto: '0' }
    ],
    correctas: ['a'],
    explicacion: 'MONTHS_BETWEEN(fecha1, fecha2) devuelve un valor negativo cuando fecha1 es anterior a fecha2. Entre el 1 de enero y el 1 de julio hay exactamente 6 meses.',
    porQueNo: {
      b: 'El orden de los argumentos importa: la primera fecha es anterior, así que el resultado es negativo.',
      c: 'Esa sería la diferencia en días (restando las fechas), no en meses.',
      d: 'Las fechas difieren 6 meses.'
    }
  },
{
    id: 'X067', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'multiple',
    enunciado: 'Se ejecuta la sentencia. ¿Qué dos afirmaciones sobre la tabla EMP_COPY son verdaderas? (Elige dos)',
    exhibit: [T_EMP],
    codigo: 'CREATE TABLE emp_copy AS\n  SELECT employee_id, last_name, email\n  FROM   employees\n  WHERE  department_id = 60;',
    opciones: [
      { id: 'a', texto: 'Las columnas LAST_NAME y EMAIL conservan sus restricciones NOT NULL.' },
      { id: 'b', texto: 'La tabla se crea con las filas de los empleados del departamento 60.' },
      { id: 'c', texto: 'EMPLOYEE_ID queda definida como clave primaria.' },
      { id: 'd', texto: 'EMPLOYEE_ID no admite NULL, porque en EMPLOYEES es clave primaria.' },
      { id: 'e', texto: 'EMAIL conserva su restricción UNIQUE.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'CREATE TABLE ... AS SELECT copia la estructura de las columnas, los datos y solo las restricciones NOT NULL explícitas. No copia PRIMARY KEY, UNIQUE, FOREIGN KEY ni CHECK, ni valores DEFAULT.',
    porQueNo: {
      c: 'Las claves primarias no se copian con CTAS.',
      d: 'La obligatoriedad que impone la PK no se copia como NOT NULL: EMPLOYEE_ID queda como columna que admite NULL.',
      e: 'Las restricciones UNIQUE no se copian.'
    }
  },
  {
    id: 'X068', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'unica',
    enunciado: 'Se ejecuta `ALTER TABLE emp_copy SET UNUSED (email);`. ¿Qué afirmación es verdadera?',
    opciones: [
      { id: 'a', texto: 'La columna ya no puede consultarse y se puede añadir otra columna llamada EMAIL a la tabla.' },
      { id: 'b', texto: 'La columna puede recuperarse con ALTER TABLE emp_copy SET USED (email).' },
      { id: 'c', texto: 'El espacio de la columna se libera inmediatamente.' },
      { id: 'd', texto: 'La columna sigue apareciendo en DESCRIBE, marcada como UNUSED.' }
    ],
    correctas: ['a'],
    explicacion: 'SET UNUSED marca la columna como no utilizada: desaparece de la definición visible y su nombre queda libre, pero el espacio no se recupera hasta ALTER TABLE ... DROP UNUSED COLUMNS. No hay forma de volver atrás.',
    porQueNo: {
      b: 'No existe SET USED; una columna marcada como unused no se puede recuperar.',
      c: 'El espacio se libera al ejecutar DROP UNUSED COLUMNS.',
      d: 'La columna deja de aparecer en DESCRIBE y en SELECT *.'
    }
  },
  {
    id: 'X069', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'multiple',
    enunciado: 'La tabla PRODUCTS tiene filas y su columna NAME es VARCHAR2(30), con algunos valores de 20 caracteres. ¿Qué dos sentencias se ejecutan correctamente? (Elige dos)',
    exhibit: [{ titulo: 'PRODUCTS', estructura: [['PROD_ID', 'NUMBER(6)', 'PRIMARY KEY'], ['NAME', 'VARCHAR2(30)', ''], ['PRICE', 'NUMBER(8,2)', '']] }],
    opciones: [
      { id: 'a', texto: 'ALTER TABLE products MODIFY (name VARCHAR2(50));' },
      { id: 'b', texto: "ALTER TABLE products ADD (status VARCHAR2(10) DEFAULT 'ACTIVE' NOT NULL);" },
      { id: 'c', texto: 'ALTER TABLE products ADD (category VARCHAR2(10) NOT NULL);' },
      { id: 'd', texto: 'ALTER TABLE products MODIFY (price VARCHAR2(10));' },
      { id: 'e', texto: 'ALTER TABLE products MODIFY (name VARCHAR2(10));' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Siempre se puede aumentar la longitud de una columna. Se puede añadir una columna NOT NULL a una tabla con filas si tiene DEFAULT, porque las filas existentes reciben ese valor.',
    porQueNo: {
      c: 'Sin DEFAULT, las filas existentes quedarían con NULL: ORA-01758: table must be empty to add mandatory (NOT NULL) column.',
      d: 'Para cambiar el tipo de dato de NUMBER a VARCHAR2 la columna debe estar vacía: ORA-01439.',
      e: 'Hay valores de 20 caracteres: ORA-01441: cannot decrease column length because some value is too big.'
    }
  },
  {
    id: 'X070', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'unica',
    enunciado: 'La papelera de reciclaje (recyclebin) está habilitada. ¿Qué devuelve la última sentencia?',
    codigo: 'CREATE TABLE t_hist (c NUMBER);\nINSERT INTO t_hist VALUES (1);\nCOMMIT;\nDROP TABLE t_hist;\nFLASHBACK TABLE t_hist TO BEFORE DROP;\nSELECT COUNT(*) FROM t_hist;',
    opciones: [
      { id: 'a', texto: '1' },
      { id: 'b', texto: '0' },
      { id: 'c', texto: 'Error ORA-00942: table or view does not exist' },
      { id: 'd', texto: 'Error: FLASHBACK TABLE requiere haber usado DROP TABLE ... PURGE' }
    ],
    correctas: ['a'],
    explicacion: 'Con la papelera habilitada, DROP TABLE mueve la tabla (con sus datos, índices y restricciones) a la papelera. FLASHBACK TABLE ... TO BEFORE DROP la restaura con sus filas.',
    porQueNo: {
      b: 'La tabla se restaura con los datos que tenía al eliminarse.',
      c: 'FLASHBACK TABLE restauró la tabla, así que existe.',
      d: 'Es al revés: con PURGE la tabla se elimina definitivamente y no se puede recuperar.'
    }
  },
  {
    id: 'X071', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'multiple',
    enunciado: 'Se ejecuta `ALTER TABLE orders READ ONLY;`. ¿Qué dos sentencias se ejecutarán después sin error? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'SELECT * FROM orders;' },
      { id: 'b', texto: 'DROP TABLE orders;' },
      { id: 'c', texto: 'DELETE FROM orders;' },
      { id: 'd', texto: 'TRUNCATE TABLE orders;' },
      { id: 'e', texto: 'UPDATE orders SET status = NULL;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Una tabla de solo lectura admite consultas y operaciones que no modifican sus datos, incluido DROP TABLE (que solo actúa sobre el diccionario). Bloquea DML y TRUNCATE con ORA-12081.',
    porQueNo: {
      c: 'DELETE es DML: ORA-12081: update operation not allowed on table.',
      d: 'TRUNCATE elimina los datos y también se bloquea (ORA-12081).',
      e: 'UPDATE es DML y se rechaza con ORA-12081.'
    }
  },
  {
    id: 'X072', examen: 'exam071', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'La tabla ITEMS se creó así. ¿Cuántas filas quedan insertadas después de ejecutar los tres INSERT (cada uno se ejecuta aunque el anterior falle)?',
    codigo: 'CREATE TABLE items (\n  id  NUMBER PRIMARY KEY,\n  qty NUMBER CONSTRAINT items_qty_ck CHECK (qty > 0)\n);\nINSERT INTO items VALUES (1, 10);\nINSERT INTO items VALUES (2, NULL);\nINSERT INTO items VALUES (3, 0);',
    opciones: [
      { id: 'a', texto: '2' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: '3' },
      { id: 'd', texto: '0' }
    ],
    correctas: ['a'],
    explicacion: 'Una restricción CHECK solo rechaza la fila cuando la condición es FALSE. Con qty NULL, "NULL > 0" es UNKNOWN y la fila se acepta. Con qty 0 la condición es FALSE: ORA-02290: check constraint violated.',
    porQueNo: {
      b: 'La fila con NULL sí se inserta: CHECK no rechaza las condiciones UNKNOWN.',
      c: 'La fila con 0 viola la restricción.',
      d: 'La primera fila cumple la restricción sin problemas.'
    }
  },
  {
    id: 'X073', examen: 'exam071', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'Examina las definiciones. El departamento 10 tiene empleados en EMP_T. ¿Qué ocurre al ejecutar `DELETE FROM dept_t WHERE dept_id = 10;`?',
    codigo: 'CREATE TABLE dept_t (dept_id NUMBER PRIMARY KEY);\nCREATE TABLE emp_t (\n  emp_id  NUMBER PRIMARY KEY,\n  dept_id NUMBER NOT NULL\n          REFERENCES dept_t (dept_id) ON DELETE SET NULL\n);',
    opciones: [
      { id: 'a', texto: 'Falla, porque no se puede poner NULL en EMP_T.DEPT_ID.' },
      { id: 'b', texto: 'Borra el departamento y pone NULL en DEPT_ID de sus empleados.' },
      { id: 'c', texto: 'Borra el departamento y también a sus empleados.' },
      { id: 'd', texto: 'La tabla EMP_T no se pudo crear, porque ON DELETE SET NULL es incompatible con NOT NULL.' }
    ],
    correctas: ['a'],
    explicacion: 'ON DELETE SET NULL intenta actualizar la FK a NULL, pero la columna es NOT NULL. Oracle crea la tabla sin problema, pero el DELETE falla con ORA-01407: cannot update to NULL, y no se borra nada.',
    porQueNo: {
      b: 'Sería el comportamiento si DEPT_ID admitiera NULL.',
      c: 'Eso hace ON DELETE CASCADE, no SET NULL.',
      d: 'Oracle no valida esa combinación al crear la tabla; el error aparece al borrar.'
    }
  },
  {
    id: 'X074', examen: 'exam071', tema: 'Restricciones',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las claves foráneas en Oracle son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Sin cláusula ON DELETE, borrar una fila padre que tiene filas hijas falla con ORA-02292.' },
      { id: 'b', texto: 'Con ON DELETE CASCADE, al borrar una fila padre se borran sus filas hijas.' },
      { id: 'c', texto: 'Se puede definir ON DELETE SET DEFAULT.' },
      { id: 'd', texto: 'Se puede definir ON UPDATE CASCADE.' },
      { id: 'e', texto: 'Con ON DELETE CASCADE, al ejecutar DROP TABLE sobre la tabla padre se elimina también la tabla hija.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Oracle solo admite ON DELETE CASCADE y ON DELETE SET NULL. Sin ellas, se impide borrar padres con hijos (ORA-02292: integrity constraint violated - child record found).',
    porQueNo: {
      c: 'Oracle no soporta ON DELETE SET DEFAULT.',
      d: 'Oracle no soporta ON UPDATE CASCADE.',
      e: 'ON DELETE CASCADE actúa sobre filas en un DELETE; para eliminar una tabla padre referenciada se necesita DROP TABLE ... CASCADE CONSTRAINTS, que borra la FK, no la tabla hija.'
    }
  },
  {
    id: 'X075', examen: 'exam071', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'La tabla T_DEF está vacía. ¿Cuántas filas tiene después de ejecutar las sentencias?',
    codigo: 'CREATE TABLE t_def (\n  id NUMBER CONSTRAINT t_def_pk PRIMARY KEY\n          DEFERRABLE INITIALLY DEFERRED\n);\nINSERT INTO t_def VALUES (1);\nINSERT INTO t_def VALUES (1);\nINSERT INTO t_def VALUES (2);\nCOMMIT;',
    opciones: [
      { id: 'a', texto: '0' },
      { id: 'b', texto: '2' },
      { id: 'c', texto: '3' },
      { id: 'd', texto: '1' }
    ],
    correctas: ['a'],
    explicacion: 'Con INITIALLY DEFERRED la restricción se valida al hacer COMMIT, no en cada INSERT. Al confirmar, el duplicado viola la PK: el COMMIT falla con ORA-02091: transaction rolled back (ORA-00001) y se deshace toda la transacción.',
    porQueNo: {
      b: 'Oracle no descarta solo la fila duplicada; deshace toda la transacción.',
      c: 'La PK se valida en el COMMIT, y el duplicado hace fallar la confirmación.',
      d: 'No se conserva ninguna fila de la transacción fallida.'
    }
  },
  {
    id: 'X076', examen: 'exam071', tema: 'Restricciones',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las restricciones diferibles son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Por defecto, una restricción es NOT DEFERRABLE INITIALLY IMMEDIATE.' },
      { id: 'b', texto: 'Una restricción DEFERRABLE INITIALLY IMMEDIATE puede validarse al final de la transacción después de ejecutar SET CONSTRAINT ... DEFERRED.' },
      { id: 'c', texto: 'Una restricción NOT DEFERRABLE puede convertirse en DEFERRABLE con ALTER TABLE ... MODIFY CONSTRAINT.' },
      { id: 'd', texto: 'Las restricciones diferidas se validan al terminar cada sentencia DML.' },
      { id: 'e', texto: 'Una PRIMARY KEY DEFERRABLE crea un índice único.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Las restricciones son NOT DEFERRABLE por defecto. Si son DEFERRABLE, SET CONSTRAINT(S) ... DEFERRED retrasa su validación hasta el COMMIT.',
    porQueNo: {
      c: 'La diferibilidad no se puede cambiar: hay que eliminar la restricción y crearla de nuevo.',
      d: 'Las restricciones inmediatas se validan al final de cada sentencia; las diferidas, en el COMMIT.',
      e: 'Una PK o UNIQUE diferible usa un índice no único, porque durante la transacción puede haber duplicados temporales.'
    }
  },
  {
    id: 'X077', examen: 'exam071', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'La columna EMPLOYEES.DEPARTMENT_ID tiene una clave foránea habilitada que referencia la PK de DEPARTMENTS. ¿Qué ocurre al ejecutar `ALTER TABLE departments DISABLE PRIMARY KEY;`?',
    exhibit: [T_EMP, T_DEPT],
    opciones: [
      { id: 'a', texto: 'Falla con ORA-02297: cannot disable constraint - dependencies exist; habría que añadir CASCADE.' },
      { id: 'b', texto: 'Deshabilita la PK y deja la FK habilitada.' },
      { id: 'c', texto: 'Deshabilita la PK y también la FK automáticamente.' },
      { id: 'd', texto: 'Elimina la PK y su índice.' }
    ],
    correctas: ['a'],
    explicacion: 'No se puede deshabilitar una PK o UNIQUE de la que dependen FK habilitadas. Con DISABLE PRIMARY KEY CASCADE se deshabilitan también las FK dependientes.',
    porQueNo: {
      b: 'Una FK habilitada no puede apoyarse en una PK deshabilitada.',
      c: 'Las FK dependientes solo se deshabilitan si se escribe CASCADE.',
      d: 'DISABLE no elimina la restricción; además, la sentencia falla.'
    }
  },
  {
    id: 'X078', examen: 'exam071', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'Se quiere hacer obligatoria la columna PHONE (que ya existe y no tiene NULL) de la tabla CONTACTS. ¿Qué sentencia lo consigue?',
    opciones: [
      { id: 'a', texto: 'ALTER TABLE contacts MODIFY (phone CONSTRAINT contacts_phone_nn NOT NULL);' },
      { id: 'b', texto: 'ALTER TABLE contacts ADD CONSTRAINT contacts_phone_nn NOT NULL (phone);' },
      { id: 'c', texto: 'ALTER TABLE contacts ADD (phone NOT NULL);' },
      { id: 'd', texto: 'ALTER TABLE contacts ENABLE NOT NULL (phone);' }
    ],
    correctas: ['a'],
    explicacion: 'NOT NULL es una restricción de nivel de columna, así que para agregarla a una columna existente se usa ALTER TABLE ... MODIFY.',
    porQueNo: {
      b: 'NOT NULL no puede definirse con la sintaxis de restricción de tabla (ADD CONSTRAINT ... NOT NULL (col)).',
      c: 'ADD intenta crear una nueva columna PHONE, que ya existe (y además le falta el tipo).',
      d: 'No existe esa sintaxis.'
    }
  },
  {
    id: 'X079', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar el UPDATE?',
    codigo: 'CREATE VIEW v_ship AS\n  SELECT employee_id, last_name, department_id\n  FROM   employees\n  WHERE  department_id = 50\n  WITH CHECK OPTION;\n\nUPDATE v_ship\nSET    department_id = 60\nWHERE  employee_id = 141;',
    opciones: [
      { id: 'a', texto: 'Falla con ORA-01402: view WITH CHECK OPTION where-clause violation.' },
      { id: 'b', texto: 'Actualiza la fila, que desaparece de la vista.' },
      { id: 'c', texto: 'Falla porque las vistas no permiten UPDATE.' },
      { id: 'd', texto: 'No actualiza ninguna fila, sin error.' }
    ],
    correctas: ['a'],
    explicacion: 'WITH CHECK OPTION impide que mediante la vista se inserten o modifiquen filas que luego no serían visibles a través de ella. Cambiar el departamento a 60 haría salir la fila de la vista.',
    porQueNo: {
      b: 'Ese sería el comportamiento sin WITH CHECK OPTION.',
      c: 'Una vista simple sobre una tabla es actualizable.',
      d: 'El empleado 141 está en el departamento 50 y es visible en la vista, así que el UPDATE lo intenta y falla.'
    }
  },
  {
    id: 'X080', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'unica',
    enunciado: 'La tabla NEW_ORDERS aún no existe. ¿Qué ocurre al ejecutar la sentencia?',
    codigo: 'CREATE OR REPLACE FORCE VIEW v_orders AS\n  SELECT order_id, total FROM new_orders;',
    opciones: [
      { id: 'a', texto: 'La vista se crea con errores de compilación (estado INVALID).' },
      { id: 'b', texto: 'Falla con ORA-00942: table or view does not exist.' },
      { id: 'c', texto: 'Se crea la vista y también la tabla NEW_ORDERS vacía.' },
      { id: 'd', texto: 'Se crea la vista en estado VALID y devuelve cero filas.' }
    ],
    correctas: ['a'],
    explicacion: 'FORCE crea la vista aunque las tablas base no existan. Queda INVALID y se recompilará cuando se use, si para entonces la tabla existe.',
    porQueNo: {
      b: 'Ese sería el resultado sin FORCE (NOFORCE es el valor por defecto).',
      c: 'Crear una vista nunca crea tablas.',
      d: 'Sin la tabla base la vista no puede validarse.'
    }
  },
  {
    id: 'X081', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las operaciones DML a través de vistas son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Un INSERT a través de una vista falla si la vista omite una columna NOT NULL sin DEFAULT de la tabla base.' },
      { id: 'b', texto: 'Una vista creada WITH READ ONLY no admite INSERT, UPDATE ni DELETE.' },
      { id: 'c', texto: 'Una vista que usa DISTINCT admite UPDATE si no tiene GROUP BY.' },
      { id: 'd', texto: 'En una vista, una columna definida como salary * 12 puede actualizarse con UPDATE.' },
      { id: 'e', texto: 'DROP VIEW elimina las filas de la tabla base que mostraba la vista.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'El INSERT a través de la vista pone NULL en las columnas omitidas, lo que viola NOT NULL (ORA-01400). WITH READ ONLY prohíbe cualquier DML (ORA-42399).',
    porQueNo: {
      c: 'DISTINCT impide todas las operaciones DML a través de la vista.',
      d: 'Una columna calculada no puede modificarse: ORA-01733: virtual column not allowed here.',
      e: 'DROP VIEW solo elimina la definición de la vista; los datos están en la tabla base.'
    }
  },
  {
    id: 'X082', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'unica',
    enunciado: '¿Qué afirmación sobre las vistas es verdadera?',
    opciones: [
      { id: 'a', texto: 'Una vista puede incluir ORDER BY en su consulta de definición.' },
      { id: 'b', texto: 'Una vista almacena una copia de los datos de la tabla base.' },
      { id: 'c', texto: 'Al eliminar la tabla base, la vista se elimina automáticamente.' },
      { id: 'd', texto: 'Una vista no puede basarse en otra vista.' }
    ],
    correctas: ['a'],
    explicacion: 'Oracle permite ORDER BY en la definición de una vista. Una vista solo almacena su consulta (es una tabla "lógica").',
    porQueNo: {
      b: 'Una vista no guarda datos; las vistas materializadas sí, pero son otro tipo de objeto.',
      c: 'La vista sigue existiendo, en estado INVALID, y fallará al consultarse.',
      d: 'Las vistas pueden basarse en tablas, en otras vistas o en ambas.'
    }
  },
  {
    id: 'X083', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: 'La secuencia S1 se acaba de crear con START WITH 1 INCREMENT BY 1. ¿Qué fila se inserta?',
    codigo: 'INSERT INTO t (c1, c2)\nVALUES (s1.NEXTVAL, s1.NEXTVAL);',
    opciones: [
      { id: 'a', texto: 'c1 = 1, c2 = 1' },
      { id: 'b', texto: 'c1 = 1, c2 = 2' },
      { id: 'c', texto: 'Error: NEXTVAL solo puede usarse una vez por sentencia.' },
      { id: 'd', texto: 'c1 = 2, c2 = 2' }
    ],
    correctas: ['a'],
    explicacion: 'Dentro de una misma sentencia SQL, todas las referencias a NEXTVAL de una secuencia devuelven el mismo valor: la secuencia avanza una vez por fila.',
    porQueNo: {
      b: 'La secuencia se incrementa una sola vez por fila procesada, no por cada referencia.',
      c: 'NEXTVAL puede aparecer varias veces en la sentencia.',
      d: 'El primer valor generado es el de START WITH, 1.'
    }
  },
  {
    id: 'X084', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: 'La secuencia S2 se acaba de crear con START WITH 1 INCREMENT BY 1 NOCACHE. ¿Qué valor tiene C1 en la fila que queda en T?',
    codigo: 'INSERT INTO t (c1) VALUES (s2.NEXTVAL);\nROLLBACK;\nINSERT INTO t (c1) VALUES (s2.NEXTVAL);\nCOMMIT;',
    opciones: [
      { id: 'a', texto: '2' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: '0' },
      { id: 'd', texto: 'Error: la secuencia queda inválida tras el ROLLBACK.' }
    ],
    correctas: ['a'],
    explicacion: 'Los valores de una secuencia no son transaccionales: el ROLLBACK deshace el INSERT, pero el valor 1 ya se consumió. Por eso las secuencias pueden tener huecos.',
    porQueNo: {
      b: 'ROLLBACK no devuelve el valor a la secuencia.',
      c: 'La secuencia empieza en 1 y solo avanza.',
      d: 'El ROLLBACK no afecta en nada a la secuencia.'
    }
  },
  {
    id: 'X085', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la sentencia?',
    codigo: 'CREATE SEQUENCE s_small\n  START WITH 1\n  MAXVALUE 3\n  CYCLE;',
    opciones: [
      { id: 'a', texto: 'Falla con ORA-04013: number to CACHE must be less than one cycle.' },
      { id: 'b', texto: 'Se crea; genera 1, 2, 3, 1, 2, 3...' },
      { id: 'c', texto: 'Se crea; genera 1, 2, 3 y después da error.' },
      { id: 'd', texto: 'Falla porque CYCLE requiere MINVALUE.' }
    ],
    correctas: ['a'],
    explicacion: 'Por defecto una secuencia usa CACHE 20, y con CYCLE el caché no puede ser mayor que el número de valores de un ciclo (3). Hay que añadir NOCACHE o CACHE 2.',
    porQueNo: {
      b: 'Sería el comportamiento con NOCACHE (o CACHE 2); con el caché por defecto la sentencia falla.',
      c: 'Eso ocurriría con NOCYCLE, que no es el caso; además, la secuencia ni siquiera se crea.',
      d: 'MINVALUE tiene valor por defecto (1 en secuencias ascendentes).'
    }
  },
  {
    id: 'X086', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'multiple',
    enunciado: '¿En qué tres contextos NO se puede usar seq.NEXTVAL? (Elige tres)',
    opciones: [
      { id: 'a', texto: 'En un SELECT que usa DISTINCT.' },
      { id: 'b', texto: 'En la cláusula WHERE de un SELECT.' },
      { id: 'c', texto: 'En la cláusula ORDER BY.' },
      { id: 'd', texto: 'En la cláusula VALUES de un INSERT.' },
      { id: 'e', texto: 'En la cláusula SET de un UPDATE.' },
      { id: 'f', texto: 'Como valor DEFAULT de una columna (Oracle 12c o superior).' }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: 'NEXTVAL y CURRVAL no se permiten en consultas con DISTINCT, GROUP BY u ORDER BY, en WHERE, en subconsultas de vistas ni en restricciones CHECK (ORA-02287: sequence number not allowed here).',
    porQueNo: {
      d: 'VALUES de un INSERT es el uso más común de NEXTVAL.',
      e: 'Se puede asignar seq.NEXTVAL en la cláusula SET de un UPDATE.',
      f: 'Desde 12c una columna puede tener DEFAULT seq.NEXTVAL.'
    }
  },
  {
    id: 'X087', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la última sentencia?',
    codigo: 'CREATE TABLE prices (c NUMBER);\nCREATE SYNONYM pr FOR prices;\nDROP TABLE prices;\nSELECT * FROM pr;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00980: synonym translation is no longer valid.' },
      { id: 'b', texto: 'Devuelve cero filas.' },
      { id: 'c', texto: 'El DROP TABLE falla porque existe un sinónimo que la referencia.' },
      { id: 'd', texto: 'El sinónimo se eliminó junto con la tabla, así que da ORA-00942.' }
    ],
    correctas: ['a'],
    explicacion: 'Eliminar el objeto no elimina sus sinónimos: el sinónimo sigue existiendo pero apunta a un objeto inexistente.',
    porQueNo: {
      b: 'La tabla ya no existe, así que no se puede consultar.',
      c: 'Los sinónimos no impiden eliminar el objeto.',
      d: 'Los sinónimos no se eliminan automáticamente con el objeto.'
    }
  },
  {
    id: 'X088', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los sinónimos son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Un usuario puede crear un sinónimo privado con el mismo nombre que un sinónimo público.' },
      { id: 'b', texto: 'Al resolver un nombre, un sinónimo privado del usuario tiene prioridad sobre un sinónimo público del mismo nombre.' },
      { id: 'c', texto: 'Crear un sinónimo otorga automáticamente privilegios sobre el objeto.' },
      { id: 'd', texto: 'Solo se pueden crear sinónimos para tablas.' },
      { id: 'e', texto: 'DROP SYNONYM elimina también el objeto al que apunta.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los sinónimos privados están en el esquema del usuario, mientras que los públicos pertenecen a PUBLIC; pueden compartir nombre. Oracle busca primero en el esquema del usuario y después los sinónimos públicos.',
    porQueNo: {
      c: 'Un sinónimo es solo un alias; acceder al objeto sigue requiriendo privilegios.',
      d: 'También se crean para vistas, secuencias, procedimientos, paquetes y otros sinónimos.',
      e: 'DROP SYNONYM solo elimina el alias.'
    }
  },
  {
    id: 'X089', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'multiple',
    enunciado: 'Se ejecuta la sentencia. ¿Qué dos índices crea Oracle automáticamente? (Elige dos)',
    codigo: 'CREATE TABLE orders (\n  order_id NUMBER       CONSTRAINT ord_pk PRIMARY KEY,\n  code     VARCHAR2(10) CONSTRAINT ord_code_uk UNIQUE,\n  cust_id  NUMBER       CONSTRAINT ord_cust_fk REFERENCES customers (cust_id),\n  total    NUMBER       CONSTRAINT ord_total_ck CHECK (total >= 0)\n);',
    opciones: [
      { id: 'a', texto: 'Un índice único para ORDER_ID.' },
      { id: 'b', texto: 'Un índice único para CODE.' },
      { id: 'c', texto: 'Un índice para CUST_ID.' },
      { id: 'd', texto: 'Un índice para TOTAL.' },
      { id: 'e', texto: 'Un índice compuesto para (ORDER_ID, CUST_ID).' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Oracle crea automáticamente índices para las restricciones PRIMARY KEY y UNIQUE (si no existe ya uno utilizable). No los crea para FOREIGN KEY ni CHECK.',
    porQueNo: {
      c: 'Las FK no generan índices automáticamente (aunque suele recomendarse indexarlas).',
      d: 'Las restricciones CHECK no crean índices.',
      e: 'Oracle no combina columnas de restricciones distintas en un índice.'
    }
  },
  {
    id: 'X090', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: 'El índice EMP_PK se creó automáticamente para la clave primaria de EMPLOYEES. ¿Qué ocurre al ejecutar `DROP INDEX emp_pk;`?',
    opciones: [
      { id: 'a', texto: 'Falla con ORA-02429: cannot drop index used for enforcement of unique/primary key.' },
      { id: 'b', texto: 'Elimina el índice y la clave primaria.' },
      { id: 'c', texto: 'Elimina el índice; la PK sigue activa sin índice.' },
      { id: 'd', texto: 'Elimina el índice y Oracle lo recrea en el siguiente INSERT.' }
    ],
    correctas: ['a'],
    explicacion: 'Un índice que garantiza una PK o UNIQUE no se puede eliminar con DROP INDEX. Hay que eliminar o deshabilitar la restricción (por ejemplo, ALTER TABLE ... DROP PRIMARY KEY).',
    porQueNo: {
      b: 'DROP INDEX no elimina restricciones; simplemente falla.',
      c: 'Una PK habilitada siempre necesita un índice.',
      d: 'Oracle no permite la eliminación en primer lugar.'
    }
  },
  {
    id: 'X091', examen: 'exam071', tema: 'Tablas temporales y externas',
    tipo: 'unica',
    enunciado: '¿Qué devuelve el último SELECT?',
    codigo: 'CREATE GLOBAL TEMPORARY TABLE gtt_work (c NUMBER);\nINSERT INTO gtt_work VALUES (1);\nINSERT INTO gtt_work VALUES (2);\nCOMMIT;\nINSERT INTO gtt_work VALUES (3);\nSELECT COUNT(*) FROM gtt_work;',
    opciones: [
      { id: 'a', texto: '1' },
      { id: 'b', texto: '3' },
      { id: 'c', texto: '2' },
      { id: 'd', texto: '0' }
    ],
    correctas: ['a'],
    explicacion: 'Si no se indica ON COMMIT, una tabla temporal global es ON COMMIT DELETE ROWS: el COMMIT vacía las filas de la sesión. Solo queda la fila insertada después.',
    porQueNo: {
      b: 'Las filas 1 y 2 se borraron con el COMMIT.',
      c: 'Las filas 1 y 2 se confirmaron, pero en una GTT con ON COMMIT DELETE ROWS (el valor por defecto) el COMMIT las elimina.',
      d: 'La fila 3 se insertó después del COMMIT y sigue visible en la transacción actual.'
    }
  },
  {
    id: 'X092', examen: 'exam071', tema: 'Tablas temporales y externas',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las tablas temporales globales son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Los datos insertados por una sesión solo son visibles para esa sesión.' },
      { id: 'b', texto: 'La definición de la tabla es permanente y la pueden usar otras sesiones.' },
      { id: 'c', texto: 'Con ON COMMIT PRESERVE ROWS los datos persisten después de cerrar la sesión.' },
      { id: 'd', texto: 'Si no se especifica, la opción por defecto es ON COMMIT PRESERVE ROWS.' },
      { id: 'e', texto: 'No se pueden crear índices sobre ellas.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'En una GTT la estructura es compartida y permanente, pero los datos son privados de cada sesión y temporales.',
    porQueNo: {
      c: 'PRESERVE ROWS conserva los datos hasta el fin de la sesión, no más.',
      d: 'El valor por defecto es ON COMMIT DELETE ROWS.',
      e: 'Se pueden crear índices (también temporales) sobre una GTT.'
    }
  },
  {
    id: 'X093', examen: 'exam071', tema: 'Tablas temporales y externas',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las tablas externas creadas con el driver ORACLE_LOADER son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Los datos residen en archivos del sistema operativo, fuera de la base de datos.' },
      { id: 'b', texto: 'No admiten INSERT, UPDATE ni DELETE.' },
      { id: 'c', texto: 'Se pueden crear índices sobre ellas.' },
      { id: 'd', texto: 'Al crearlas, sus datos se cargan en un segmento de la base de datos.' },
      { id: 'e', texto: 'Admiten UPDATE si el archivo es de texto plano.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Una tabla externa es una definición en el diccionario que lee archivos a través de un objeto DIRECTORY. Con ORACLE_LOADER es de solo lectura.',
    porQueNo: {
      c: 'No se pueden indexar las tablas externas.',
      d: 'Los datos no se cargan: se leen del archivo cada vez que se consulta la tabla.',
      e: 'Con ORACLE_LOADER no se permite DML en ningún caso.'
    }
  },
  {
    id: 'X094', examen: 'exam071', tema: 'Diccionario de datos',
    tipo: 'multiple',
    enunciado: 'Un usuario sin privilegios administrativos consulta el diccionario de datos. ¿Qué dos afirmaciones son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'USER_TABLES muestra las tablas que pertenecen al usuario actual.' },
      { id: 'b', texto: 'ALL_TABLES muestra las tablas del usuario y aquellas sobre las que tiene privilegios.' },
      { id: 'c', texto: 'USER_TABLES tiene una columna OWNER con el nombre del usuario.' },
      { id: 'd', texto: 'Cualquier usuario puede consultar DBA_TABLES.' },
      { id: 'e', texto: 'Las vistas del diccionario pueden modificarse con UPDATE para corregir metadatos.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Las vistas USER_ muestran los objetos propios, ALL_ los accesibles y DBA_ todos los de la base de datos (requieren privilegios como SELECT ANY DICTIONARY o el rol SELECT_CATALOG_ROLE).',
    porQueNo: {
      c: 'Las vistas USER_ no tienen columna OWNER, porque el propietario siempre es el usuario actual.',
      d: 'Sin privilegios especiales, consultar DBA_TABLES produce ORA-00942.',
      e: 'Las vistas del diccionario son de solo lectura; los metadatos se cambian con DDL.'
    }
  },
  {
    id: 'X095', examen: 'exam071', tema: 'Diccionario de datos',
    tipo: 'unica',
    enunciado: 'En USER_CONSTRAINTS, ¿qué valor de CONSTRAINT_TYPE tiene una restricción NOT NULL?',
    opciones: [
      { id: 'a', texto: 'C' },
      { id: 'b', texto: 'N' },
      { id: 'c', texto: 'U' },
      { id: 'd', texto: 'Las restricciones NOT NULL no aparecen en USER_CONSTRAINTS.' }
    ],
    correctas: ['a'],
    explicacion: 'Oracle implementa NOT NULL como una restricción CHECK ("COL" IS NOT NULL), así que aparece con tipo C. Los otros tipos son P (primary key), U (unique) y R (foreign key).',
    porQueNo: {
      b: 'No existe el tipo N.',
      c: 'U corresponde a UNIQUE.',
      d: 'Las restricciones NOT NULL sí aparecen, como tipo C.'
    }
  },
  {
    id: 'X096', examen: 'exam071', tema: 'Privilegios y roles',
    tipo: 'unica',
    enunciado: 'El DBA ejecuta `GRANT CREATE TABLE TO ana WITH ADMIN OPTION;`. Ana ejecuta `GRANT CREATE TABLE TO luis;`. Después, el DBA ejecuta `REVOKE CREATE TABLE FROM ana;`. ¿Qué ocurre con Luis?',
    opciones: [
      { id: 'a', texto: 'Luis conserva el privilegio CREATE TABLE.' },
      { id: 'b', texto: 'Luis pierde el privilegio en cascada.' },
      { id: 'c', texto: 'El REVOKE falla porque Ana ya otorgó el privilegio.' },
      { id: 'd', texto: 'Luis conserva el privilegio, pero sus tablas se eliminan.' }
    ],
    correctas: ['a'],
    explicacion: 'La revocación de privilegios de sistema otorgados WITH ADMIN OPTION no se propaga en cascada. Es lo contrario de los privilegios de objeto otorgados WITH GRANT OPTION.',
    porQueNo: {
      b: 'La cascada ocurre con privilegios de objeto (WITH GRANT OPTION), no de sistema.',
      c: 'El REVOKE es válido.',
      d: 'Revocar un privilegio nunca elimina los objetos ya creados.'
    }
  },
  {
    id: 'X097', examen: 'exam071', tema: 'Privilegios y roles',
    tipo: 'multiple',
    enunciado: 'El usuario SCOTT es dueño de la tabla EMP. ¿Qué dos sentencias GRANT ejecutadas por SCOTT son válidas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'GRANT UPDATE (sal) ON emp TO ana;' },
      { id: 'b', texto: 'GRANT INSERT (empno, ename) ON emp TO ana;' },
      { id: 'c', texto: 'GRANT SELECT (sal) ON emp TO ana;' },
      { id: 'd', texto: 'GRANT SELECT ON emp TO ana WITH ADMIN OPTION;' },
      { id: 'e', texto: 'GRANT DELETE (sal) ON emp TO ana;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los privilegios INSERT, UPDATE y REFERENCES pueden otorgarse sobre columnas concretas. Para restringir un SELECT a ciertas columnas se usa una vista.',
    porQueNo: {
      c: 'SELECT no admite lista de columnas: ORA-00969: missing ON keyword.',
      d: 'WITH ADMIN OPTION es para privilegios de sistema y roles; para privilegios de objeto se usa WITH GRANT OPTION.',
      e: 'DELETE afecta a filas completas; no puede otorgarse por columna.'
    }
  },
  {
    id: 'X098', examen: 'exam071', tema: 'Privilegios y roles',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los roles son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Un rol puede otorgarse a otro rol.' },
      { id: 'b', texto: 'Un rol puede contener tanto privilegios de sistema como privilegios de objeto.' },
      { id: 'c', texto: 'Un rol pertenece al esquema del usuario que lo creó.' },
      { id: 'd', texto: 'Un privilegio de objeto puede otorgarse a un rol WITH GRANT OPTION.' },
      { id: 'e', texto: 'Un rol solo puede otorgarse a un usuario.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los roles agrupan privilegios de sistema y de objeto, y pueden otorgarse a usuarios, a otros roles y a PUBLIC.',
    porQueNo: {
      c: 'Los roles no pertenecen a ningún esquema; son objetos globales de la base de datos.',
      d: 'No se puede otorgar un privilegio de objeto a un rol WITH GRANT OPTION: ORA-01926.',
      e: 'Un rol también puede otorgarse a otros roles y a PUBLIC.'
    }
  },
  {
    id: 'X099', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: 'La sesión tenía TIME_ZONE = \'-05:00\' cuando se insertó la fila. ¿Qué muestran las columnas tras cambiar la zona horaria de la sesión?',
    codigo: "CREATE TABLE tz_demo (\n  tstz  TIMESTAMP WITH TIME ZONE,\n  tsltz TIMESTAMP WITH LOCAL TIME ZONE\n);\nINSERT INTO tz_demo VALUES (TIMESTAMP '2024-05-01 10:00:00 -05:00',\n                            TIMESTAMP '2024-05-01 10:00:00 -05:00');\nALTER SESSION SET TIME_ZONE = '+01:00';\nSELECT tstz, tsltz FROM tz_demo;",
    opciones: [
      { id: 'a', texto: 'TSTZ: 10:00 -05:00 · TSLTZ: 16:00 (hora de la sesión)' },
      { id: 'b', texto: 'TSTZ: 16:00 +01:00 · TSLTZ: 10:00' },
      { id: 'c', texto: 'Ambas muestran 10:00.' },
      { id: 'd', texto: 'Ambas muestran 16:00.' }
    ],
    correctas: ['a'],
    explicacion: 'TIMESTAMP WITH TIME ZONE guarda el desplazamiento original y lo muestra tal cual. TIMESTAMP WITH LOCAL TIME ZONE se normaliza a la zona de la base de datos y se muestra convertido a la zona de la sesión: 10:00 -05:00 = 15:00 UTC = 16:00 +01:00.',
    porQueNo: {
      b: 'Invierte el comportamiento: TSTZ no se convierte; TSLTZ sí.',
      c: 'TSLTZ se ajusta a la zona horaria de la sesión.',
      d: 'TSTZ conserva su desplazamiento original.'
    }
  },
  {
    id: 'X100', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: "SELECT DATE '2024-01-31' + INTERVAL '1' MONTH\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'Error ORA-01839: date not valid for month specified.' },
      { id: 'b', texto: 'Devuelve 29-FEB-24.' },
      { id: 'c', texto: 'Devuelve 02-MAR-24.' },
      { id: 'd', texto: 'Devuelve 01-MAR-24.' }
    ],
    correctas: ['a'],
    explicacion: 'Sumar un INTERVAL de meses solo cambia el mes y conserva el día: daría el 31 de febrero, que no existe. A diferencia de ADD_MONTHS, la aritmética con INTERVAL no ajusta al último día del mes.',
    porQueNo: {
      b: 'Ese sería el resultado de ADD_MONTHS(DATE \'2024-01-31\', 1).',
      c: 'Oracle no desborda los días sobrantes al mes siguiente.',
      d: 'Oracle no redondea al primer día del mes siguiente.'
    }
  },
  {
    id: 'X101', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las funciones de fecha y hora son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'SYSTIMESTAMP devuelve un TIMESTAMP WITH TIME ZONE.' },
      { id: 'b', texto: 'LOCALTIMESTAMP devuelve un TIMESTAMP sin información de zona horaria.' },
      { id: 'c', texto: 'CURRENT_DATE devuelve la fecha del sistema operativo del servidor, sin importar la zona de la sesión.' },
      { id: 'd', texto: 'SYSDATE incluye fracciones de segundo.' },
      { id: 'e', texto: 'CURRENT_TIMESTAMP devuelve un valor de tipo DATE.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'SYSTIMESTAMP (servidor) y CURRENT_TIMESTAMP (sesión) devuelven TIMESTAMP WITH TIME ZONE; LOCALTIMESTAMP devuelve TIMESTAMP sin zona en la zona de la sesión.',
    porQueNo: {
      c: 'CURRENT_DATE usa la zona horaria de la sesión; la del servidor es la de SYSDATE.',
      d: 'SYSDATE es de tipo DATE, que no guarda fracciones de segundo.',
      e: 'CURRENT_TIMESTAMP devuelve TIMESTAMP WITH TIME ZONE.'
    }
  },
  {
    id: 'X102', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT EXTRACT(HOUR FROM SYSDATE)\nFROM   dual;',
    opciones: [
      { id: 'a', texto: 'Error ORA-30076: invalid extract field for extract source.' },
      { id: 'b', texto: 'Devuelve la hora actual (0-23).' },
      { id: 'c', texto: 'Devuelve 0, porque DATE no guarda la hora.' },
      { id: 'd', texto: 'Devuelve la hora en formato de 12 horas.' }
    ],
    correctas: ['a'],
    explicacion: 'Para un valor DATE, EXTRACT solo admite YEAR, MONTH y DAY. Para la hora se puede usar TO_CHAR(SYSDATE, \'HH24\') o EXTRACT(HOUR FROM CAST(SYSDATE AS TIMESTAMP)).',
    porQueNo: {
      b: 'Funcionaría con un TIMESTAMP (por ejemplo, SYSTIMESTAMP), no con DATE.',
      c: 'DATE sí guarda la hora; el problema es que EXTRACT no admite HOUR para DATE.',
      d: 'EXTRACT no devuelve formatos de 12 horas, y aquí produce un error.'
    }
  },
  {
    id: 'X103', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT INTERVAL '1-6' YEAR TO MONTH + INTERVAL '8' MONTH AS r\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'Un intervalo de 2 años y 2 meses' },
      { id: 'b', texto: 'Un intervalo de 1 año y 14 meses' },
      { id: 'c', texto: 'Un intervalo de 9 años y 6 meses' },
      { id: 'd', texto: 'Error: no se pueden sumar intervalos.' }
    ],
    correctas: ['a'],
    explicacion: "INTERVAL '1-6' YEAR TO MONTH es un año y seis meses. Sumar 8 meses da 1 año y 14 meses, que se normaliza a 2 años y 2 meses (SQL*Plus lo muestra como +000000002-02, porque el resultado usa la precisión máxima de años).",
    porQueNo: {
      b: 'Los meses de un INTERVAL YEAR TO MONTH van de 0 a 11: 14 meses se normalizan a 1 año y 2 meses.',
      c: 'El 8 se suma a los meses, no a los años.',
      d: 'Se pueden sumar intervalos del mismo tipo (YEAR TO MONTH con YEAR TO MONTH).'
    }
  },
{
    id: 'X104', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'multiple',
    enunciado: 'Examina los datos. ¿Qué dos expresiones devuelven 150? (Elige dos)',
    exhibit: [{ titulo: 'BONUSES', columnas: ['EMP_ID', 'BONUS'], filas: [['1', '100'], ['2', null], ['3', '200'], ['4', '300']] }],
    opciones: [
      { id: 'a', texto: 'SUM(bonus) / COUNT(*)' },
      { id: 'b', texto: 'AVG(NVL(bonus, 0))' },
      { id: 'c', texto: 'AVG(bonus)' },
      { id: 'd', texto: 'SUM(bonus) / COUNT(bonus)' },
      { id: 'e', texto: 'AVG(DISTINCT bonus)' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'La suma es 600. COUNT(*) cuenta 4 filas, así que 600 / 4 = 150. AVG(NVL(bonus, 0)) convierte el NULL en 0 y promedia 4 valores: 150.',
    porQueNo: {
      c: 'AVG ignora el NULL: 600 / 3 = 200.',
      d: 'COUNT(bonus) no cuenta el NULL: 600 / 3 = 200.',
      e: 'Los valores distintos no nulos son 100, 200 y 300; su promedio es 200.'
    }
  },
  {
    id: 'X105', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las funciones de grupo son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'MIN y MAX pueden usarse con columnas numéricas, de caracteres y de fecha.' },
      { id: 'b', texto: 'SUM y AVG solo pueden usarse con datos numéricos (o convertibles a número).' },
      { id: 'c', texto: 'COUNT(DISTINCT *) cuenta las filas distintas de la tabla.' },
      { id: 'd', texto: 'AVG(hire_date) devuelve la fecha promedio de contratación.' },
      { id: 'e', texto: 'Las funciones de grupo pueden anidarse hasta tres niveles, como MAX(AVG(SUM(salary))).' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'MIN y MAX trabajan con cualquier tipo ordenable. SUM y AVG requieren valores numéricos.',
    porQueNo: {
      c: 'DISTINCT no puede aplicarse a *: es un error de sintaxis.',
      d: 'AVG no acepta fechas: ORA-00932: inconsistent datatypes.',
      e: 'Las funciones de grupo solo pueden anidarse dos niveles: ORA-00935: group function is nested too deeply.'
    }
  },
  {
    id: 'X106', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas devuelve la consulta?',
    exhibit: [{ titulo: 'STAFF', columnas: ['STAFF_ID', 'DEPT'], filas: [['1', '10'], ['2', '10'], ['3', '20'], ['4', null], ['5', null]] }],
    codigo: 'SELECT dept, COUNT(*)\nFROM   staff\nGROUP BY dept;',
    opciones: [
      { id: 'a', texto: '3' },
      { id: 'b', texto: '2' },
      { id: 'c', texto: '4' },
      { id: 'd', texto: '5' }
    ],
    correctas: ['a'],
    explicacion: 'GROUP BY trata todos los NULL como un mismo grupo. Hay tres grupos: 10 (2 filas), 20 (1 fila) y NULL (2 filas).',
    porQueNo: {
      b: 'Las filas con NULL no se descartan: forman su propio grupo.',
      c: 'Los dos NULL no forman grupos separados.',
      d: 'GROUP BY devuelve una fila por grupo, no por fila.'
    }
  },
  {
    id: 'X107', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    exhibit: [T_EMP],
    codigo: 'SELECT department_id, COUNT(*)\nFROM   employees\nGROUP BY department_id\nHAVING salary > 5000;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00979: not a GROUP BY expression.' },
      { id: 'b', texto: 'Cuenta, por departamento, solo los empleados con salario mayor que 5000.' },
      { id: 'c', texto: 'Devuelve los departamentos en los que todos los empleados ganan más de 5000.' },
      { id: 'd', texto: 'Ignora la cláusula HAVING porque no contiene funciones de grupo.' }
    ],
    correctas: ['a'],
    explicacion: 'HAVING filtra grupos, por lo que solo puede referenciar expresiones del GROUP BY, funciones de grupo o constantes. SALARY no cumple ninguna de estas condiciones. Para filtrar filas antes de agrupar se usa WHERE salary > 5000.',
    porQueNo: {
      b: 'Ese resultado se obtiene con WHERE salary > 5000 antes del GROUP BY.',
      c: 'Para eso se usaría HAVING MIN(salary) > 5000.',
      d: 'Oracle no ignora cláusulas: la referencia a SALARY produce un error.'
    }
  },
  {
    id: 'X108', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT MAX(AVG(salary))\nFROM   employees;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00978: nested group function without GROUP BY.' },
      { id: 'b', texto: 'Devuelve el salario promedio de toda la tabla.' },
      { id: 'c', texto: 'Devuelve el salario máximo de toda la tabla.' },
      { id: 'd', texto: 'Devuelve el promedio de departamento más alto.' }
    ],
    correctas: ['a'],
    explicacion: 'Anidar funciones de grupo exige GROUP BY: la función interna se calcula por grupo y la externa sobre esos resultados. Sin GROUP BY no hay grupos sobre los que aplicar la función externa.',
    porQueNo: {
      b: 'AVG(salary) solo, sin anidar, devolvería el promedio general.',
      c: 'Para eso bastaría MAX(salary).',
      d: 'Eso se obtiene añadiendo GROUP BY department_id.'
    }
  },
  {
    id: 'X109', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: 'SELECT COUNT(*), SUM(salary)\nFROM   employees\nWHERE  1 = 0;',
    opciones: [
      { id: 'a', texto: 'Una fila: 0 y NULL.' },
      { id: 'b', texto: 'Ninguna fila.' },
      { id: 'c', texto: 'Una fila: 0 y 0.' },
      { id: 'd', texto: 'Una fila: NULL y NULL.' }
    ],
    correctas: ['a'],
    explicacion: 'Una consulta con funciones de grupo y sin GROUP BY siempre devuelve una fila, aunque no haya filas de entrada. COUNT devuelve 0 y las demás funciones de grupo devuelven NULL.',
    porQueNo: {
      b: 'Eso ocurriría si la consulta tuviera GROUP BY: sin filas no hay grupos.',
      c: 'SUM de un conjunto vacío es NULL, no 0.',
      d: 'COUNT nunca devuelve NULL; devuelve 0.'
    }
  },
  {
    id: 'X110', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'multiple',
    enunciado: 'Se quiere contar empleados según su fecha o año de contratación. ¿Qué dos consultas se ejecutan correctamente en Oracle Database 19c? (Elige dos)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: "SELECT TO_CHAR(hire_date, 'YYYY'), COUNT(*)\nFROM   employees\nGROUP BY TO_CHAR(hire_date, 'YYYY');" },
      { id: 'b', texto: "SELECT TO_CHAR(hire_date, 'YYYY'), COUNT(*)\nFROM   employees\nGROUP BY hire_date;" },
      { id: 'c', texto: "SELECT TO_CHAR(hire_date, 'YYYY') yr, COUNT(*)\nFROM   employees\nGROUP BY yr;" },
      { id: 'd', texto: "SELECT hire_date, COUNT(*)\nFROM   employees\nGROUP BY TO_CHAR(hire_date, 'YYYY');" },
      { id: 'e', texto: "SELECT COUNT(*)\nFROM   employees\nGROUP BY TO_CHAR(hire_date, 'YYYY')\nHAVING hire_date > SYSDATE - 365;" }
    ],
    correctas: ['a', 'b'],
    explicacion: 'El SELECT puede contener expresiones del GROUP BY o expresiones construidas a partir de las columnas agrupadas. En b) se agrupa por fecha completa y se muestra el año de cada grupo (puede repetirse el año, pero es válida).',
    porQueNo: {
      c: 'En 19c GROUP BY no reconoce alias de columna: ORA-00904.',
      d: 'Se agrupa por el año, pero se muestra la fecha completa, que no es una expresión del GROUP BY: ORA-00979.',
      e: 'HIRE_DATE no es una expresión de agrupación, así que no puede usarse en HAVING: ORA-00979.'
    }
  },
  {
    id: 'X111', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: "SELECT CONCAT(first_name, ' ', last_name)\nFROM   employees;",
    opciones: [
      { id: 'a', texto: 'Error ORA-00909: invalid number of arguments.' },
      { id: 'b', texto: 'Devuelve el nombre y el apellido separados por un espacio.' },
      { id: 'c', texto: 'Devuelve el nombre y el apellido sin espacio.' },
      { id: 'd', texto: 'Devuelve NULL para todos los empleados.' }
    ],
    correctas: ['a'],
    explicacion: "CONCAT acepta exactamente dos argumentos. Para tres valores hay que anidar, CONCAT(CONCAT(first_name, ' '), last_name), o usar el operador ||.",
    porQueNo: {
      b: 'Ese sería el resultado con first_name || \' \' || last_name.',
      c: 'CONCAT no ignora argumentos sobrantes; la sentencia falla.',
      d: 'No se llega a ejecutar: el número de argumentos es inválido.'
    }
  },
  {
    id: 'X112', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT SUBSTR('ORACLE', -3, 2) AS s1,\n       SUBSTR('ORACLE', 0, 2)  AS s2,\n       SUBSTR('ORACLE', 3)     AS s3\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'CL, OR, ACLE' },
      { id: 'b', texto: 'LE, OR, ACLE' },
      { id: 'c', texto: 'CL, NULL, ACLE' },
      { id: 'd', texto: 'CL, O, ACL' }
    ],
    correctas: ['a'],
    explicacion: 'Una posición negativa cuenta desde el final: -3 es la C, y se toman 2 caracteres (CL). La posición 0 se trata como 1 (OR). Sin longitud, SUBSTR devuelve hasta el final (ACLE).',
    porQueNo: {
      b: '-3 apunta a la tercera posición desde el final (C), no a la segunda.',
      c: 'La posición 0 no devuelve NULL; se trata como 1.',
      d: 'Con posición 0 se toman 2 caracteres desde el primero; y sin longitud se devuelve hasta el final de la cadena.'
    }
  },
  {
    id: 'X113', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT INITCAP('hELLO wORLD-sql 2go') FROM dual;",
    opciones: [
      { id: 'a', texto: 'Hello World-Sql 2go' },
      { id: 'b', texto: 'Hello World-sql 2go' },
      { id: 'c', texto: 'Hello world-sql 2Go' },
      { id: 'd', texto: 'HELLO WORLD-SQL 2GO' }
    ],
    correctas: ['a'],
    explicacion: 'INITCAP pone en mayúscula la primera letra de cada palabra y el resto en minúscula. Las palabras se separan por cualquier carácter no alfanumérico (espacio, guion...). "2go" es una palabra que empieza con un dígito, así que la "g" queda en minúscula.',
    porQueNo: {
      b: 'El guion también separa palabras, así que "sql" pasa a "Sql".',
      c: 'Cada palabra empieza en mayúscula; "2go" ya empieza con el dígito 2, por lo que la "g" no se cambia a mayúscula.',
      d: 'Eso devolvería UPPER, no INITCAP.'
    }
  },
  {
    id: 'X114', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT LENGTH(''), NVL(LENGTH(''), -1), '' || 'A'\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'NULL, -1, A' },
      { id: 'b', texto: '0, 0, A' },
      { id: 'c', texto: '0, -1, A' },
      { id: 'd', texto: 'NULL, -1, NULL' }
    ],
    correctas: ['a'],
    explicacion: "En Oracle, la cadena vacía '' es NULL. LENGTH(NULL) es NULL, por lo que NVL devuelve -1. La concatenación trata NULL como cadena vacía y devuelve 'A'.",
    porQueNo: {
      b: "'' no es una cadena de longitud 0 en Oracle; es NULL.",
      c: 'LENGTH de NULL es NULL, no 0.',
      d: 'Concatenar con NULL no anula el resultado.'
    }
  },
  {
    id: 'X115', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta? (NLS_DATE_FORMAT = DD-MON-RR)',
    codigo: "SELECT ROUND(DATE '2024-07-16', 'MONTH') AS r1,\n       ROUND(DATE '2024-07-01', 'YEAR')  AS r2,\n       TRUNC(DATE '2024-07-16', 'YEAR')  AS r3\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '01-AUG-24, 01-JAN-25, 01-JAN-24' },
      { id: 'b', texto: '01-JUL-24, 01-JAN-24, 01-JAN-24' },
      { id: 'c', texto: '01-AUG-24, 01-JAN-24, 01-JAN-24' },
      { id: 'd', texto: '16-AUG-24, 01-JAN-25, 16-JAN-24' }
    ],
    correctas: ['a'],
    explicacion: 'ROUND por mes redondea hacia el mes siguiente a partir del día 16. ROUND por año redondea hacia el año siguiente a partir del 1 de julio. TRUNC siempre va al inicio del periodo.',
    porQueNo: {
      b: 'El día 16 ya redondea al mes siguiente, y el 1 de julio al año siguiente.',
      c: 'El 1 de julio redondea al año siguiente (2025).',
      d: 'ROUND y TRUNC con MONTH o YEAR devuelven el primer día del periodo, no conservan el día.'
    }
  },
  {
    id: 'X116', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'unica',
    enunciado: 'El 15 de marzo de 2024 fue viernes. ¿Qué devuelve la consulta? (NLS_DATE_FORMAT = DD-MON-RR, idioma AMERICAN)',
    codigo: "SELECT NEXT_DAY(DATE '2024-03-15', 'FRIDAY') AS nd,\n       LAST_DAY(DATE '2023-02-10')         AS ld\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '22-MAR-24, 28-FEB-23' },
      { id: 'b', texto: '15-MAR-24, 28-FEB-23' },
      { id: 'c', texto: '22-MAR-24, 29-FEB-23' },
      { id: 'd', texto: '15-MAR-24, 01-MAR-23' }
    ],
    correctas: ['a'],
    explicacion: 'NEXT_DAY devuelve el primer día con ese nombre posterior a la fecha indicada; si la fecha ya es viernes, devuelve el viernes siguiente. LAST_DAY devuelve el último día del mes: 2023 no es bisiesto.',
    porQueNo: {
      b: 'NEXT_DAY nunca devuelve la misma fecha; busca el siguiente viernes.',
      c: '2023 no es bisiesto: febrero termina el 28.',
      d: 'Ninguna de las dos funciones se comporta así.'
    }
  },
  {
    id: 'X117', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'multiple',
    enunciado: '¿Qué tres afirmaciones sobre las funciones de una fila son verdaderas? (Elige tres)',
    opciones: [
      { id: 'a', texto: 'Pueden anidarse; se evalúan desde el nivel más interno hacia afuera.' },
      { id: 'b', texto: 'Pueden usarse en las cláusulas SELECT, WHERE y ORDER BY.' },
      { id: 'c', texto: 'Devuelven un resultado por cada fila procesada.' },
      { id: 'd', texto: 'Siempre devuelven un valor del mismo tipo de dato que su primer argumento.' },
      { id: 'e', texto: 'No pueden recibir columnas como argumentos, solo literales.' },
      { id: 'f', texto: 'Solo pueden anidarse hasta dos niveles, igual que las funciones de grupo.' }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: 'Las funciones de una fila operan sobre cada fila y devuelven un valor por fila. Se pueden anidar a cualquier profundidad y usar en casi cualquier cláusula.',
    porQueNo: {
      d: 'Por ejemplo, LENGTH recibe texto y devuelve un número, y TO_CHAR recibe fechas o números y devuelve texto.',
      e: 'Admiten columnas, literales y expresiones como argumentos.',
      f: 'El límite de dos niveles aplica a las funciones de grupo, no a las de una fila.'
    }
  },
  {
    id: 'X118', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'unica',
    enunciado: 'El 5 de marzo de 2024 fue martes (Tuesday). Con idioma AMERICAN, ¿qué devuelve la consulta?',
    codigo: "SELECT LENGTH(TO_CHAR(DATE '2024-03-05', 'Day'))   AS l1,\n       LENGTH(TO_CHAR(DATE '2024-03-05', 'fmDay')) AS l2\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '9, 7' },
      { id: 'b', texto: '7, 7' },
      { id: 'c', texto: '9, 9' },
      { id: 'd', texto: '3, 7' }
    ],
    correctas: ['a'],
    explicacion: "Los elementos Day y Month se rellenan con espacios hasta la longitud del nombre más largo (Wednesday, 9 caracteres). El modificador fm (fill mode) elimina ese relleno: 'Tuesday' tiene 7.",
    porQueNo: {
      b: 'Sin fm el nombre se rellena con espacios a la derecha.',
      c: 'fm elimina los espacios de relleno.',
      d: '3 sería la longitud de la abreviatura (formato Dy).'
    }
  },
  {
    id: 'X119', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT TO_CHAR(12345, '9,999') AS c1,\n       TO_CHAR(0.5, '0.99')    AS c2\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'C1 muestra solo signos # y C2 muestra 0.50' },
      { id: 'b', texto: 'C1 muestra 12,345 y C2 muestra .50' },
      { id: 'c', texto: 'C1 muestra 2,345 y C2 muestra 0.50' },
      { id: 'd', texto: 'Error ORA-01722 por desbordamiento del formato.' }
    ],
    correctas: ['a'],
    explicacion: "Si el número tiene más dígitos enteros que el modelo, TO_CHAR devuelve una cadena de # del ancho del formato. El 0 inicial del modelo '0.99' fuerza a mostrar el cero antes del punto decimal.",
    porQueNo: {
      b: 'El modelo 9,999 solo admite 4 dígitos enteros; y el 0 del modelo muestra el cero inicial.',
      c: 'TO_CHAR no trunca los dígitos de la izquierda; los reemplaza por #.',
      d: 'TO_CHAR no da error por desbordamiento: muestra #.'
    }
  },
  {
    id: 'X120', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'multiple',
    enunciado: 'NLS_DATE_FORMAT es DD-MON-RR y el idioma es AMERICAN. ¿Qué dos condiciones WHERE se ejecutan sin error sobre EMPLOYEES? (Elige dos)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: "WHERE employee_id = '100'" },
      { id: 'b', texto: "WHERE hire_date = '17-JUN-03'" },
      { id: 'c', texto: 'WHERE last_name = 100' },
      { id: 'd', texto: "WHERE salary = '24,000'" },
      { id: 'e', texto: "WHERE hire_date = '2003-06-17'" }
    ],
    correctas: ['a', 'b'],
    explicacion: "Oracle convierte implícitamente un literal de texto a número o a fecha cuando el texto es válido para ese tipo (para fechas, según NLS_DATE_FORMAT).",
    porQueNo: {
      c: 'Oracle convierte la columna de texto a número para compararla con 100, y los apellidos no son numéricos: ORA-01722.',
      d: "'24,000' no es convertible a número sin un modelo de formato: ORA-01722.",
      e: 'El literal no coincide con DD-MON-RR: ORA-01861: literal does not match format string.'
    }
  },
  {
    id: 'X121', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: "SELECT last_name,\n       CASE WHEN salary > 10000 THEN 'High'\n            ELSE 0\n       END AS lvl\nFROM   employees;",
    opciones: [
      { id: 'a', texto: 'Error ORA-00932: inconsistent datatypes: expected CHAR got NUMBER.' },
      { id: 'b', texto: "Muestra 'High' o '0' según el salario." },
      { id: 'c', texto: "Muestra 'High' o NULL según el salario." },
      { id: 'd', texto: 'Error ORA-01722: invalid number.' }
    ],
    correctas: ['a'],
    explicacion: 'Todas las expresiones de resultado de un CASE deben pertenecer al mismo grupo de tipos de datos. CASE no hace conversión implícita entre texto y número: el primer resultado es CHAR y el ELSE es NUMBER.',
    porQueNo: {
      b: "Funcionaría con ELSE '0' (texto).",
      c: 'Así se comportaría sin cláusula ELSE.',
      d: 'Oracle no intenta convertir el texto a número; detecta la incompatibilidad de tipos al analizar.'
    }
  },
  {
    id: 'X122', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'multiple',
    enunciado: "COMMISSION_PCT es NUMBER(2,2). ¿Qué dos expresiones devuelven el texto 'none' para los empleados sin comisión y se ejecutan sin error? (Elige dos)",
    opciones: [
      { id: 'a', texto: "NVL(TO_CHAR(commission_pct), 'none')" },
      { id: 'b', texto: "COALESCE(TO_CHAR(commission_pct), 'none')" },
      { id: 'c', texto: "COALESCE(commission_pct, 'none')" },
      { id: 'd', texto: "CASE WHEN commission_pct IS NULL THEN 'none' ELSE commission_pct END" },
      { id: 'e', texto: "NVL(commission_pct, 'none')" }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Convertir primero la columna numérica a texto hace que ambos argumentos sean del mismo tipo.',
    porQueNo: {
      c: 'COALESCE exige que todos los argumentos sean del mismo grupo de tipos: ORA-00932: inconsistent datatypes.',
      d: 'Los resultados del CASE mezclan texto y número: ORA-00932.',
      e: "NVL intenta convertir 'none' al tipo del primer argumento (número): ORA-01722."
    }
  },
  {
    id: 'X123', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Qué empleados devuelve la consulta?',
    exhibit: [{ titulo: 'STAFF', columnas: ['NAME', 'DEPT', 'SALARY'], filas: [['Ana', '10', '3000'], ['Beto', '10', '5000'], ['Carla', '20', '4000'], ['Dario', null, '2000'], ['Eva', null, '6000']] }],
    codigo: 'SELECT name\nFROM   staff\nWHERE  (dept, salary) IN (SELECT dept, MIN(salary)\n                          FROM   staff\n                          GROUP BY dept);',
    opciones: [
      { id: 'a', texto: 'Ana y Carla' },
      { id: 'b', texto: 'Ana, Carla y Dario' },
      { id: 'c', texto: 'Solo Dario' },
      { id: 'd', texto: 'Error: una subconsulta no puede devolver dos columnas.' }
    ],
    correctas: ['a'],
    explicacion: 'Es una comparación por pares. La subconsulta devuelve (10, 3000), (20, 4000) y (NULL, 2000). Para Dario, la comparación NULL = NULL es UNKNOWN, así que no coincide.',
    porQueNo: {
      b: 'El grupo NULL aparece en la subconsulta, pero NULL = NULL no es TRUE.',
      c: 'Ana y Carla sí coinciden con el mínimo de sus departamentos.',
      d: 'Las subconsultas multicolumna son válidas cuando se comparan con una lista entre paréntesis.'
    }
  },
  {
    id: 'X124', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT d.department_id, d.avg_sal\nFROM   (SELECT department_id AS dept, AVG(salary) AS avg_sal\n        FROM   employees\n        GROUP BY department_id) d\nWHERE  d.avg_sal > 10000;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00904: "D"."DEPARTMENT_ID": invalid identifier.' },
      { id: 'b', texto: 'Devuelve los departamentos con salario promedio mayor que 10000.' },
      { id: 'c', texto: 'Error: una vista en línea no puede tener GROUP BY.' },
      { id: 'd', texto: 'Error: el alias de columna avg_sal no puede usarse en WHERE.' }
    ],
    correctas: ['a'],
    explicacion: 'Las columnas de una vista en línea se conocen fuera de ella por sus alias. DEPARTMENT_ID se renombró como DEPT, así que d.department_id no existe.',
    porQueNo: {
      b: 'Funcionaría escribiendo d.dept en lugar de d.department_id.',
      c: 'Una vista en línea puede contener cualquier consulta válida, incluido GROUP BY.',
      d: 'Dentro de la consulta externa, avg_sal es un nombre de columna de la vista en línea, y sí puede usarse en WHERE.'
    }
  },
  {
    id: 'X125', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'Examina los datos de STAFF. Después de ejecutar el UPDATE, ¿qué salario tiene Dario?',
    exhibit: [{ titulo: 'STAFF', columnas: ['NAME', 'DEPT', 'SALARY'], filas: [['Ana', '10', '3000'], ['Beto', '10', '5000'], ['Dario', null, '2000']] }],
    codigo: 'UPDATE staff s\nSET    salary = (SELECT AVG(i.salary)\n                 FROM   staff i\n                 WHERE  i.dept = s.dept);',
    opciones: [
      { id: 'a', texto: 'NULL' },
      { id: 'b', texto: '2000' },
      { id: 'c', texto: '3333.33' },
      { id: 'd', texto: 'El UPDATE falla para esa fila y se deshace toda la sentencia.' }
    ],
    correctas: ['a'],
    explicacion: 'Para Dario, la condición i.dept = NULL no es TRUE para ninguna fila, así que AVG se calcula sobre un conjunto vacío y devuelve NULL. El UPDATE asigna ese NULL. Ana y Beto quedan con 4000.',
    porQueNo: {
      b: 'El UPDATE no tiene WHERE: modifica todas las filas, incluida la de Dario.',
      c: 'Ese sería el promedio de toda la tabla, pero la subconsulta está correlacionada por departamento.',
      d: 'Asignar NULL no es un error (salvo que la columna sea NOT NULL).'
    }
  },
  {
    id: 'X126', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'Ningún empleado se apellida Nobody. ¿Qué ocurre al ejecutar la consulta?',
    codigo: "SELECT last_name\nFROM   employees\nWHERE  salary = (SELECT salary\n                 FROM   employees\n                 WHERE  last_name = 'Nobody');",
    opciones: [
      { id: 'a', texto: 'No devuelve filas, sin error.' },
      { id: 'b', texto: 'Error ORA-01427.' },
      { id: 'c', texto: 'Error ORA-01403: no data found.' },
      { id: 'd', texto: 'Devuelve los empleados con salario NULL.' }
    ],
    correctas: ['a'],
    explicacion: 'Si una subconsulta de una fila no devuelve filas, su valor es NULL. La condición salary = NULL nunca es TRUE, así que la consulta no devuelve filas.',
    porQueNo: {
      b: 'ORA-01427 aparece cuando la subconsulta devuelve más de una fila, no cuando no devuelve ninguna.',
      c: 'ORA-01403 es un error de PL/SQL (SELECT INTO), no de una consulta SQL.',
      d: 'salary = NULL no es TRUE ni siquiera cuando salary es NULL.'
    }
  },
  {
    id: 'X127', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las subconsultas son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'NOT EXISTS no se ve afectado por los NULL que pueda devolver la subconsulta.' },
      { id: 'b', texto: 'Una subconsulta puede usarse en la cláusula HAVING.' },
      { id: 'c', texto: 'Una subconsulta con IN no puede devolver más de una columna.' },
      { id: 'd', texto: 'En EXISTS, la subconsulta debe seleccionar exactamente una columna de la tabla.' },
      { id: 'e', texto: 'Una subconsulta correlacionada no puede referenciar columnas de la consulta externa.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'NOT EXISTS solo evalúa si hay filas, sin comparar valores. Las subconsultas pueden aparecer en WHERE, HAVING, FROM, SELECT y otras cláusulas.',
    porQueNo: {
      c: 'Se permiten comparaciones multicolumna: WHERE (a, b) IN (SELECT x, y ...).',
      d: 'Con EXISTS lo seleccionado es irrelevante; SELECT 1 o SELECT * son válidos.',
      e: 'Referenciar columnas de la consulta externa es precisamente lo que define a una subconsulta correlacionada.'
    }
  },
  {
    id: 'X128', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'multiple',
    enunciado: 'Examina la consulta. ¿Qué dos afirmaciones sobre la cláusula WITH son verdaderas? (Elige dos)',
    codigo: 'WITH dept_costs AS (\n       SELECT department_id, SUM(salary) AS total\n       FROM   employees\n       GROUP BY department_id),\n     avg_cost AS (\n       SELECT AVG(total) AS avg_total FROM dept_costs)\nSELECT d.department_id, d.total\nFROM   dept_costs d, avg_cost a\nWHERE  d.total > a.avg_total;',
    opciones: [
      { id: 'a', texto: 'Un bloque de consulta del WITH puede referenciar a otro bloque definido antes en la misma cláusula.' },
      { id: 'b', texto: 'La consulta principal puede referenciar varias veces el mismo nombre de consulta.' },
      { id: 'c', texto: 'WITH crea vistas permanentes que pueden usarse en otras sentencias.' },
      { id: 'd', texto: 'Una cláusula WITH solo puede definir un bloque de consulta.' },
      { id: 'e', texto: 'Un bloque puede referenciar a otro bloque definido después de él en la misma cláusula WITH.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'La cláusula WITH (subquery factoring) define bloques con nombre que solo existen durante la sentencia. Cada bloque puede usar los definidos antes, y la consulta principal puede usarlos tantas veces como necesite.',
    porQueNo: {
      c: 'Los nombres del WITH solo existen dentro de la sentencia.',
      d: 'Se pueden definir varios bloques separados por comas.',
      e: 'Solo se puede referenciar a bloques ya definidos (antes en la lista).'
    }
  },
  {
    id: 'X129', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la sentencia?',
    codigo: 'SELECT employee_id, last_name FROM employees\nUNION\nSELECT department_id FROM departments;',
    opciones: [
      { id: 'a', texto: 'Error ORA-01789: query block has incorrect number of result columns.' },
      { id: 'b', texto: 'Se ejecuta; la segunda columna se rellena con NULL en las filas de DEPARTMENTS.' },
      { id: 'c', texto: 'Error ORA-01790: expression must have same datatype as corresponding expression.' },
      { id: 'd', texto: 'Se ejecuta y devuelve solo la primera columna.' }
    ],
    correctas: ['a'],
    explicacion: 'Todas las consultas de un operador de conjunto deben devolver el mismo número de columnas. Para igualarlas se puede añadir NULL o un literal en la segunda consulta.',
    porQueNo: {
      b: 'Oracle no rellena columnas automáticamente; hay que escribir NULL explícitamente.',
      c: 'El problema es el número de columnas, no sus tipos.',
      d: 'Oracle no descarta columnas; la sentencia falla.'
    }
  },
  {
    id: 'X130', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'multiple',
    enunciado: '¿Qué dos sentencias compuestas con operadores de conjunto se ejecutan sin error? (Elige dos)',
    exhibit: [T_EMP, T_DEPT],
    opciones: [
      { id: 'a', texto: 'SELECT employee_id, last_name FROM employees\nUNION\nSELECT department_id, NULL FROM departments;' },
      { id: 'b', texto: 'SELECT last_name, hire_date FROM employees\nUNION\nSELECT department_name, TO_DATE(NULL) FROM departments;' },
      { id: 'c', texto: 'SELECT last_name, hire_date FROM employees\nUNION\nSELECT department_name, 0 FROM departments;' },
      { id: 'd', texto: 'SELECT last_name FROM employees\nUNION ALL\nSELECT department_name FROM departments\nORDER BY department_name;' },
      { id: 'e', texto: 'SELECT last_name FROM employees ORDER BY last_name\nUNION\nSELECT department_name FROM departments;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'NULL es compatible con cualquier tipo, y TO_DATE(NULL) produce explícitamente un NULL de tipo fecha. Ambas consultas igualan el número de columnas con tipos compatibles.',
    porQueNo: {
      c: 'Se combina DATE con NUMBER en la segunda columna: ORA-01790.',
      d: 'El ORDER BY de un operador de conjunto solo reconoce los nombres de la primera consulta (LAST_NAME): ORA-00904.',
      e: 'ORDER BY solo puede ir al final de la sentencia compuesta: ORA-00933.'
    }
  },
  {
    id: 'X131', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Qué devuelve la sentencia?',
    exhibit: [
      { titulo: 'A', columnas: ['N'], filas: [['10'], ['20'], ['30'], ['30']] },
      { titulo: 'B', columnas: ['N'], filas: [['20'], ['40'], ['40']] }
    ],
    codigo: 'SELECT n FROM b\nMINUS\nSELECT n FROM a;',
    opciones: [
      { id: 'a', texto: 'Una fila: 40' },
      { id: 'b', texto: 'Dos filas: 40 y 40' },
      { id: 'c', texto: 'Dos filas: 10 y 30' },
      { id: 'd', texto: 'Tres filas: 10, 30 y 40' }
    ],
    correctas: ['a'],
    explicacion: 'MINUS devuelve las filas distintas de la primera consulta que no aparecen en la segunda. De B, el 20 está en A; queda 40, una sola vez porque MINUS elimina duplicados.',
    porQueNo: {
      b: 'MINUS devuelve filas distintas: el 40 aparece una vez.',
      c: 'Ese sería el resultado de A MINUS B; el orden de las consultas importa.',
      d: 'MINUS no es una diferencia simétrica.'
    }
  },
  {
    id: 'X132', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'unica',
    enunciado: 'Un empleado gana 1000. ¿Qué valores muestran las columnas C1 y C2?',
    codigo: 'SELECT salary + 100 * 12   AS c1,\n       (salary + 100) * 12 AS c2\nFROM   employees\nWHERE  salary = 1000;',
    opciones: [
      { id: 'a', texto: 'C1 = 2200, C2 = 13200' },
      { id: 'b', texto: 'C1 = 13200, C2 = 13200' },
      { id: 'c', texto: 'C1 = 2200, C2 = 2200' },
      { id: 'd', texto: 'C1 = 13200, C2 = 2200' }
    ],
    correctas: ['a'],
    explicacion: 'La multiplicación tiene mayor precedencia que la suma: 1000 + 1200 = 2200. Los paréntesis cambian el orden: 1100 × 12 = 13200.',
    porQueNo: {
      b: 'Sin paréntesis, primero se multiplica 100 × 12.',
      c: 'Los paréntesis obligan a sumar antes de multiplicar.',
      d: 'Invierte el efecto de los paréntesis.'
    }
  },
  {
    id: 'X133', examen: 'exam071', tema: 'Conceptos relacionales y tipos de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre la integridad de datos en el modelo relacional son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'La integridad referencial exige que cada valor no nulo de una clave foránea exista en la tabla referenciada.' },
      { id: 'b', texto: 'La integridad de entidad exige que ninguna parte de la clave primaria sea NULL.' },
      { id: 'c', texto: 'Una tabla solo puede tener una restricción UNIQUE.' },
      { id: 'd', texto: 'En una columna numérica, NULL equivale a cero.' },
      { id: 'e', texto: 'Una clave foránea no puede referenciar a su propia tabla.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Integridad de entidad: la PK identifica cada fila, así que no puede ser nula. Integridad referencial: los valores de una FK deben existir en la clave referenciada (o ser NULL).',
    porQueNo: {
      c: 'Una tabla puede tener muchas restricciones UNIQUE; solo una PRIMARY KEY.',
      d: 'NULL representa un valor desconocido o inexistente, no cero.',
      e: 'Una FK puede referenciar su propia tabla (autorreferencia), como MANAGER_ID en EMPLOYEES.'
    }
  },
  {
    id: 'X134', examen: 'exam071', tema: 'Conceptos relacionales y tipos de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos sentencias son DML (Data Manipulation Language)? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'MERGE' },
      { id: 'b', texto: 'DELETE' },
      { id: 'c', texto: 'TRUNCATE' },
      { id: 'd', texto: 'COMMENT' },
      { id: 'e', texto: 'RENAME' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Las sentencias DML son INSERT, UPDATE, DELETE y MERGE (y SELECT, según la clasificación de Oracle). Forman parte de transacciones y pueden deshacerse con ROLLBACK.',
    porQueNo: {
      c: 'TRUNCATE es DDL: hace commit implícito y no puede deshacerse.',
      d: 'COMMENT ON TABLE/COLUMN es DDL.',
      e: 'RENAME es DDL.'
    }
  },
  {
    id: 'X135', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Qué filas devuelve la consulta?',
    exhibit: [{ titulo: 'EMP', columnas: ['EMP_ID', 'NAME', 'DEPT_ID'], filas: [['1', 'King', '10'], ['2', 'Lee', '20'], ['3', 'Diaz', null], ['4', 'Mora', '30']] }],
    codigo: 'SELECT name\nFROM   emp\nWHERE  dept_id IN (10, NULL);',
    opciones: [
      { id: 'a', texto: 'Solo King' },
      { id: 'b', texto: 'King y Diaz' },
      { id: 'c', texto: 'Ninguna fila' },
      { id: 'd', texto: 'Lee y Mora' }
    ],
    correctas: ['a'],
    explicacion: 'IN (10, NULL) equivale a dept_id = 10 OR dept_id = NULL. La segunda parte es siempre UNKNOWN, pero basta con que la primera sea TRUE. Diaz no se devuelve, porque NULL = NULL no es TRUE.',
    porQueNo: {
      b: 'Un NULL en la lista no hace coincidir las filas con NULL; para eso se necesita IS NULL.',
      c: 'Con IN (OR) basta una comparación verdadera; el problema de "ninguna fila" aparece con NOT IN.',
      d: 'Ese sería el resultado esperado de NOT IN (10) sin NULL.'
    }
  },
  {
    id: 'X136', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: 'NLS_DATE_FORMAT es DD-MON-RR. ¿Qué devuelve la consulta?',
    exhibit: [T_EMP],
    codigo: "SELECT last_name, hire_date\nFROM   employees\nWHERE  hire_date LIKE '%03';",
    opciones: [
      { id: 'a', texto: 'Los empleados contratados en un año terminado en 03 (por ejemplo, 2003).' },
      { id: 'b', texto: 'Error ORA-00932, porque LIKE solo funciona con columnas de caracteres.' },
      { id: 'c', texto: 'Los empleados contratados el día 3 de cualquier mes.' },
      { id: 'd', texto: 'Ninguna fila, porque una fecha nunca coincide con un patrón de texto.' }
    ],
    correctas: ['a'],
    explicacion: "Oracle convierte implícitamente HIRE_DATE a texto con NLS_DATE_FORMAT (por ejemplo, '17-JUN-03'). El patrón '%03' busca las cadenas que terminan en 03, es decir, los años 03. Depender de la conversión implícita no es recomendable.",
    porQueNo: {
      b: 'LIKE fuerza la conversión implícita de la fecha a texto; no da error.',
      c: 'Con el formato DD-MON-RR el día está al principio; el patrón %03 mira el final de la cadena.',
      d: 'La fecha se convierte en texto antes de compararla, así que puede coincidir.'
    }
  },
  {
    id: 'X137', examen: 'exam071', tema: 'Variables de sustitución',
    tipo: 'unica',
    enunciado: 'En SQL*Plus se ejecuta el script (sin variables definidas previamente). ¿Cuántas veces se pide al usuario un valor?',
    codigo: 'SELECT &&col FROM employees WHERE ROWNUM = 1;\nUNDEFINE col\nSELECT &col FROM employees WHERE ROWNUM = 1;\nSELECT &col FROM employees WHERE ROWNUM = 1;',
    opciones: [
      { id: 'a', texto: '3' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: '2' },
      { id: 'd', texto: '0' }
    ],
    correctas: ['a'],
    explicacion: '&& pide el valor y lo define (1). UNDEFINE elimina la variable. Después, & pide el valor cada vez sin definirlo, así que se pregunta en las dos consultas siguientes (2 y 3).',
    porQueNo: {
      b: 'UNDEFINE borra el valor guardado por &&, así que las siguientes referencias vuelven a pedirlo.',
      c: 'Un & simple no define la variable: la tercera consulta vuelve a preguntar.',
      d: 'Las variables no estaban definidas al empezar.'
    }
  },
  {
    id: 'X138', examen: 'exam071', tema: 'Variables de sustitución',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar este script en SQL*Plus?',
    codigo: "SET DEFINE OFF\nSELECT 'R&D Department' AS dept FROM dual;",
    opciones: [
      { id: 'a', texto: "Muestra 'R&D Department' sin pedir ningún valor." },
      { id: 'b', texto: 'Pide el valor de la variable D.' },
      { id: 'c', texto: "Muestra 'R Department'." },
      { id: 'd', texto: 'Error: & no está permitido dentro de un literal.' }
    ],
    correctas: ['a'],
    explicacion: 'SET DEFINE OFF desactiva la sustitución de variables, así que & se trata como un carácter normal.',
    porQueNo: {
      b: 'Eso ocurriría con DEFINE ON (el valor por defecto).',
      c: 'Con DEFINE OFF no hay sustitución.',
      d: '& es un carácter válido dentro de un literal.'
    }
  },
{
    id: 'X139', examen: 'exam071', tema: 'DML',
    tipo: 'multiple',
    enunciado: 'Se quiere que el empleado 206 tenga el mismo JOB_ID y SALARY que el empleado 205. ¿Qué dos sentencias lo consiguen? (Elige dos)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: 'UPDATE employees\nSET    (job_id, salary) = (SELECT job_id, salary\n                           FROM   employees\n                           WHERE  employee_id = 205)\nWHERE  employee_id = 206;' },
      { id: 'b', texto: 'UPDATE employees\nSET    job_id = (SELECT job_id FROM employees WHERE employee_id = 205),\n       salary = (SELECT salary FROM employees WHERE employee_id = 205)\nWHERE  employee_id = 206;' },
      { id: 'c', texto: "UPDATE employees\nSET    (job_id, salary) = ('AC_MGR', 12008)\nWHERE  employee_id = 206;" },
      { id: 'd', texto: 'UPDATE employees\nSET    job_id = (SELECT job_id FROM employees WHERE employee_id = 205)\nAND    salary = (SELECT salary FROM employees WHERE employee_id = 205)\nWHERE  employee_id = 206;' },
      { id: 'e', texto: 'UPDATE employees\nSET    (job_id, salary) = (SELECT job_id, salary\n                           FROM   employees)\nWHERE  employee_id = 206;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Se puede asignar una lista de columnas a partir de una subconsulta multicolumna de una sola fila, o asignar cada columna con su propia subconsulta separada por comas.',
    porQueNo: {
      c: 'La forma (col1, col2) = ... solo admite una subconsulta: ORA-01767: UPDATE ... SET expression must be a subquery.',
      d: 'Las asignaciones de SET se separan con comas, no con AND.',
      e: 'La subconsulta devuelve una fila por empleado: ORA-01427.'
    }
  },
  {
    id: 'X140', examen: 'exam071', tema: 'DML',
    tipo: 'multiple',
    enunciado: '¿Qué dos sentencias DELETE son sintácticamente válidas? (Elige dos)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: 'DELETE employees WHERE employee_id = 999;' },
      { id: 'b', texto: 'DELETE FROM (SELECT * FROM employees WHERE department_id = 10)\nWHERE employee_id = 999;' },
      { id: 'c', texto: 'DELETE * FROM employees WHERE employee_id = 999;' },
      { id: 'd', texto: 'DELETE last_name FROM employees WHERE employee_id = 999;' },
      { id: 'e', texto: 'DELETE FROM employees, departments WHERE employee_id = 999;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'En Oracle la palabra FROM es opcional en DELETE, y se puede borrar a través de una vista en línea simple (las filas se eliminan de la tabla base).',
    porQueNo: {
      c: 'DELETE no lleva lista de columnas ni *: borra filas completas.',
      d: 'No se pueden borrar columnas con DELETE; para dejar un valor vacío se usa UPDATE ... SET col = NULL.',
      e: 'DELETE actúa sobre una sola tabla (o vista); no admite una lista de tablas.'
    }
  },
  {
    id: 'X141', examen: 'exam071', tema: 'DML',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la sentencia?',
    exhibit: [T_DEPT],
    codigo: "INSERT INTO departments (department_name, department_id)\nVALUES (300, 'QA');",
    opciones: [
      { id: 'a', texto: 'Error ORA-01722: invalid number.' },
      { id: 'b', texto: "Inserta el departamento 300 con nombre 'QA'." },
      { id: 'c', texto: 'Error: las columnas deben listarse en el orden de la tabla.' },
      { id: 'd', texto: "Inserta un departamento con nombre '300' y DEPARTMENT_ID NULL." }
    ],
    correctas: ['a'],
    explicacion: "Los valores se asignan según el orden de la lista de columnas: DEPARTMENT_NAME recibe 300 (que se convierte implícitamente a '300') y DEPARTMENT_ID recibe 'QA', que no se puede convertir a número.",
    porQueNo: {
      b: 'Los valores no se reordenan según su tipo; se asignan por posición en la lista de columnas.',
      c: 'La lista de columnas puede tener cualquier orden.',
      d: "Oracle intenta poner 'QA' en DEPARTMENT_ID y falla."
    }
  },
  {
    id: 'X142', examen: 'exam071', tema: 'DML',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las sentencias INSERT multitabla son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Un INSERT ALL sin cláusulas WHEN inserta cada fila de la subconsulta en todas las tablas indicadas con INTO.' },
      { id: 'b', texto: 'En INSERT FIRST, cada fila se inserta solo en la tabla de la primera cláusula WHEN que se cumple.' },
      { id: 'c', texto: 'Un INSERT multitabla puede usar solo cláusulas VALUES, sin subconsulta.' },
      { id: 'd', texto: 'La cláusula ELSE es obligatoria en INSERT FIRST.' },
      { id: 'e', texto: 'Un INSERT multitabla puede insertar filas en una vista.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'INSERT ALL incondicional inserta en todas las tablas; INSERT FIRST se detiene en el primer WHEN verdadero. Ambos requieren una subconsulta como origen de las filas.',
    porQueNo: {
      c: 'Un INSERT multitabla siempre termina con una subconsulta (se puede usar SELECT ... FROM dual).',
      d: 'ELSE es opcional: si ningún WHEN se cumple y no hay ELSE, la fila no se inserta.',
      e: 'Los INSERT multitabla no admiten vistas como destino; solo tablas.'
    }
  },
  {
    id: 'X143', examen: 'exam071', tema: 'DML',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Qué contiene TARGET después del MERGE?',
    exhibit: [
      { titulo: 'TARGET', columnas: ['ID', 'VAL'], filas: [['1', '100'], ['2', '200']] },
      { titulo: 'SOURCE', columnas: ['ID', 'VAL'], filas: [['1', '150'], ['2', '50'], ['3', '300']] }
    ],
    codigo: 'MERGE INTO target t\nUSING source s\nON (t.id = s.id)\nWHEN MATCHED THEN\n  UPDATE SET t.val = s.val\n  WHERE s.val > t.val\nWHEN NOT MATCHED THEN\n  INSERT (id, val) VALUES (s.id, s.val)\n  WHERE s.val > 500;',
    opciones: [
      { id: 'a', texto: '(1, 150) y (2, 200)' },
      { id: 'b', texto: '(1, 150), (2, 50) y (3, 300)' },
      { id: 'c', texto: '(1, 150), (2, 200) y (3, 300)' },
      { id: 'd', texto: '(1, 100) y (2, 200)' }
    ],
    correctas: ['a'],
    explicacion: 'La cláusula WHERE de WHEN MATCHED filtra qué filas coincidentes se actualizan: solo la 1 (150 > 100). La WHERE de WHEN NOT MATCHED filtra qué filas se insertan: 300 no supera 500, así que la fila 3 no se inserta.',
    porQueNo: {
      b: 'La fila 2 no se actualiza (50 no es mayor que 200) y la 3 no se inserta.',
      c: 'La condición WHERE s.val > 500 impide insertar la fila 3.',
      d: 'La fila 1 sí cumple 150 > 100 y se actualiza.'
    }
  },
  {
    id: 'X144', examen: 'exam071', tema: 'DML',
    tipo: 'unica',
    enunciado: 'La columna NOTES de la tabla TASKS es VARCHAR2(100), admite NULL y no tiene valor DEFAULT. ¿Qué hace la sentencia?',
    codigo: 'UPDATE tasks\nSET    notes = DEFAULT\nWHERE  task_id = 7;',
    opciones: [
      { id: 'a', texto: 'Pone NOTES a NULL en la tarea 7.' },
      { id: 'b', texto: "Pone el texto 'DEFAULT' en NOTES." },
      { id: 'c', texto: 'Falla porque la columna no tiene DEFAULT definido.' },
      { id: 'd', texto: 'No modifica la fila.' }
    ],
    correctas: ['a'],
    explicacion: 'La palabra clave DEFAULT asigna el valor por defecto de la columna; si no se definió ninguno, el valor por defecto es NULL.',
    porQueNo: {
      b: 'DEFAULT sin comillas es una palabra clave, no un literal.',
      c: 'Toda columna tiene un valor por defecto implícito: NULL.',
      d: 'La fila se actualiza con NULL.'
    }
  },
  {
    id: 'X145', examen: 'exam071', tema: 'Joins',
    tipo: 'multiple',
    enunciado: 'Examina los datos y las dos consultas. ¿Qué dos afirmaciones son verdaderas? (Elige dos)',
    exhibit: [
      { titulo: 'EMP', columnas: ['EMP_ID', 'NAME', 'DEPT_ID'], filas: [['1', 'Ana', '10'], ['2', 'Beto', '20'], ['3', 'Carla', null], ['4', 'Dario', '10'], ['5', 'Eva', '40']] },
      { titulo: 'DEPT', columnas: ['DEPT_ID', 'DNAME'], filas: [['10', 'Ventas'], ['20', 'TI'], ['30', 'RRHH']] }
    ],
    codigo: "-- Consulta 1\nSELECT e.name, d.dname\nFROM   emp e LEFT OUTER JOIN dept d\nON     e.dept_id = d.dept_id AND d.dname = 'Ventas';\n\n-- Consulta 2\nSELECT e.name, d.dname\nFROM   emp e LEFT OUTER JOIN dept d\nON     e.dept_id = d.dept_id\nWHERE  d.dname = 'Ventas';",
    opciones: [
      { id: 'a', texto: 'La consulta 1 devuelve 5 filas.' },
      { id: 'b', texto: 'La consulta 2 devuelve 2 filas.' },
      { id: 'c', texto: 'Ambas consultas devuelven 2 filas.' },
      { id: 'd', texto: 'Ambas consultas devuelven 5 filas.' },
      { id: 'e', texto: 'La consulta 2 devuelve 3 filas.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'En la consulta 1 la condición sobre DNAME forma parte del join externo: se conservan todos los empleados y solo Ana y Dario reciben "Ventas". En la consulta 2 el WHERE se aplica después del join y elimina las filas con DNAME distinto de Ventas o NULL, convirtiéndolo en la práctica en un inner join.',
    porQueNo: {
      c: 'La consulta 1 conserva a todos los empleados porque el filtro está en ON.',
      d: 'El WHERE de la consulta 2 descarta las filas con DNAME NULL o distinto de Ventas.',
      e: 'Solo Ana y Dario pertenecen al departamento Ventas.'
    }
  },
  {
    id: 'X146', examen: 'exam071', tema: 'Joins',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    exhibit: [T_EMP, T_DEPT],
    codigo: 'SELECT last_name, department_name\nFROM   employees NATURAL JOIN departments\nON     (employees.department_id = departments.department_id);',
    opciones: [
      { id: 'a', texto: 'Falla: NATURAL JOIN no admite una cláusula ON ni USING.' },
      { id: 'b', texto: 'Se ejecuta usando solo la condición del ON.' },
      { id: 'c', texto: 'Se ejecuta combinando la condición del ON con las columnas comunes.' },
      { id: 'd', texto: 'Se ejecuta como un producto cartesiano.' }
    ],
    correctas: ['a'],
    explicacion: 'NATURAL JOIN determina por sí mismo las columnas de unión (todas las de igual nombre), así que no acepta ON ni USING. La sentencia produce un error de sintaxis (ORA-00933).',
    porQueNo: {
      b: 'Para usar una condición propia se escribe JOIN ... ON, sin NATURAL.',
      c: 'Oracle no combina ambas formas; rechaza la sentencia.',
      d: 'No se ejecuta en absoluto.'
    }
  },
  {
    id: 'X147', examen: 'exam071', tema: 'Joins',
    tipo: 'unica',
    enunciado: 'DEPARTMENTS tiene 8 filas y exactamente 3 empleados pertenecen al departamento 90. ¿Cuántas filas devuelve la consulta?',
    exhibit: [T_EMP, T_DEPT],
    codigo: 'SELECT e.last_name, d.department_name\nFROM   employees e, departments d\nWHERE  e.department_id = 90;',
    opciones: [
      { id: 'a', texto: '24' },
      { id: 'b', texto: '3' },
      { id: 'c', texto: '1' },
      { id: 'd', texto: '11' }
    ],
    correctas: ['a'],
    explicacion: 'No hay condición de join entre las tablas, así que se forma un producto cartesiano. El WHERE solo filtra los empleados: 3 empleados × 8 departamentos = 24 filas.',
    porQueNo: {
      b: 'Sería el resultado con la condición de join e.department_id = d.department_id.',
      c: 'El filtro no restringe DEPARTMENTS; cada empleado se combina con todos los departamentos.',
      d: 'El producto cartesiano multiplica, no suma.'
    }
  },
  {
    id: 'X148', examen: 'exam071', tema: 'Joins',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre el operador de join externo de Oracle (+) son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Se coloca junto a la columna de la tabla que puede no tener filas coincidentes.' },
      { id: 'b', texto: 'No se puede obtener un full outer join colocando (+) en ambos lados de la condición.' },
      { id: 'c', texto: 'Puede combinarse con la sintaxis ANSI (JOIN ... ON) en el mismo bloque de consulta.' },
      { id: 'd', texto: 'Puede usarse en una condición combinada con OR.' },
      { id: 'e', texto: 'Se escribe en la lista del SELECT para indicar qué columnas pueden ser NULL.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'El (+) marca el lado "deficiente" del join. Poner (+) en ambos lados produce ORA-01468; para un full outer join se usa FULL OUTER JOIN (o una UNION de dos outer joins).',
    porQueNo: {
      c: 'Mezclar ambas sintaxis produce ORA-25156: old style outer join (+) cannot be used with ANSI joins.',
      d: 'ORA-01719: outer join operator (+) not allowed in operand of OR or IN.',
      e: '(+) solo se usa en las condiciones de join del WHERE.'
    }
  },
  {
    id: 'X149', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'unica',
    enunciado: 'T tiene una clave primaria en C y está vacía. ¿Cuántas filas tiene T al final?',
    codigo: 'INSERT INTO t (c) VALUES (1);\nINSERT INTO t (c)\n  SELECT LEVEL FROM dual CONNECT BY LEVEL <= 3;  -- genera 1, 2 y 3\nCOMMIT;',
    opciones: [
      { id: 'a', texto: '1' },
      { id: 'b', texto: '3' },
      { id: 'c', texto: '0' },
      { id: 'd', texto: '2' }
    ],
    correctas: ['a'],
    explicacion: 'El segundo INSERT falla con ORA-00001 al intentar insertar el 1 duplicado. Oracle hace un rollback a nivel de sentencia: se deshacen todas las filas de ese INSERT (incluidas 2 y 3), pero la transacción y el primer INSERT continúan. El COMMIT confirma una fila.',
    porQueNo: {
      b: 'Una sentencia DML es atómica: si falla, ninguna de sus filas queda insertada.',
      c: 'El error de una sentencia no deshace las sentencias anteriores de la transacción.',
      d: 'Las filas 2 y 3 se deshacen junto con el resto de la sentencia que falló.'
    }
  },
  {
    id: 'X150', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'unica',
    enunciado: 'La tabla LOG_T ya existe y está vacía. ¿Cuántas filas tiene LOG_T al final?',
    codigo: "INSERT INTO log_t VALUES (1);\nCREATE TABLE log_t (c NUMBER);   -- falla con ORA-00955\nROLLBACK;",
    opciones: [
      { id: 'a', texto: '1' },
      { id: 'b', texto: '0' },
      { id: 'c', texto: 'Depende de si AUTOCOMMIT está activado.' },
      { id: 'd', texto: 'El ROLLBACK falla porque la transacción terminó con error.' }
    ],
    correctas: ['a'],
    explicacion: 'Una sentencia DDL hace COMMIT implícito antes de ejecutarse. Aquí el CREATE TABLE se analiza correctamente y falla al ejecutarse (el nombre ya existe), pero el INSERT pendiente ya quedó confirmado, así que el ROLLBACK no tiene nada que deshacer. (Si el DDL tuviera un error de sintaxis, fallaría antes y no habría commit.)',
    porQueNo: {
      b: 'El commit implícito ocurre antes de intentar crear la tabla, aunque esta creación falle.',
      c: 'El commit implícito del DDL no depende de AUTOCOMMIT.',
      d: 'ROLLBACK sin transacción activa simplemente no hace nada.'
    }
  },
  {
    id: 'X151', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'unica',
    enunciado: 'T está vacía. ¿Cuántas filas tiene T al final?',
    codigo: 'INSERT INTO t VALUES (1);\nSAVEPOINT a;\nINSERT INTO t VALUES (2);\nSAVEPOINT a;\nINSERT INTO t VALUES (3);\nROLLBACK TO SAVEPOINT a;\nCOMMIT;',
    opciones: [
      { id: 'a', texto: '2' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: '3' },
      { id: 'd', texto: 'Error: el savepoint A ya existe.' }
    ],
    correctas: ['a'],
    explicacion: 'Crear un savepoint con un nombre ya usado en la transacción mueve ese savepoint a la posición actual (el anterior se pierde). ROLLBACK TO a deshace solo el INSERT de 3.',
    porQueNo: {
      b: 'El segundo SAVEPOINT a reemplaza al primero, que quedaba antes del INSERT de 2.',
      c: 'El INSERT de 3 ocurrió después del savepoint y se deshace.',
      d: 'Reutilizar un nombre de savepoint es válido.'
    }
  },
  {
    id: 'X152', examen: 'exam071', tema: 'Control de transacciones',
    tipo: 'multiple',
    enunciado: '¿Qué tres afirmaciones sobre COMMIT son verdaderas? (Elige tres)',
    opciones: [
      { id: 'a', texto: 'Libera los bloqueos de fila obtenidos por la transacción.' },
      { id: 'b', texto: 'Hace visibles los cambios para las demás sesiones.' },
      { id: 'c', texto: 'Elimina todos los savepoints de la transacción.' },
      { id: 'd', texto: 'Puede deshacerse con un ROLLBACK inmediato.' },
      { id: 'e', texto: 'Confirma solo los cambios hechos desde el último savepoint.' },
      { id: 'f', texto: 'Si la sesión termina de forma anormal, sus cambios pendientes se confirman automáticamente.' }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: 'COMMIT hace permanentes todos los cambios de la transacción, los hace visibles, libera bloqueos y borra los savepoints.',
    porQueNo: {
      d: 'Un COMMIT es definitivo: ROLLBACK no puede deshacer cambios ya confirmados.',
      e: 'COMMIT confirma toda la transacción, sin importar los savepoints.',
      f: 'Si la sesión termina de forma anormal, Oracle hace ROLLBACK de los cambios pendientes.'
    }
  },
  {
    id: 'X153', examen: 'exam071', tema: 'FETCH FIRST y OFFSET',
    tipo: 'unica',
    enunciado: 'EMPLOYEES tiene 21 filas. ¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT last_name\nFROM   employees\nORDER BY last_name\nOFFSET 25 ROWS FETCH NEXT 5 ROWS ONLY;',
    opciones: [
      { id: 'a', texto: 'No devuelve filas, sin error.' },
      { id: 'b', texto: 'Devuelve las últimas 5 filas.' },
      { id: 'c', texto: 'Error: OFFSET mayor que el número de filas.' },
      { id: 'd', texto: 'Devuelve las primeras 5 filas.' }
    ],
    correctas: ['a'],
    explicacion: 'Si OFFSET es mayor o igual que el número de filas del resultado, simplemente no se devuelve ninguna fila.',
    porQueNo: {
      b: 'Oracle no ajusta el OFFSET al final del resultado.',
      c: 'Un OFFSET grande no es un error.',
      d: 'OFFSET no se reinicia ni se ignora.'
    }
  },
  {
    id: 'X154', examen: 'exam071', tema: 'FETCH FIRST y OFFSET',
    tipo: 'unica',
    enunciado: 'Los valores de DEPARTMENT_ID en EMPLOYEES son 10, 20, 50, 60, 80, 90, 110 y NULL (con repeticiones). ¿Qué devuelve la consulta?',
    codigo: 'SELECT DISTINCT department_id\nFROM   employees\nORDER BY department_id\nFETCH FIRST 3 ROWS ONLY;',
    opciones: [
      { id: 'a', texto: '10, 20 y 50' },
      { id: 'b', texto: 'NULL, 10 y 20' },
      { id: 'c', texto: 'Los tres primeros valores encontrados, con posibles repeticiones' },
      { id: 'd', texto: 'Error: FETCH no puede combinarse con DISTINCT' }
    ],
    correctas: ['a'],
    explicacion: 'Primero se eliminan los duplicados, luego se ordena (en ASC los NULL van al final) y por último se limitan las filas.',
    porQueNo: {
      b: 'En orden ascendente los NULL van al final por defecto.',
      c: 'FETCH se aplica después de DISTINCT y ORDER BY.',
      d: 'FETCH es compatible con DISTINCT.'
    }
  },
  {
    id: 'X155', examen: 'exam071', tema: 'FETCH FIRST y OFFSET',
    tipo: 'multiple',
    enunciado: 'SALARY no contiene NULL. ¿Qué dos consultas devuelven siempre a los 3 empleados mejor pagados? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'SELECT last_name, salary\nFROM   employees\nORDER BY salary DESC\nFETCH FIRST 3 ROWS ONLY;' },
      { id: 'b', texto: 'SELECT last_name, salary\nFROM   (SELECT last_name, salary\n        FROM   employees\n        ORDER BY salary DESC)\nWHERE  ROWNUM <= 3;' },
      { id: 'c', texto: 'SELECT last_name, salary\nFROM   employees\nWHERE  ROWNUM <= 3\nORDER BY salary DESC;' },
      { id: 'd', texto: 'SELECT last_name, salary\nFROM   employees\nORDER BY salary\nFETCH FIRST 3 ROWS ONLY;' },
      { id: 'e', texto: 'SELECT last_name, salary\nFROM   employees\nWHERE  ROWNUM > 0 AND ROWNUM < 4\nORDER BY salary DESC;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Para un top-N hay que ordenar antes de limitar: con FETCH FIRST (que se aplica después de ORDER BY) o con ROWNUM sobre una vista en línea ya ordenada.',
    porQueNo: {
      c: 'ROWNUM se asigna antes del ORDER BY: toma 3 filas cualesquiera y luego las ordena.',
      d: 'El orden ascendente devuelve los 3 salarios más bajos.',
      e: 'Igual que filtrar con ROWNUM <= 3: limita antes de ordenar.'
    }
  },
  {
    id: 'X156', examen: 'exam071', tema: 'Diccionario de datos',
    tipo: 'unica',
    enunciado: '¿Qué vista del diccionario permite saber en qué columnas está definida cada restricción de las tablas del usuario?',
    opciones: [
      { id: 'a', texto: 'USER_CONS_COLUMNS' },
      { id: 'b', texto: 'USER_CONSTRAINTS' },
      { id: 'c', texto: 'USER_TAB_COLUMNS' },
      { id: 'd', texto: 'USER_IND_COLUMNS' }
    ],
    correctas: ['a'],
    explicacion: 'USER_CONS_COLUMNS relaciona cada restricción (CONSTRAINT_NAME) con sus columnas y su posición.',
    porQueNo: {
      b: 'USER_CONSTRAINTS muestra el tipo, el estado y la condición de cada restricción, pero no sus columnas.',
      c: 'USER_TAB_COLUMNS describe las columnas de las tablas, no las restricciones.',
      d: 'USER_IND_COLUMNS muestra las columnas de los índices, no de las restricciones.'
    }
  },
  {
    id: 'X157', examen: 'exam071', tema: 'Diccionario de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre el diccionario de datos son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'La vista DICTIONARY lista los nombres y descripciones de las vistas del diccionario.' },
      { id: 'b', texto: 'USER_OBJECTS muestra los objetos de todos los tipos que pertenecen al usuario, incluido su estado (VALID o INVALID).' },
      { id: 'c', texto: "La consulta WHERE table_name = 'employees' sobre USER_TABLES encuentra la tabla EMPLOYEES creada sin comillas." },
      { id: 'd', texto: 'USER_SEQUENCES muestra el valor CURRVAL de cada secuencia.' },
      { id: 'e', texto: 'El diccionario de datos solo se actualiza al ejecutar COMMIT después de un DDL.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'DICTIONARY (o DICT) es el punto de partida para descubrir las vistas del diccionario. USER_OBJECTS cubre tablas, vistas, índices, secuencias, sinónimos, código PL/SQL, etc.',
    porQueNo: {
      c: "Los nombres creados sin comillas se guardan en mayúsculas; hay que buscar 'EMPLOYEES'.",
      d: 'USER_SEQUENCES muestra LAST_NUMBER (el último número reservado en disco); CURRVAL es propio de cada sesión.',
      e: 'El DDL actualiza el diccionario inmediatamente (y además hace commit implícito).'
    }
  },
  {
    id: 'X158', examen: 'exam071', tema: 'Diccionario de datos',
    tipo: 'unica',
    enunciado: '¿Qué valor muestra LAST_NUMBER?',
    codigo: "CREATE SEQUENCE s_inv START WITH 1 INCREMENT BY 1 CACHE 20;\nSELECT s_inv.NEXTVAL FROM dual;\nSELECT last_number FROM user_sequences WHERE sequence_name = 'S_INV';",
    opciones: [
      { id: 'a', texto: '21' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: '2' },
      { id: 'd', texto: '20' }
    ],
    correctas: ['a'],
    explicacion: 'Con CACHE 20, el primer NEXTVAL reserva en memoria los valores 1 a 20, y el diccionario registra como LAST_NUMBER el siguiente valor a reservar: 21.',
    porQueNo: {
      b: '1 es el valor devuelto por NEXTVAL, no LAST_NUMBER.',
      c: 'Sería el resultado con NOCACHE.',
      d: 'LAST_NUMBER indica el primer valor no reservado, 21.'
    }
  },
  {
    id: 'X159', examen: 'exam071', tema: 'Diccionario de datos',
    tipo: 'unica',
    enunciado: "Se ejecuta `COMMENT ON COLUMN employees.salary IS 'Monthly salary in USD';`. ¿Qué vista del diccionario muestra ese comentario?",
    opciones: [
      { id: 'a', texto: 'USER_COL_COMMENTS' },
      { id: 'b', texto: 'USER_TAB_COMMENTS' },
      { id: 'c', texto: 'USER_TAB_COLUMNS' },
      { id: 'd', texto: 'USER_COMMENTS' }
    ],
    correctas: ['a'],
    explicacion: 'Los comentarios de columnas se consultan en USER_COL_COMMENTS (o ALL_/DBA_); los de tablas y vistas, en USER_TAB_COMMENTS.',
    porQueNo: {
      b: 'USER_TAB_COMMENTS guarda los comentarios de tablas y vistas, no de columnas.',
      c: 'USER_TAB_COLUMNS no incluye comentarios.',
      d: 'No existe una vista USER_COMMENTS.'
    }
  },
  {
    id: 'X160', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'multiple',
    enunciado: '¿Qué dos datos muestra el comando DESCRIBE employees en SQL*Plus? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Los nombres y tipos de datos de las columnas.' },
      { id: 'b', texto: 'Si cada columna admite NULL o es NOT NULL.' },
      { id: 'c', texto: 'Qué columnas forman la clave primaria.' },
      { id: 'd', texto: 'Los valores DEFAULT de las columnas.' },
      { id: 'e', texto: 'El número de filas de la tabla.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'DESCRIBE muestra tres columnas: Name, Null? (NOT NULL cuando aplica) y Type.',
    porQueNo: {
      c: 'Las claves primarias se consultan en USER_CONSTRAINTS y USER_CONS_COLUMNS.',
      d: 'Los valores por defecto están en USER_TAB_COLUMNS (DATA_DEFAULT).',
      e: 'DESCRIBE no cuenta filas.'
    }
  },
  {
    id: 'X161', examen: 'exam071', tema: 'Sentencia SELECT',
    tipo: 'unica',
    enunciado: 'El empleado 210 se apellida Lopez y tiene SALARY NULL. ¿Qué devuelve la consulta?',
    codigo: "SELECT last_name || ' earns ' || salary || ' monthly' AS info\nFROM   employees\nWHERE  employee_id = 210;",
    opciones: [
      { id: 'a', texto: 'Lopez earns  monthly' },
      { id: 'b', texto: 'NULL' },
      { id: 'c', texto: 'Lopez earns 0 monthly' },
      { id: 'd', texto: 'Lopez earns NULL monthly' }
    ],
    correctas: ['a'],
    explicacion: 'En una concatenación, Oracle trata NULL como una cadena vacía, así que el resto del texto se conserva (con dos espacios seguidos).',
    porQueNo: {
      b: 'A diferencia de la aritmética, la concatenación con NULL no da NULL.',
      c: 'NULL no se convierte en 0.',
      d: 'No se muestra la palabra NULL; el valor simplemente no aporta texto.'
    }
  },
  {
    id: 'X162', examen: 'exam071', tema: 'Privilegios y roles',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los privilegios son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Un usuario con SELECT sobre una vista puede consultarla aunque no tenga privilegios sobre las tablas base.' },
      { id: 'b', texto: 'El privilegio de sistema CREATE TABLE permite crear tablas en el propio esquema.' },
      { id: 'c', texto: 'El privilegio CREATE TABLE permite crear tablas en cualquier esquema.' },
      { id: 'd', texto: 'Un usuario puede otorgar privilegios sobre cualquier tabla que pueda consultar.' },
      { id: 'e', texto: 'Para insertar filas en su propia tabla, el dueño necesita el privilegio de objeto INSERT.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Las vistas permiten exponer datos sin dar acceso a las tablas base. CREATE TABLE es un privilegio de sistema para el propio esquema; para otros esquemas se necesita CREATE ANY TABLE.',
    porQueNo: {
      c: 'Para crear tablas en otros esquemas se requiere CREATE ANY TABLE.',
      d: 'Para otorgar privilegios sobre objetos ajenos se necesita haberlos recibido WITH GRANT OPTION.',
      e: 'El dueño de un objeto tiene todos los privilegios sobre él sin necesidad de otorgárselos.'
    }
  },
  {
    id: 'X163', examen: 'exam071', tema: 'Privilegios y roles',
    tipo: 'unica',
    enunciado: 'El usuario ANA es dueña de la secuencia ORD_SEQ. ¿Qué privilegio necesita LUIS para ejecutar `SELECT ana.ord_seq.NEXTVAL FROM dual;`?',
    opciones: [
      { id: 'a', texto: 'SELECT sobre ana.ord_seq' },
      { id: 'b', texto: 'ALTER sobre ana.ord_seq' },
      { id: 'c', texto: 'EXECUTE sobre ana.ord_seq' },
      { id: 'd', texto: 'Ninguno: las secuencias son accesibles para todos los usuarios.' }
    ],
    correctas: ['a'],
    explicacion: 'Los privilegios de objeto de una secuencia son SELECT (para usar NEXTVAL y CURRVAL) y ALTER (para modificarla).',
    porQueNo: {
      b: 'ALTER permite cambiar los parámetros de la secuencia, no obtener valores.',
      c: 'EXECUTE se aplica a procedimientos, funciones, paquetes y tipos.',
      d: 'Sin privilegio, el usuario recibe ORA-00942 (o ORA-02289).'
    }
  },
  {
    id: 'X164', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'multiple',
    enunciado: 'La vista V_EMP ya existe y se otorgó SELECT sobre ella a otro usuario. ¿Qué dos afirmaciones sobre CREATE OR REPLACE VIEW v_emp AS ... son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Conserva los privilegios de objeto ya otorgados sobre la vista.' },
      { id: 'b', texto: 'Permite cambiar la consulta de la vista sin eliminarla antes.' },
      { id: 'c', texto: 'Falla porque la vista ya existe.' },
      { id: 'd', texto: 'Es equivalente a ALTER VIEW v_emp, que también permite cambiar la consulta.' },
      { id: 'e', texto: 'Elimina las filas de la tabla base para regenerar la vista.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'OR REPLACE redefine la vista conservando sus privilegios. Si se hiciera DROP y CREATE, habría que volver a otorgarlos.',
    porQueNo: {
      c: 'OR REPLACE existe precisamente para sustituir una vista existente.',
      d: 'ALTER VIEW solo recompila la vista o gestiona restricciones; no cambia su consulta.',
      e: 'Las vistas no almacenan datos y no afectan a la tabla base.'
    }
  },
  {
    id: 'X165', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la sentencia?',
    codigo: 'CREATE VIEW v_annual AS\n  SELECT last_name, salary * 12\n  FROM   employees;',
    opciones: [
      { id: 'a', texto: 'Error ORA-00998: must name this expression with a column alias.' },
      { id: 'b', texto: 'Se crea la vista con una columna llamada SALARY*12.' },
      { id: 'c', texto: 'Se crea la vista con una columna llamada SALARY.' },
      { id: 'd', texto: 'Se crea la vista en estado INVALID.' }
    ],
    correctas: ['a'],
    explicacion: 'Cada columna de una vista necesita un nombre válido. Una expresión debe tener alias en la consulta, o la vista debe declarar la lista de columnas: CREATE VIEW v_annual (name, annual) AS ...',
    porQueNo: {
      b: 'En un SELECT normal el encabezado sería SALARY*12, pero eso no es un nombre válido para una columna de vista.',
      c: 'Oracle no deriva el nombre de la columna dentro de la expresión.',
      d: 'Es un error al crear la vista, no una vista inválida.'
    }
  },
  {
    id: 'X166', examen: 'exam071', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'La tabla CLIENTS tiene filas con valores repetidos en CODE. ¿Qué ocurre al ejecutar la sentencia?',
    codigo: 'ALTER TABLE clients\n  ADD CONSTRAINT clients_pk PRIMARY KEY (code);',
    opciones: [
      { id: 'a', texto: 'Error ORA-02437: cannot validate (CLIENTS_PK) - primary key violated.' },
      { id: 'b', texto: 'Se crea la PK y se eliminan los duplicados.' },
      { id: 'c', texto: 'Se crea la PK, que solo se valida en las filas nuevas.' },
      { id: 'd', texto: 'Se crea la PK en estado DISABLED.' }
    ],
    correctas: ['a'],
    explicacion: 'Al añadir una restricción habilitada, Oracle valida por defecto las filas existentes (ENABLE VALIDATE). Los duplicados impiden crear la PK.',
    porQueNo: {
      b: 'Oracle nunca borra datos para satisfacer una restricción.',
      c: 'Por defecto se validan también las filas existentes.',
      d: 'Por defecto la restricción se intenta crear habilitada; al fallar la validación no se crea.'
    }
  },
  {
    id: 'X167', examen: 'exam071', tema: 'Restricciones',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las restricciones CHECK son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Pueden comparar varias columnas de la misma fila, por ejemplo CHECK (end_date > start_date).' },
      { id: 'b', texto: 'No pueden usar SYSDATE en su condición.' },
      { id: 'c', texto: 'Pueden contener subconsultas a otras tablas.' },
      { id: 'd', texto: 'Rechazan las filas en las que la condición se evalúa como UNKNOWN.' },
      { id: 'e', texto: 'Solo pueden definirse a nivel de columna.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Una CHECK se evalúa sobre la fila que se inserta o modifica, y debe ser determinista: no admite SYSDATE, USER, subconsultas ni pseudocolumnas como ROWNUM (ORA-02436 para SYSDATE).',
    porQueNo: {
      c: 'Las subconsultas no están permitidas en una CHECK (ORA-02251).',
      d: 'Una CHECK solo rechaza la fila si la condición es FALSE; UNKNOWN (por ejemplo, con NULL) se acepta.',
      e: 'Pueden definirse a nivel de columna o de tabla; las que comparan columnas suelen definirse a nivel de tabla.'
    }
  },
{
    id: 'X168', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'multiple',
    enunciado: 'Los apellidos se guardan con distintas combinaciones de mayúsculas y minúsculas. ¿Qué dos condiciones devuelven todos los apellidos que empiezan con la letra K, ya sea mayúscula o minúscula? (Elige dos)',
    opciones: [
      { id: 'a', texto: "WHERE UPPER(last_name) LIKE 'K%'" },
      { id: 'b', texto: "WHERE last_name LIKE 'K%' OR last_name LIKE 'k%'" },
      { id: 'c', texto: "WHERE last_name LIKE 'k%'" },
      { id: 'd', texto: "WHERE last_name = 'K%'" },
      { id: 'e', texto: "WHERE LOWER(last_name) LIKE 'K%'" }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Por defecto las comparaciones de texto distinguen mayúsculas y minúsculas. Se puede normalizar el valor con UPPER (y comparar con un patrón en mayúsculas) o contemplar ambos casos con OR.',
    porQueNo: {
      c: 'Solo encuentra los apellidos que empiezan con k minúscula.',
      d: 'Con = el % no es comodín: busca el texto literal "K%".',
      e: 'LOWER convierte todo a minúsculas, así que nunca coincidirá con un patrón que empieza con K mayúscula.'
    }
  },
  {
    id: 'X169', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos condiciones son equivalentes a `salary BETWEEN 5000 AND 10000`? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'salary >= 5000 AND salary <= 10000' },
      { id: 'b', texto: 'NOT (salary < 5000 OR salary > 10000)' },
      { id: 'c', texto: 'salary > 5000 AND salary < 10000' },
      { id: 'd', texto: 'salary IN (5000, 10000)' },
      { id: 'e', texto: 'salary BETWEEN 10000 AND 5000' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'BETWEEN incluye ambos límites. Por la ley de De Morgan, NOT (x < a OR x > b) equivale a x >= a AND x <= b (también con NULL, que da UNKNOWN en ambos casos).',
    porQueNo: {
      c: 'Excluye los límites 5000 y 10000.',
      d: 'Solo coincide con los dos valores exactos, no con el rango.',
      e: 'Con los límites invertidos ninguna fila cumple la condición.'
    }
  },
  {
    id: 'X170', examen: 'exam071', tema: 'Restricción y ordenamiento de datos',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿En qué orden se devuelven las filas?',
    exhibit: [{ titulo: 'STAFF', columnas: ['NAME', 'DEPT', 'SALARY'], filas: [['Ana', '10', '3000'], ['Beto', null, '5000'], ['Carla', '10', '4000'], ['Dario', '20', '1000']] }],
    codigo: 'SELECT name\nFROM   staff\nORDER BY dept NULLS FIRST, salary DESC;',
    opciones: [
      { id: 'a', texto: 'Beto, Carla, Ana, Dario' },
      { id: 'b', texto: 'Carla, Ana, Dario, Beto' },
      { id: 'c', texto: 'Beto, Ana, Carla, Dario' },
      { id: 'd', texto: 'Beto, Dario, Carla, Ana' }
    ],
    correctas: ['a'],
    explicacion: 'Primero se ordena por DEPT ascendente con los NULL al principio (Beto). Dentro del departamento 10, por salario descendente: Carla (4000) y luego Ana (3000). Por último, el departamento 20 (Dario).',
    porQueNo: {
      b: 'NULLS FIRST coloca a Beto al principio, no al final.',
      c: 'Dentro del departamento 10 el salario se ordena de forma descendente.',
      d: 'DEPT se ordena de forma ascendente: el 10 va antes que el 20.'
    }
  },
  {
    id: 'X171', examen: 'exam071', tema: 'Funciones de una fila',
    tipo: 'multiple',
    enunciado: "¿Qué tres expresiones devuelven exactamente 'ABC'? (Elige tres)",
    opciones: [
      { id: 'a', texto: "UPPER('abc')" },
      { id: 'b', texto: "SUBSTR('XABCX', 2, 3)" },
      { id: 'c', texto: "LTRIM('  ABC')" },
      { id: 'd', texto: "RTRIM('ABC   ', 'C')" },
      { id: 'e', texto: "TRANSLATE('ABC', 'ABC', 'abc')" },
      { id: 'f', texto: "CONCAT('A', 'BC ')" }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: "UPPER convierte a mayúsculas, SUBSTR extrae 3 caracteres desde la posición 2 y LTRIM sin segundo argumento elimina los espacios iniciales.",
    porQueNo: {
      d: "RTRIM con 'C' solo quita C del final, pero la cadena termina en espacios, así que no cambia: 'ABC   '.",
      e: "TRANSLATE convierte cada letra a minúscula: 'abc'.",
      f: "El resultado conserva el espacio final: 'ABC '."
    }
  },
  {
    id: 'X172', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'multiple',
    enunciado: 'NLS_DATE_FORMAT es DD-MON-RR. ¿Qué dos expresiones devuelven el 1 de enero de 2025 como DATE sin error? (Elige dos)',
    opciones: [
      { id: 'a', texto: "TO_DATE('2025-01-01', 'YYYY-MM-DD')" },
      { id: 'b', texto: "DATE '2025-01-01'" },
      { id: 'c', texto: "DATE '01-JAN-2025'" },
      { id: 'd', texto: "TO_DATE('2025-01-01')" },
      { id: 'e', texto: 'TO_DATE(20250101)' }
    ],
    correctas: ['a', 'b'],
    explicacion: "TO_DATE con un modelo que coincide con el texto funciona siempre. El literal ANSI DATE usa siempre el formato 'YYYY-MM-DD', sin importar NLS_DATE_FORMAT.",
    porQueNo: {
      c: "El literal DATE exige el formato YYYY-MM-DD: falla (ORA-01843 en este caso).",
      d: "Sin modelo, TO_DATE usa NLS_DATE_FORMAT (DD-MON-RR), que no coincide: ORA-01861.",
      e: "El número se convierte a texto '20250101' y se interpreta con DD-MON-RR: ORA-01861."
    }
  },
  {
    id: 'X173', examen: 'exam071', tema: 'Funciones de conversión y expresiones condicionales',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: "SELECT TO_DATE('1-JAN-2025', 'fxDD-MON-YYYY')\nFROM   dual;",
    opciones: [
      { id: 'a', texto: 'Error ORA-01862: the numeric value does not match the length of the format item.' },
      { id: 'b', texto: 'Devuelve el 1 de enero de 2025.' },
      { id: 'c', texto: 'Devuelve el 10 de enero de 2025.' },
      { id: 'd', texto: 'Error ORA-01843: not a valid month.' }
    ],
    correctas: ['a'],
    explicacion: "El modificador fx (format exact) exige que el texto coincida exactamente con el modelo: DD requiere dos dígitos, así que '1' no es válido. Sin fx, Oracle aceptaría '1-JAN-2025'.",
    porQueNo: {
      b: 'Ese sería el resultado sin el modificador fx.',
      c: 'Oracle no rellena el día con un cero a la derecha.',
      d: 'El mes JAN es válido; el problema es la longitud del día.'
    }
  },
  {
    id: 'X174', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'multiple',
    enunciado: 'Algunos empleados tienen DEPARTMENT_ID NULL. ¿Qué dos consultas devuelven el número de departamentos distintos que tienen empleados asignados? (Elige dos)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: 'SELECT COUNT(DISTINCT department_id)\nFROM   employees;' },
      { id: 'b', texto: 'SELECT COUNT(*)\nFROM   (SELECT DISTINCT department_id\n        FROM   employees\n        WHERE  department_id IS NOT NULL);' },
      { id: 'c', texto: 'SELECT COUNT(department_id)\nFROM   employees;' },
      { id: 'd', texto: 'SELECT DISTINCT COUNT(department_id)\nFROM   employees;' },
      { id: 'e', texto: 'SELECT COUNT(*)\nFROM   (SELECT DISTINCT department_id\n        FROM   employees);' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'COUNT(DISTINCT col) cuenta los valores distintos no nulos. La vista en línea con DISTINCT y el filtro IS NOT NULL obtiene el mismo número.',
    porQueNo: {
      c: 'Cuenta todas las filas con departamento (con repeticiones), no los departamentos distintos.',
      d: 'DISTINCT se aplica al resultado (una sola fila con el conteo total), no dentro de COUNT.',
      e: 'DISTINCT conserva una fila con NULL, que COUNT(*) sí cuenta: da un valor de más.'
    }
  },
  {
    id: 'X175', examen: 'exam071', tema: 'Funciones de grupo y GROUP BY',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    exhibit: [T_EMP],
    codigo: 'SELECT department_id, MAX(salary)\nFROM   employees\nGROUP BY department_id\nORDER BY MIN(salary);',
    opciones: [
      { id: 'a', texto: 'Se ejecuta y ordena los departamentos por su salario mínimo, aunque este no se muestre.' },
      { id: 'b', texto: 'Error ORA-00979, porque MIN(salary) no está en la lista del SELECT.' },
      { id: 'c', texto: 'Error: ORDER BY no admite funciones de grupo.' },
      { id: 'd', texto: 'Se ejecuta, pero ignora el ORDER BY.' }
    ],
    correctas: ['a'],
    explicacion: 'En una consulta agrupada, ORDER BY puede usar cualquier expresión válida para el grupo: columnas del GROUP BY o funciones de grupo, aunque no aparezcan en el SELECT.',
    porQueNo: {
      b: 'Las funciones de grupo no necesitan aparecer en el SELECT para usarse en ORDER BY.',
      c: 'ORDER BY admite funciones de grupo cuando la consulta agrupa.',
      d: 'El ORDER BY se aplica normalmente.'
    }
  },
  {
    id: 'X176', examen: 'exam071', tema: 'Joins',
    tipo: 'multiple',
    enunciado: '¿Qué dos cláusulas FROM unen correctamente EMPLOYEES, DEPARTMENTS y JOBS? (Elige dos)',
    exhibit: [T_EMP, T_DEPT, { titulo: 'JOBS', estructura: [['JOB_ID', 'VARCHAR2(10)', 'PRIMARY KEY'], ['JOB_TITLE', 'VARCHAR2(35)', 'NOT NULL'], ['MIN_SALARY', 'NUMBER(6)', ''], ['MAX_SALARY', 'NUMBER(6)', '']] }],
    opciones: [
      { id: 'a', texto: 'FROM employees e\nJOIN departments d ON e.department_id = d.department_id\nJOIN jobs j        ON e.job_id = j.job_id' },
      { id: 'b', texto: 'FROM employees e\nJOIN departments d USING (department_id)\nJOIN jobs j        USING (job_id)' },
      { id: 'c', texto: 'FROM employees e, departments d\nJOIN jobs j ON e.job_id = j.job_id\nWHERE e.department_id = d.department_id' },
      { id: 'd', texto: 'FROM employees e\nJOIN departments d ON (department_id)\nJOIN jobs j        ON (job_id)' },
      { id: 'e', texto: 'FROM employees e\nNATURAL JOIN departments d USING (department_id)\nJOIN jobs j USING (job_id)' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los joins ANSI se encadenan de izquierda a derecha, cada uno con su propia condición ON o USING.',
    porQueNo: {
      c: 'Al mezclar coma y JOIN, el ON solo "ve" las tablas de su propio join (departments y jobs): ORA-00904: "E"."JOB_ID": invalid identifier.',
      d: 'ON requiere una condición completa; una columna sola no es una condición.',
      e: 'NATURAL JOIN no admite USING.'
    }
  },
  {
    id: 'X177', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'multiple',
    enunciado: '¿Qué dos consultas devuelven los empleados que ganan más que todos los empleados del departamento 60? (Elige dos)',
    exhibit: [T_EMP],
    opciones: [
      { id: 'a', texto: 'SELECT last_name FROM employees\nWHERE  salary > ALL (SELECT salary FROM employees\n                     WHERE  department_id = 60);' },
      { id: 'b', texto: 'SELECT last_name FROM employees\nWHERE  salary > (SELECT MAX(salary) FROM employees\n                 WHERE  department_id = 60);' },
      { id: 'c', texto: 'SELECT last_name FROM employees\nWHERE  salary > ANY (SELECT salary FROM employees\n                     WHERE  department_id = 60);' },
      { id: 'd', texto: 'SELECT last_name FROM employees\nWHERE  salary > (SELECT salary FROM employees\n                 WHERE  department_id = 60);' },
      { id: 'e', texto: 'SELECT last_name FROM employees\nWHERE  salary IN (SELECT MAX(salary) FROM employees\n                  WHERE  department_id = 60);' }
    ],
    correctas: ['a', 'b'],
    explicacion: '> ALL equivale a superar el máximo de la subconsulta, igual que comparar con MAX(salary). (El departamento 60 existe y sus salarios no son NULL.)',
    porQueNo: {
      c: '> ANY equivale a superar el mínimo, no el máximo.',
      d: 'La subconsulta devuelve varias filas: ORA-01427.',
      e: 'Devuelve a quienes ganan exactamente el salario máximo del departamento 60, no más.'
    }
  },
  {
    id: 'X178', examen: 'exam071', tema: 'Subconsultas',
    tipo: 'unica',
    enunciado: 'El empleado Grant tiene DEPARTMENT_ID NULL. ¿Qué ocurre con Grant en el resultado?',
    exhibit: [T_EMP, T_DEPT],
    codigo: 'SELECT e.last_name,\n       (SELECT d.department_name\n        FROM   departments d\n        WHERE  d.department_id = e.department_id) AS dept\nFROM   employees e;',
    opciones: [
      { id: 'a', texto: 'Aparece con DEPT NULL.' },
      { id: 'b', texto: 'No aparece, igual que en un inner join.' },
      { id: 'c', texto: 'La consulta falla con ORA-01427 para esa fila.' },
      { id: 'd', texto: 'Aparece con el primer departamento de la tabla.' }
    ],
    correctas: ['a'],
    explicacion: 'Una subconsulta escalar que no devuelve filas produce NULL, pero la fila externa se conserva. Por eso equivale a un LEFT OUTER JOIN, no a un inner join.',
    porQueNo: {
      b: 'La subconsulta escalar no filtra filas de la consulta externa.',
      c: 'ORA-01427 aparece si devuelve más de una fila; aquí no devuelve ninguna.',
      d: 'Sin coincidencias, el resultado es NULL.'
    }
  },
  {
    id: 'X179', examen: 'exam071', tema: 'Operadores de conjunto',
    tipo: 'multiple',
    enunciado: 'Las tablas A y B tienen una columna N que no contiene NULL. ¿Qué dos sentencias devuelven, sin duplicados, los valores que están en A pero no en B? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'SELECT n FROM a\nMINUS\nSELECT n FROM b;' },
      { id: 'b', texto: 'SELECT DISTINCT n FROM a\nWHERE NOT EXISTS (SELECT 1 FROM b WHERE b.n = a.n);' },
      { id: 'c', texto: 'SELECT n FROM b\nMINUS\nSELECT n FROM a;' },
      { id: 'd', texto: 'SELECT n FROM a\nINTERSECT\nSELECT n FROM b;' },
      { id: 'e', texto: 'SELECT n FROM a\nWHERE  n NOT IN (SELECT n FROM b);' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'MINUS devuelve las filas distintas de la primera consulta que no están en la segunda. Una anti-join con NOT EXISTS y DISTINCT produce lo mismo (sin NULL en N).',
    porQueNo: {
      c: 'Devuelve los valores de B que no están en A.',
      d: 'Devuelve los valores comunes.',
      e: 'Obtiene los valores correctos, pero conserva los duplicados de A.'
    }
  },
  {
    id: 'X180', examen: 'exam071', tema: 'DML',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre la sentencia UPDATE son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Puede modificar varias columnas en una misma sentencia.' },
      { id: 'b', texto: 'Sin cláusula WHERE modifica todas las filas de la tabla.' },
      { id: 'c', texto: 'Una sola sentencia UPDATE puede modificar dos tablas a la vez.' },
      { id: 'd', texto: 'Cambiar una clave primaria referenciada por filas hijas actualiza en cascada las claves foráneas.' },
      { id: 'e', texto: 'La cláusula WHERE de un UPDATE no puede contener subconsultas.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'UPDATE ... SET col1 = ..., col2 = ... modifica varias columnas a la vez, y sin WHERE afecta a todas las filas.',
    porQueNo: {
      c: 'UPDATE actúa sobre una sola tabla (o una vista actualizable).',
      d: 'Oracle no tiene ON UPDATE CASCADE: falla con ORA-02292: child record found.',
      e: 'WHERE puede contener subconsultas, incluso de la misma tabla.'
    }
  },
  {
    id: 'X181', examen: 'exam071', tema: 'DML',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar el INSERT?',
    codigo: "CREATE TABLE tickets (\n  id    NUMBER GENERATED ALWAYS AS IDENTITY,\n  descr VARCHAR2(50)\n);\n\nINSERT INTO tickets (id, descr) VALUES (1, 'Printer down');",
    opciones: [
      { id: 'a', texto: 'Error ORA-32795: cannot insert into a generated always identity column.' },
      { id: 'b', texto: 'Inserta la fila con ID = 1.' },
      { id: 'c', texto: 'Inserta la fila e ignora el valor 1, usando el siguiente número de la identidad.' },
      { id: 'd', texto: 'La tabla no se crea porque falta START WITH.' }
    ],
    correctas: ['a'],
    explicacion: 'GENERATED ALWAYS obliga a que el valor lo genere siempre Oracle: no se puede indicar en INSERT ni modificar con UPDATE. Para permitir valores explícitos se usa GENERATED BY DEFAULT.',
    porQueNo: {
      b: 'Eso ocurriría con GENERATED BY DEFAULT.',
      c: 'Oracle no ignora el valor: la sentencia falla.',
      d: 'Las opciones de la secuencia de identidad son opcionales (empiezan en 1 por defecto).'
    }
  },
  {
    id: 'X182', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre las columnas de identidad son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Con GENERATED BY DEFAULT se puede indicar un valor explícito en el INSERT.' },
      { id: 'b', texto: 'Con GENERATED BY DEFAULT ON NULL se genera un valor cuando el INSERT indica NULL para la columna.' },
      { id: 'c', texto: 'Una columna GENERATED ALWAYS puede modificarse con UPDATE.' },
      { id: 'd', texto: 'Una tabla puede tener varias columnas de identidad.' },
      { id: 'e', texto: 'Una columna de identidad puede ser de tipo VARCHAR2.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Las columnas de identidad (12c+) usan una secuencia interna. BY DEFAULT permite valores explícitos y ON NULL también reemplaza los NULL.',
    porQueNo: {
      c: 'ORA-32796: cannot update a generated always identity column.',
      d: 'ORA-30669: table can have only one identity column.',
      e: 'Debe ser numérica: ORA-30675: identity column must be a numeric type.'
    }
  },
  {
    id: 'X183', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'unica',
    enunciado: 'La tabla T tiene la columna A. ¿Qué devuelve el SELECT?',
    codigo: 'ALTER TABLE t ADD (b NUMBER INVISIBLE);\nINSERT INTO t VALUES (1);\nSELECT * FROM t;',
    opciones: [
      { id: 'a', texto: 'Solo la columna A.' },
      { id: 'b', texto: 'Las columnas A y B.' },
      { id: 'c', texto: 'El INSERT falla porque faltan valores.' },
      { id: 'd', texto: 'Error: una columna invisible no puede añadirse a una tabla existente.' }
    ],
    correctas: ['a'],
    explicacion: 'Las columnas invisibles no aparecen en SELECT * ni en DESCRIBE, y un INSERT sin lista de columnas las ignora. Siguen siendo accesibles si se nombran explícitamente (SELECT a, b FROM t).',
    porQueNo: {
      b: 'B solo aparece si se nombra explícitamente.',
      c: 'El INSERT sin lista de columnas solo considera las columnas visibles.',
      d: 'Se pueden añadir columnas invisibles con ALTER TABLE, o cambiar su visibilidad con MODIFY.'
    }
  },
  {
    id: 'X184', examen: 'exam071', tema: 'DDL y gestión de tablas',
    tipo: 'multiple',
    enunciado: '¿Qué dos sentencias DDL son válidas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'RENAME emp_tmp TO emp_old;' },
      { id: 'b', texto: 'ALTER TABLE emp_old RENAME COLUMN ename TO full_name;' },
      { id: 'c', texto: 'ALTER TABLE emp_old MODIFY ename RENAME TO full_name;' },
      { id: 'd', texto: 'TRUNCATE emp_old;' },
      { id: 'e', texto: 'DROP TABLE emp_old, emp_tmp;' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'RENAME cambia el nombre de una tabla, vista, secuencia o sinónimo privado propio. ALTER TABLE ... RENAME COLUMN cambia el nombre de una columna.',
    porQueNo: {
      c: 'MODIFY sirve para cambiar tipo, tamaño, DEFAULT o restricciones; no para renombrar.',
      d: 'Falta la palabra TABLE: ORA-03290: Invalid truncate command - missing CLUSTER or TABLE keyword.',
      e: 'DROP TABLE elimina una sola tabla por sentencia.'
    }
  },
  {
    id: 'X185', examen: 'exam071', tema: 'Restricciones',
    tipo: 'unica',
    enunciado: 'P2 tiene una PK compuesta (A, B) y está vacía. H2 tiene una FK (A, B) que referencia a P2. ¿Qué ocurre con el INSERT?',
    codigo: 'INSERT INTO h2 (a, b) VALUES (NULL, 999);',
    opciones: [
      { id: 'a', texto: 'Se inserta, porque basta con que una columna de la FK compuesta sea NULL para que no se valide.' },
      { id: 'b', texto: 'Falla con ORA-02291: parent key not found.' },
      { id: 'c', texto: 'Falla porque las columnas de una FK no admiten NULL.' },
      { id: 'd', texto: 'Se inserta, pero la FK queda deshabilitada.' }
    ],
    correctas: ['a'],
    explicacion: 'Oracle solo valida una FK compuesta cuando todas sus columnas tienen valor. Con una sola columna nula, la fila se acepta aunque no exista el padre.',
    porQueNo: {
      b: 'Sería el resultado con (1, 999): todas las columnas tienen valor y no existe el padre.',
      c: 'Las columnas de una FK admiten NULL salvo que se declaren NOT NULL.',
      d: 'La FK sigue habilitada; simplemente no se evalúa para esa fila.'
    }
  },
  {
    id: 'X186', examen: 'exam071', tema: 'Restricciones',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los nombres de las restricciones son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Si no se indica un nombre, Oracle genera uno con el formato SYS_Cn.' },
      { id: 'b', texto: 'El nombre de una restricción debe ser único dentro del esquema.' },
      { id: 'c', texto: 'Dos tablas del mismo esquema pueden tener restricciones con el mismo nombre.' },
      { id: 'd', texto: 'Las restricciones NOT NULL no pueden tener nombre.' },
      { id: 'e', texto: 'El nombre de una restricción debe empezar con el nombre de la tabla.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los nombres de restricción son únicos por esquema (ORA-02264 si se repiten). Si se omiten, Oracle los genera como SYS_C seguido de un número.',
    porQueNo: {
      c: 'Aunque estén en tablas distintas, se produce ORA-02264: name already used by an existing constraint.',
      d: 'Se pueden nombrar: col VARCHAR2(10) CONSTRAINT t_col_nn NOT NULL.',
      e: 'Es una convención recomendable, no una regla de Oracle.'
    }
  },
  {
    id: 'X187', examen: 'exam071', tema: 'Gestión de vistas',
    tipo: 'unica',
    enunciado: '¿Qué vista del diccionario muestra el texto de la consulta que define cada vista del usuario?',
    opciones: [
      { id: 'a', texto: 'USER_VIEWS (columna TEXT)' },
      { id: 'b', texto: 'USER_OBJECTS (columna TEXT)' },
      { id: 'c', texto: 'USER_TAB_COLUMNS' },
      { id: 'd', texto: 'USER_SOURCE' }
    ],
    correctas: ['a'],
    explicacion: 'USER_VIEWS contiene VIEW_NAME y TEXT, con la consulta de definición de la vista.',
    porQueNo: {
      b: 'USER_OBJECTS muestra nombre, tipo, estado y fechas, pero no la definición.',
      c: 'USER_TAB_COLUMNS muestra las columnas de tablas y vistas, no su consulta.',
      d: 'USER_SOURCE contiene el código de los objetos PL/SQL (procedimientos, paquetes...), no de las vistas.'
    }
  },
  {
    id: 'X188', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los índices B-tree son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Oracle los mantiene automáticamente cuando se ejecuta DML sobre la tabla.' },
      { id: 'b', texto: 'Un índice compuesto puede usarse en consultas que filtran por su columna inicial.' },
      { id: 'c', texto: 'Si una columna está indexada, el optimizador siempre usa el índice cuando la columna aparece en WHERE.' },
      { id: 'd', texto: 'Al eliminar una tabla, sus índices se conservan para reutilizarlos.' },
      { id: 'e', texto: 'Un índice recién creado necesita un COMMIT para que el optimizador pueda usarlo.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los índices se actualizan con cada INSERT, UPDATE o DELETE. Un índice compuesto (a, b) sirve para condiciones sobre a, o sobre a y b.',
    porQueNo: {
      c: 'El optimizador decide según el costo; puede preferir un recorrido completo de la tabla.',
      d: 'DROP TABLE elimina también sus índices.',
      e: 'CREATE INDEX es DDL y se confirma implícitamente.'
    }
  },
  {
    id: 'X189', examen: 'exam071', tema: 'Secuencias, sinónimos e índices',
    tipo: 'unica',
    enunciado: 'La secuencia S_ORD ya generó valores hasta el 500. ¿Qué ocurre al ejecutar `ALTER SEQUENCE s_ord START WITH 1;`?',
    opciones: [
      { id: 'a', texto: 'Error ORA-02283: cannot alter starting sequence number.' },
      { id: 'b', texto: 'La secuencia se reinicia y el siguiente NEXTVAL devuelve 1.' },
      { id: 'c', texto: 'La secuencia se reinicia después del próximo COMMIT.' },
      { id: 'd', texto: 'El cambio se acepta, pero solo se aplica cuando se alcance MAXVALUE.' }
    ],
    correctas: ['a'],
    explicacion: 'START WITH no puede modificarse con ALTER SEQUENCE. Para empezar de nuevo, lo documentado es eliminar la secuencia y volver a crearla (o ajustar temporalmente INCREMENT BY).',
    porQueNo: {
      b: 'ALTER SEQUENCE no admite START WITH.',
      c: 'ALTER SEQUENCE es DDL y no depende de COMMIT; además la sentencia falla.',
      d: 'El cambio se rechaza por completo.'
    }
  },
  {
    id: 'X190', examen: 'exam071', tema: 'Tablas temporales y externas',
    tipo: 'unica',
    enunciado: 'La sesión A ejecuta las sentencias. Luego la sesión B, del mismo usuario, ejecuta `SELECT COUNT(*) FROM gtt_cart;`. ¿Qué obtiene B?',
    codigo: 'CREATE GLOBAL TEMPORARY TABLE gtt_cart (item NUMBER)\n  ON COMMIT PRESERVE ROWS;\nINSERT INTO gtt_cart VALUES (1);\nINSERT INTO gtt_cart VALUES (2);\nINSERT INTO gtt_cart VALUES (3);\nCOMMIT;',
    opciones: [
      { id: 'a', texto: '0' },
      { id: 'b', texto: '3' },
      { id: 'c', texto: 'Error ORA-00942, porque la tabla solo existe en la sesión A.' },
      { id: 'd', texto: 'La consulta espera hasta que la sesión A termine.' }
    ],
    correctas: ['a'],
    explicacion: 'Los datos de una tabla temporal global son privados de cada sesión, aunque se hayan confirmado. B ve la tabla (la definición es compartida) pero vacía.',
    porQueNo: {
      b: 'PRESERVE ROWS conserva los datos para la sesión A, no los comparte.',
      c: 'La definición de la tabla es permanente y visible para otras sesiones.',
      d: 'No hay bloqueos entre los datos de sesiones distintas.'
    }
  },
  {
    id: 'X191', examen: 'exam071', tema: 'Tablas temporales y externas',
    tipo: 'unica',
    enunciado: 'La misma sesión del ejercicio anterior (con filas en GTT_CART, ON COMMIT PRESERVE ROWS) ejecuta `DROP TABLE gtt_cart;`. ¿Qué ocurre?',
    opciones: [
      { id: 'a', texto: 'Error ORA-14452: attempt to create, alter or drop an index on temporary table already in use.' },
      { id: 'b', texto: 'Se elimina la tabla y sus datos.' },
      { id: 'c', texto: 'Se eliminan solo los datos de la sesión.' },
      { id: 'd', texto: 'La tabla se elimina cuando termine la sesión.' }
    ],
    correctas: ['a'],
    explicacion: 'No se puede eliminar ni alterar una tabla temporal mientras alguna sesión tenga datos en ella. Hay que vaciarla primero (TRUNCATE TABLE o terminar la sesión).',
    porQueNo: {
      b: 'La tabla está en uso por la propia sesión, así que el DROP falla.',
      c: 'DROP TABLE no se limita a los datos de la sesión.',
      d: 'Oracle no aplaza el DROP; lo rechaza.'
    }
  },
  {
    id: 'X192', examen: 'exam071', tema: 'Diccionario de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos vistas del diccionario pueden mostrar objetos de otros usuarios a los que el usuario actual tiene acceso? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'ALL_TABLES' },
      { id: 'b', texto: 'ALL_VIEWS' },
      { id: 'c', texto: 'USER_TABLES' },
      { id: 'd', texto: 'USER_OBJECTS' },
      { id: 'e', texto: 'USER_SYNONYMS' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Las vistas ALL_ incluyen una columna OWNER y muestran los objetos propios y los ajenos sobre los que el usuario tiene privilegios.',
    porQueNo: {
      c: 'USER_TABLES solo muestra las tablas propias.',
      d: 'USER_OBJECTS solo muestra los objetos propios.',
      e: 'USER_SYNONYMS muestra los sinónimos privados del usuario (que pueden apuntar a objetos ajenos), no los objetos de otros usuarios.'
    }
  },
  {
    id: 'X193', examen: 'exam071', tema: 'Privilegios y roles',
    tipo: 'multiple',
    enunciado: '¿Qué tres afirmaciones sobre REVOKE son verdaderas? (Elige tres)',
    opciones: [
      { id: 'a', texto: 'Revocar un privilegio de objeto otorgado WITH GRANT OPTION lo revoca también a quienes lo recibieron de ese usuario.' },
      { id: 'b', texto: 'Sin privilegios administrativos especiales, un usuario solo puede revocar los privilegios de objeto que él mismo otorgó.' },
      { id: 'c', texto: 'REVOKE REFERENCES ... CASCADE CONSTRAINTS elimina las claves foráneas definidas gracias a ese privilegio.' },
      { id: 'd', texto: 'Revocar un privilegio de sistema otorgado WITH ADMIN OPTION lo revoca en cascada a terceros.' },
      { id: 'e', texto: 'REVOKE requiere un COMMIT para tener efecto.' },
      { id: 'f', texto: 'REVOKE ALL ON tabla elimina la tabla.' }
    ],
    correctas: ['a', 'b', 'c'],
    explicacion: 'Los privilegios de objeto se revocan en cascada y solo los puede revocar quien los otorgó. Si se revoca REFERENCES, CASCADE CONSTRAINTS elimina las FK que dependen de él.',
    porQueNo: {
      d: 'La revocación de privilegios de sistema no se propaga en cascada.',
      e: 'GRANT y REVOKE son DDL/DCL y tienen efecto inmediato con commit implícito.',
      f: 'REVOKE solo retira privilegios; nunca elimina objetos.'
    }
  },
  {
    id: 'X194', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: '¿Qué devuelve la consulta?',
    codigo: "SELECT TO_CHAR(\n         FROM_TZ(TIMESTAMP '2024-01-01 10:00:00', '+02:00')\n           AT TIME ZONE '-03:00',\n         'YYYY-MM-DD HH24:MI TZH:TZM') AS r\nFROM   dual;",
    opciones: [
      { id: 'a', texto: '2024-01-01 05:00 -03:00' },
      { id: 'b', texto: '2024-01-01 15:00 -03:00' },
      { id: 'c', texto: '2024-01-01 10:00 -03:00' },
      { id: 'd', texto: '2024-01-01 07:00 -03:00' }
    ],
    correctas: ['a'],
    explicacion: 'FROM_TZ asigna la zona +02:00 al timestamp (10:00 +02:00 = 08:00 UTC). AT TIME ZONE lo convierte a -03:00: 08:00 UTC = 05:00 -03:00.',
    porQueNo: {
      b: 'Suma la diferencia en lugar de restarla: al ir hacia el oeste la hora local es menor.',
      c: 'AT TIME ZONE convierte la hora, no solo cambia la etiqueta de la zona.',
      d: 'Solo resta 3 horas; la diferencia entre +02:00 y -03:00 es de 5 horas.'
    }
  },
  {
    id: 'X195', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'multiple',
    enunciado: '¿Qué dos expresiones devuelven un valor de tipo INTERVAL DAY TO SECOND? (Elige dos)',
    opciones: [
      { id: 'a', texto: "SYSTIMESTAMP - TIMESTAMP '2024-01-01 00:00:00'" },
      { id: 'b', texto: "NUMTODSINTERVAL(36, 'HOUR')" },
      { id: 'c', texto: "SYSDATE - DATE '2024-01-01'" },
      { id: 'd', texto: "NUMTOYMINTERVAL(1, 'YEAR')" },
      { id: 'e', texto: 'ADD_MONTHS(SYSDATE, 1)' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Restar dos TIMESTAMP da un INTERVAL DAY TO SECOND, y NUMTODSINTERVAL construye uno a partir de un número de días, horas, minutos o segundos.',
    porQueNo: {
      c: 'Restar dos DATE devuelve un NUMBER (días).',
      d: 'NUMTOYMINTERVAL devuelve un INTERVAL YEAR TO MONTH.',
      e: 'ADD_MONTHS devuelve un DATE.'
    }
  },
  {
    id: 'X196', examen: 'exam071', tema: 'Fecha, hora y zonas horarias',
    tipo: 'unica',
    enunciado: "La tabla ORDERS tiene una única fila con ORDER_DATE = 15-MAR-2024 14:30:00 (tipo DATE). ¿Cuántas filas devuelve la consulta?",
    codigo: "SELECT order_id\nFROM   orders\nWHERE  order_date = DATE '2024-03-15';",
    opciones: [
      { id: 'a', texto: '0' },
      { id: 'b', texto: '1' },
      { id: 'c', texto: 'Error: no se puede comparar un DATE con un literal DATE.' },
      { id: 'd', texto: 'Depende de NLS_DATE_FORMAT.' }
    ],
    correctas: ['a'],
    explicacion: "El literal DATE '2024-03-15' corresponde a la medianoche (00:00:00), y la fila guarda las 14:30. Para comparar solo el día se usa TRUNC(order_date) = DATE '2024-03-15' o un rango >= y <.",
    porQueNo: {
      b: 'Un DATE incluye la hora; 14:30 no es igual a 00:00.',
      c: 'La comparación es válida; simplemente no hay coincidencia.',
      d: 'El literal ANSI DATE no depende de NLS_DATE_FORMAT.'
    }
  },
  {
    id: 'X197', examen: 'exam071', tema: 'Variables de sustitución',
    tipo: 'unica',
    enunciado: 'El archivo emp_dept.sql contiene la sentencia siguiente y se ejecuta en SQL*Plus con `@emp_dept.sql 50`. ¿Qué ocurre?',
    codigo: 'SELECT last_name\nFROM   employees\nWHERE  department_id = &1;',
    opciones: [
      { id: 'a', texto: 'Se reemplaza &1 por 50 sin pedir ningún valor.' },
      { id: 'b', texto: 'Se pide al usuario el valor de la variable 1.' },
      { id: 'c', texto: 'Error: los nombres de las variables no pueden ser números.' },
      { id: 'd', texto: 'Se reemplaza &1 por el nombre del script.' }
    ],
    correctas: ['a'],
    explicacion: 'Los argumentos que siguen al nombre del script se asignan a las variables de sustitución posicionales &1, &2, etc.',
    porQueNo: {
      b: 'El valor ya se proporcionó como argumento del script.',
      c: '&1, &2, ... son las variables posicionales de los argumentos del script.',
      d: '&1 corresponde al primer argumento después del nombre del script.'
    }
  },
  {
    id: 'X198', examen: 'exam071', tema: 'Conceptos relacionales y tipos de datos',
    tipo: 'multiple',
    enunciado: 'Con la configuración por defecto (MAX_STRING_SIZE = STANDARD), ¿qué dos afirmaciones sobre los tipos de datos son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'TIMESTAMP almacena fracciones de segundo; DATE no.' },
      { id: 'b', texto: 'Una columna VARCHAR2 admite como máximo 4000 bytes.' },
      { id: 'c', texto: 'DATE almacena la zona horaria.' },
      { id: 'd', texto: 'Una columna NUMBER sin precisión ni escala solo almacena números enteros.' },
      { id: 'e', texto: 'Una columna CLOB puede ser clave primaria.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'DATE guarda fecha y hora hasta los segundos; TIMESTAMP añade fracciones de segundo. VARCHAR2 tiene un límite de 4000 bytes en SQL con MAX_STRING_SIZE = STANDARD (ORA-00910 si se excede).',
    porQueNo: {
      c: 'Para guardar la zona horaria se usa TIMESTAMP WITH TIME ZONE.',
      d: 'NUMBER sin precisión ni escala admite decimales (por ejemplo, 1.5).',
      e: 'Los LOB no pueden formar parte de una clave primaria ni de un índice normal.'
    }
  }
  ];
})();
