/* Banco: Database Foundation (Oracle Academy)
   Cada pregunta: { id, examen, tema, tipo, enunciado, exhibit?, codigo?, opciones, correctas, explicacion, porQueNo } */
var BANCO_FOUNDATION = [
  {
    id: 'F001', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: '¿Cuál de las siguientes afirmaciones describe mejor una base de datos?',
    opciones: [
      { id: 'a', texto: 'Una colección organizada de datos relacionados, almacenada de forma que pueda ser consultada y actualizada eficientemente.' },
      { id: 'b', texto: 'El software que permite a los usuarios crear hojas de cálculo con fórmulas.' },
      { id: 'c', texto: 'Cualquier archivo almacenado en el disco duro de un servidor.' },
      { id: 'd', texto: 'Un lenguaje de programación usado para consultar información.' }
    ],
    correctas: ['a'],
    explicacion: 'Una base de datos es un conjunto organizado y estructurado de datos relacionados, diseñado para almacenarse, consultarse y modificarse de forma eficiente, normalmente a través de un DBMS.',
    porQueNo: {
      b: 'Eso describe una aplicación de hoja de cálculo, no una base de datos.',
      c: 'Un archivo cualquiera no implica organización ni relaciones entre los datos.',
      d: 'Eso describe a SQL, el lenguaje con que se consulta la base de datos, no a la base de datos misma.'
    }
  },
  {
    id: 'F002', examen: 'foundation', tema: 'Datos vs. información',
    tipo: 'unica',
    enunciado: 'Un sistema almacena los valores 85, 92, 78 y 64. Un reporte muestra: "El promedio del grupo en el parcial 1 fue 79.75 y el 25% de los estudiantes reprobó". ¿Qué representa el reporte?',
    opciones: [
      { id: 'a', texto: 'Información, porque son datos procesados que tienen significado en un contexto.' },
      { id: 'b', texto: 'Datos, porque contiene números.' },
      { id: 'c', texto: 'Metadatos, porque describe la estructura de la tabla.' },
      { id: 'd', texto: 'Un modelo conceptual, porque resume el negocio.' }
    ],
    correctas: ['a'],
    explicacion: 'Los datos son hechos en bruto (85, 92, 78, 64). La información es el resultado de procesarlos y darles contexto y significado, como el promedio y el porcentaje de reprobados.',
    porQueNo: {
      b: 'Contener números no lo convierte en datos; lo importante es que los valores fueron procesados e interpretados.',
      c: 'Los metadatos describen los datos (por ejemplo, nombre y tipo de una columna), no un resultado calculado.',
      d: 'Un modelo conceptual representa entidades y relaciones del negocio, no resultados calculados.'
    }
  },
  {
    id: 'F003', examen: 'foundation', tema: 'Modelos conceptual, lógico y físico',
    tipo: 'unica',
    enunciado: '¿En qué tipo de modelo aparecen por primera vez los tipos de datos específicos del DBMS, como VARCHAR2(30) o NUMBER(8,2)?',
    opciones: [
      { id: 'a', texto: 'Modelo físico' },
      { id: 'b', texto: 'Modelo conceptual' },
      { id: 'c', texto: 'Modelo lógico' },
      { id: 'd', texto: 'Modelo de procesos' }
    ],
    correctas: ['a'],
    explicacion: 'El modelo físico describe la implementación en un DBMS concreto: tablas, columnas, tipos de datos del producto (VARCHAR2, NUMBER), índices y restricciones.',
    porQueNo: {
      b: 'El modelo conceptual solo identifica entidades, atributos y relaciones desde el punto de vista del negocio, sin detalles de implementación.',
      c: 'El modelo lógico es independiente del DBMS; puede indicar el tipo general del atributo (texto, número), pero no los tipos propios de Oracle.',
      d: 'Un modelo de procesos describe actividades y flujos, no la estructura de los datos.'
    }
  },
  {
    id: 'F004', examen: 'foundation', tema: 'Modelos conceptual, lógico y físico',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre el modelo conceptual son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Captura los requisitos de información del negocio.' },
      { id: 'b', texto: 'Es independiente de la tecnología con la que se implementará.' },
      { id: 'c', texto: 'Define los índices necesarios para mejorar el rendimiento.' },
      { id: 'd', texto: 'Especifica las claves foráneas de cada tabla.' },
      { id: 'e', texto: 'Solo puede crearse después de haber creado las tablas.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'El modelo conceptual (por ejemplo, un ERD) representa las necesidades de información del negocio y no depende del hardware, del software ni del DBMS.',
    porQueNo: {
      c: 'Los índices son un elemento del modelo físico.',
      d: 'Las claves foráneas aparecen al transformar el modelo a tablas (lógico relacional/físico), no en el conceptual.',
      e: 'Es al revés: el modelo conceptual es el punto de partida y las tablas se derivan de él.'
    }
  },
  {
    id: 'F005', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: en un diagrama entidad-relación, una entidad representa algo significativo para el negocio sobre lo cual se necesita almacenar información.',
    opciones: [
      { id: 'a', texto: 'Verdadero' },
      { id: 'b', texto: 'Falso' }
    ],
    correctas: ['a'],
    explicacion: 'Una entidad es una "cosa" de importancia para el negocio (una persona, lugar, objeto, evento o concepto) de la que se desea guardar información.',
    porQueNo: {
      b: 'La afirmación coincide con la definición de entidad usada en Oracle Academy.'
    }
  },
  {
    id: 'F006', examen: 'foundation', tema: 'Oracle SQL Developer Data Modeler',
    tipo: 'unica',
    enunciado: 'En Oracle SQL Developer Data Modeler, ¿qué acción transforma un modelo lógico (ERD) en un modelo relacional?',
    opciones: [
      { id: 'a', texto: 'Engineer to Relational Model (ingeniería hacia adelante)' },
      { id: 'b', texto: 'Reverse Engineer to Logical Model' },
      { id: 'c', texto: 'Generate DDL' },
      { id: 'd', texto: 'Import Data Dictionary' }
    ],
    correctas: ['a'],
    explicacion: 'La herramienta "Engineer to Relational Model" toma el modelo lógico y crea el modelo relacional: entidades → tablas, atributos → columnas, UID → claves primarias y relaciones → claves foráneas.',
    porQueNo: {
      b: 'La ingeniería inversa va en sentido contrario: del modelo relacional al lógico.',
      c: 'Generar DDL produce sentencias CREATE a partir del modelo relacional/físico; no convierte el ERD en modelo relacional.',
      d: 'Importar el diccionario de datos crea un modelo relacional a partir de una base de datos existente, no a partir del ERD.'
    }
  },
  {
    id: 'F007', examen: 'foundation', tema: 'Mapping al modelo físico',
    tipo: 'unica',
    enunciado: 'Al transformar un ERD en tablas, ¿en qué se convierte normalmente el identificador único (UID) de una entidad?',
    opciones: [
      { id: 'a', texto: 'En la clave primaria de la tabla.' },
      { id: 'b', texto: 'En un índice no único.' },
      { id: 'c', texto: 'En una restricción CHECK.' },
      { id: 'd', texto: 'En una secuencia.' }
    ],
    correctas: ['a'],
    explicacion: 'En el mapping: entidad → tabla, atributo → columna, UID primario → clave primaria, relación → clave foránea.',
    porQueNo: {
      b: 'Un UID identifica de forma única cada instancia; un índice no único no garantiza unicidad.',
      c: 'Las restricciones CHECK suelen derivarse de reglas de negocio sobre valores, no del UID.',
      d: 'Una secuencia puede generar valores para una clave sustituta, pero el UID se implementa como clave primaria.'
    }
  },
  {
    id: 'F008', examen: 'foundation', tema: 'Mapping al modelo físico',
    tipo: 'unica',
    enunciado: 'Existe una relación 1:M entre DEPARTAMENTO y EMPLEADO (un departamento tiene muchos empleados). Al crear las tablas, ¿dónde se coloca la clave foránea?',
    opciones: [
      { id: 'a', texto: 'En la tabla EMPLEADO, haciendo referencia a DEPARTAMENTO.' },
      { id: 'b', texto: 'En la tabla DEPARTAMENTO, haciendo referencia a EMPLEADO.' },
      { id: 'c', texto: 'En ambas tablas, cada una referenciando a la otra.' },
      { id: 'd', texto: 'En una tabla intermedia obligatoria.' }
    ],
    correctas: ['a'],
    explicacion: 'En una relación 1:M la clave foránea se coloca en la tabla del lado "muchos" (EMPLEADO), porque cada empleado pertenece a un solo departamento.',
    porQueNo: {
      b: 'Un departamento tiene muchos empleados; una sola columna en DEPARTAMENTO no podría guardar varios empleados.',
      c: 'Para 1:M basta una FK en el lado "muchos"; poner FK en ambas tablas sería redundante y modelaría otra cosa.',
      d: 'La tabla intermedia se usa para resolver relaciones M:M, no 1:M.'
    }
  },
  {
    id: 'F009', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: '¿A qué categoría de sentencias SQL pertenecen CREATE, ALTER y DROP?',
    opciones: [
      { id: 'a', texto: 'DDL (Data Definition Language)' },
      { id: 'b', texto: 'DML (Data Manipulation Language)' },
      { id: 'c', texto: 'TCL (Transaction Control Language)' },
      { id: 'd', texto: 'DCL (Data Control Language)' }
    ],
    correctas: ['a'],
    explicacion: 'Las sentencias DDL definen o modifican la estructura de los objetos de la base de datos: CREATE, ALTER, DROP, RENAME, TRUNCATE y COMMENT.',
    porQueNo: {
      b: 'DML incluye INSERT, UPDATE, DELETE y MERGE, que trabajan con las filas, no con la estructura.',
      c: 'TCL incluye COMMIT, ROLLBACK y SAVEPOINT.',
      d: 'DCL incluye GRANT y REVOKE.'
    }
  },
  {
    id: 'F010', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: 'La tabla STUDENTS tiene 3 filas. ¿Qué devuelve esta sentencia?',
    exhibit: [{
      titulo: 'STUDENTS',
      columnas: ['STUDENT_ID', 'FIRST_NAME', 'GPA'],
      filas: [['1', 'Ana', '3.5'], ['2', 'Luis', '2.8'], ['3', 'Marta', '3.9']]
    }],
    codigo: 'SELECT first_name\nFROM   students\nWHERE  gpa > 3;',
    opciones: [
      { id: 'a', texto: 'Ana y Marta' },
      { id: 'b', texto: 'Solo Marta' },
      { id: 'c', texto: 'Ana, Luis y Marta' },
      { id: 'd', texto: 'Un error, porque GPA no aparece en la lista del SELECT.' }
    ],
    correctas: ['a'],
    explicacion: 'WHERE filtra las filas con GPA mayor que 3 (3.5 y 3.9). La columna usada en WHERE no necesita estar en la lista del SELECT.',
    porQueNo: {
      b: 'Ana tiene GPA 3.5, que también es mayor que 3.',
      c: 'Luis tiene GPA 2.8, que no cumple la condición.',
      d: 'Se puede filtrar por columnas que no se muestran en el SELECT.'
    }
  },
  {
    id: 'F011', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: 'En una base de datos relacional, ¿cómo se llama cada fila de una tabla?',
    opciones: [
      { id: 'a', texto: 'Tupla o registro' },
      { id: 'b', texto: 'Atributo' },
      { id: 'c', texto: 'Dominio' },
      { id: 'd', texto: 'Esquema' }
    ],
    correctas: ['a'],
    explicacion: 'En el modelo relacional una fila se denomina tupla (o registro); una columna corresponde a un atributo.',
    porQueNo: {
      b: 'Un atributo corresponde a una columna, no a una fila.',
      c: 'El dominio es el conjunto de valores permitidos para un atributo.',
      d: 'Un esquema es la colección de objetos (tablas, vistas, etc.) que pertenecen a un usuario.'
    }
  },
{
    id: 'F012', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: '¿Qué es un sistema de gestión de bases de datos (DBMS)?',
    opciones: [
      { id: 'a', texto: 'El software que permite crear, almacenar, consultar, modificar y proteger los datos de una base de datos.' },
      { id: 'b', texto: 'El conjunto de archivos físicos donde se guardan los datos.' },
      { id: 'c', texto: 'El diagrama que representa las entidades del negocio.' },
      { id: 'd', texto: 'Un lenguaje de programación procedural para aplicaciones web.' }
    ],
    correctas: ['a'],
    explicacion: 'El DBMS (por ejemplo, Oracle Database) es el software intermediario entre los usuarios o aplicaciones y los datos: gestiona el almacenamiento, el acceso concurrente, la seguridad, la integridad y la recuperación.',
    porQueNo: {
      b: 'Los archivos son donde residen los datos; el DBMS es el software que los gestiona.',
      c: 'Eso es un diagrama entidad-relación (ERD).',
      d: 'El DBMS no es un lenguaje; SQL es el lenguaje que se usa para comunicarse con él.'
    }
  },
  {
    id: 'F013', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos ventajas ofrece una base de datos frente a guardar los datos en archivos independientes por aplicación? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Reduce la redundancia y las inconsistencias de los datos.' },
      { id: 'b', texto: 'Controla el acceso concurrente y la seguridad de los datos.' },
      { id: 'c', texto: 'Elimina la necesidad de hacer copias de seguridad.' },
      { id: 'd', texto: 'Permite guardar datos sin definir ninguna estructura.' },
      { id: 'e', texto: 'Hace que cada aplicación mantenga su propia copia de los datos.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Centralizar los datos en un DBMS reduce duplicados e inconsistencias, y permite controlar quién accede y cómo varios usuarios trabajan a la vez.',
    porQueNo: {
      c: 'Las copias de seguridad siguen siendo necesarias; el DBMS ofrece herramientas para hacerlas.',
      d: 'Una base de datos relacional requiere definir la estructura (tablas, columnas, tipos).',
      e: 'Eso describe justamente el problema de los sistemas de archivos que la base de datos resuelve.'
    }
  },
  {
    id: 'F014', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: '¿Quién propuso el modelo relacional de bases de datos, en 1970?',
    opciones: [
      { id: 'a', texto: 'E. F. Codd' },
      { id: 'b', texto: 'Larry Ellison' },
      { id: 'c', texto: 'Peter Chen' },
      { id: 'd', texto: 'Richard Barker' }
    ],
    correctas: ['a'],
    explicacion: 'Edgar F. Codd, investigador de IBM, publicó en 1970 el artículo que definió el modelo relacional.',
    porQueNo: {
      b: 'Larry Ellison cofundó Oracle Corporation, que comercializó uno de los primeros RDBMS.',
      c: 'Peter Chen propuso el modelo entidad-relación (1976).',
      d: 'Richard Barker desarrolló la notación de ERD usada por Oracle (notación Barker).'
    }
  },
  {
    id: 'F015', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: '¿Qué tipo de base de datos organiza los datos en tablas bidimensionales que se relacionan entre sí mediante claves?',
    opciones: [
      { id: 'a', texto: 'Relacional' },
      { id: 'b', texto: 'Jerárquica' },
      { id: 'c', texto: 'De red' },
      { id: 'd', texto: 'De archivos planos' }
    ],
    correctas: ['a'],
    explicacion: 'En el modelo relacional los datos se guardan en tablas (filas y columnas) y las relaciones se expresan mediante claves primarias y foráneas.',
    porQueNo: {
      b: 'El modelo jerárquico organiza los datos en árboles padre-hijo.',
      c: 'El modelo de red usa registros enlazados mediante punteros.',
      d: 'Un archivo plano no tiene relaciones entre tablas.'
    }
  },
  {
    id: 'F016', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: 'En la terminología formal del modelo relacional, ¿cómo se llama una tabla?',
    opciones: [
      { id: 'a', texto: 'Relación' },
      { id: 'b', texto: 'Tupla' },
      { id: 'c', texto: 'Dominio' },
      { id: 'd', texto: 'Entidad' }
    ],
    correctas: ['a'],
    explicacion: 'Formalmente: relación = tabla, tupla = fila y atributo = columna. De ahí viene el nombre "modelo relacional".',
    porQueNo: {
      b: 'Una tupla es una fila.',
      c: 'El dominio es el conjunto de valores válidos de un atributo.',
      d: 'Entidad es un concepto del modelo conceptual (ERD), que luego se transforma en tabla.'
    }
  },
  {
    id: 'F017', examen: 'foundation', tema: 'Datos vs. información',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: un listado sin procesar con los 1000 códigos de producto vendidos hoy es información.',
    opciones: [
      { id: 'a', texto: 'Falso' },
      { id: 'b', texto: 'Verdadero' }
    ],
    correctas: ['a'],
    explicacion: 'Son datos: hechos en bruto. Se convierten en información al procesarlos y darles contexto, por ejemplo "el producto más vendido hoy fue X, con 120 unidades".',
    porQueNo: {
      b: 'Un listado sin procesar, sin contexto ni análisis, son datos, no información.'
    }
  },
  {
    id: 'F018', examen: 'foundation', tema: 'Datos vs. información',
    tipo: 'unica',
    enunciado: '¿Qué convierte los datos en información?',
    opciones: [
      { id: 'a', texto: 'Procesarlos y organizarlos de modo que tengan significado y sirvan para tomar decisiones.' },
      { id: 'b', texto: 'Guardarlos en una tabla con clave primaria.' },
      { id: 'c', texto: 'Copiarlos a otro servidor.' },
      { id: 'd', texto: 'Convertirlos a mayúsculas.' }
    ],
    correctas: ['a'],
    explicacion: 'La información es el resultado de procesar, agrupar, calcular o interpretar los datos en un contexto útil.',
    porQueNo: {
      b: 'Almacenarlos de forma estructurada no les da significado por sí mismo.',
      c: 'Copiarlos no cambia su naturaleza.',
      d: 'Un cambio de formato no aporta significado.'
    }
  },
  {
    id: 'F019', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: 'La clienta "Ana Pérez", con cédula 8-123-456, es ______ de la entidad CLIENTE.',
    opciones: [
      { id: 'a', texto: 'una instancia' },
      { id: 'b', texto: 'un atributo' },
      { id: 'c', texto: 'una relación' },
      { id: 'd', texto: 'un subtipo' }
    ],
    correctas: ['a'],
    explicacion: 'Una instancia es un caso concreto de una entidad. CLIENTE es la entidad; cada cliente específico es una instancia (que se convertirá en una fila).',
    porQueNo: {
      b: 'Los atributos son las características (nombre, cédula), no el cliente completo.',
      c: 'Una relación conecta dos entidades.',
      d: 'Un subtipo es una subdivisión de la entidad (por ejemplo, CLIENTE_EMPRESA), no un cliente concreto.'
    }
  },
  {
    id: 'F020', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: '¿Qué es un atributo en un modelo de datos?',
    opciones: [
      { id: 'a', texto: 'Una característica que describe, cuantifica, califica o clasifica a una entidad.' },
      { id: 'b', texto: 'Una conexión entre dos entidades.' },
      { id: 'c', texto: 'Una copia de una entidad.' },
      { id: 'd', texto: 'Un programa que valida los datos.' }
    ],
    correctas: ['a'],
    explicacion: 'Los atributos (por ejemplo, nombre, fecha de nacimiento, salario) describen a una entidad y se convierten en columnas en el modelo físico.',
    porQueNo: {
      b: 'Eso es una relación.',
      c: 'Un atributo no es una copia de nada.',
      d: 'La validación se implementa con restricciones o código, no con atributos.'
    }
  },
  {
    id: 'F021', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: 'En un ERD con notación de pata de gallo (crow\'s foot), ¿qué indica la pata de gallo en el extremo de una relación?',
    opciones: [
      { id: 'a', texto: 'Que en ese extremo puede haber muchas instancias (cardinalidad "uno o muchos").' },
      { id: 'b', texto: 'Que la relación es opcional.' },
      { id: 'c', texto: 'Que la entidad es un subtipo.' },
      { id: 'd', texto: 'Que la relación forma parte del UID.' }
    ],
    correctas: ['a'],
    explicacion: 'La pata de gallo representa la cardinalidad "muchos". Una línea simple, sin pata de gallo, representa "uno".',
    porQueNo: {
      b: 'La opcionalidad se indica con una línea discontinua (notación Barker) o con un círculo.',
      c: 'Los subtipos se dibujan como cajas dentro de la caja del supertipo.',
      d: 'La participación en el UID se marca con una barra sobre la relación.'
    }
  },
  {
    id: 'F022', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: 'En la notación de ERD de Oracle (Barker), una relación dibujada con línea discontinua junto a una entidad significa que, desde esa entidad, la relación es:',
    opciones: [
      { id: 'a', texto: 'Opcional ("puede")' },
      { id: 'b', texto: 'Obligatoria ("debe")' },
      { id: 'c', texto: 'De muchos a muchos' },
      { id: 'd', texto: 'Recursiva' }
    ],
    correctas: ['a'],
    explicacion: 'Línea continua = obligatoria ("debe ser"); línea discontinua = opcional ("puede ser").',
    porQueNo: {
      b: 'La obligatoriedad se representa con línea continua.',
      c: 'La cardinalidad se indica con la pata de gallo, no con el tipo de línea.',
      d: 'Una relación recursiva conecta la entidad consigo misma, con cualquier tipo de línea.'
    }
  },
  {
    id: 'F023', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'multiple',
    enunciado: '¿Qué dos beneficios aporta crear un modelo de datos antes de construir la base de datos? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Documenta los requisitos de información del negocio.' },
      { id: 'b', texto: 'Facilita la comunicación entre los diseñadores y los usuarios del negocio.' },
      { id: 'c', texto: 'Garantiza que todas las consultas serán rápidas.' },
      { id: 'd', texto: 'Hace innecesario aprender SQL.' },
      { id: 'e', texto: 'Define automáticamente todos los índices necesarios.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'El modelo de datos es un plano que captura qué información necesita el negocio y sirve como lenguaje común entre usuarios y técnicos, reduciendo errores de diseño.',
    porQueNo: {
      c: 'El rendimiento depende también del diseño físico, los índices y las consultas.',
      d: 'El modelo describe los datos; para manipularlos se sigue usando SQL.',
      e: 'Los índices se deciden en el diseño físico según el uso de los datos.'
    }
  },
  {
    id: 'F024', examen: 'foundation', tema: 'Modelos conceptual, lógico y físico',
    tipo: 'unica',
    enunciado: '¿Cuál es el orden habitual en que se desarrollan los modelos de datos?',
    opciones: [
      { id: 'a', texto: 'Conceptual → lógico → físico' },
      { id: 'b', texto: 'Físico → lógico → conceptual' },
      { id: 'c', texto: 'Lógico → conceptual → físico' },
      { id: 'd', texto: 'Conceptual → físico → lógico' }
    ],
    correctas: ['a'],
    explicacion: 'Se parte de una visión de alto nivel del negocio (conceptual), se detalla de forma independiente de la tecnología (lógico) y finalmente se adapta al DBMS concreto (físico).',
    porQueNo: {
      b: 'Es el orden inverso; se usaría en ingeniería inversa, no en el diseño.',
      c: 'El modelo lógico detalla el conceptual, así que va después.',
      d: 'El físico es el último paso, porque depende del lógico.'
    }
  },
  {
    id: 'F025', examen: 'foundation', tema: 'Modelos conceptual, lógico y físico',
    tipo: 'unica',
    enunciado: '¿En qué modelo aparecen las relaciones representadas como columnas de clave foránea?',
    opciones: [
      { id: 'a', texto: 'En el modelo físico (relacional).' },
      { id: 'b', texto: 'En el modelo conceptual.' },
      { id: 'c', texto: 'En el modelo lógico (ERD).' },
      { id: 'd', texto: 'En ninguno: las claves foráneas solo existen en las consultas.' }
    ],
    correctas: ['a'],
    explicacion: 'En el ERD las relaciones se dibujan como líneas entre entidades. Al transformarlo en tablas, cada relación 1:M se implementa como una columna de clave foránea.',
    porQueNo: {
      b: 'El modelo conceptual solo muestra las entidades y cómo se relacionan.',
      c: 'En el ERD la relación es una línea; no se agregan atributos de clave foránea.',
      d: 'Las claves foráneas son columnas y restricciones de las tablas.'
    }
  },
  {
    id: 'F026', examen: 'foundation', tema: 'Modelos conceptual, lógico y físico',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones describen el modelo lógico? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Incluye las entidades con todos sus atributos, identificadores únicos y relaciones.' },
      { id: 'b', texto: 'Es independiente del DBMS en que se implementará.' },
      { id: 'c', texto: 'Define los tablespaces y archivos de datos.' },
      { id: 'd', texto: 'Usa tipos de datos propios de Oracle, como VARCHAR2.' },
      { id: 'e', texto: 'Solo contiene los nombres de las entidades, sin atributos.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'El modelo lógico detalla el conceptual (atributos, UID, cardinalidad, opcionalidad) sin atarse a un producto concreto.',
    porQueNo: {
      c: 'El almacenamiento físico pertenece al modelo físico.',
      d: 'Los tipos específicos del DBMS se definen en el modelo físico.',
      e: 'Eso se parece más a un modelo conceptual de alto nivel.'
    }
  },
  {
    id: 'F027', examen: 'foundation', tema: 'Oracle SQL Developer Data Modeler',
    tipo: 'unica',
    enunciado: '¿Qué es Oracle SQL Developer Data Modeler?',
    opciones: [
      { id: 'a', texto: 'Una herramienta gráfica gratuita para crear, consultar y modificar modelos de datos lógicos, relacionales y físicos.' },
      { id: 'b', texto: 'Un servicio de pago para alojar bases de datos en la nube.' },
      { id: 'c', texto: 'Un motor de base de datos alternativo a Oracle Database.' },
      { id: 'd', texto: 'Un lenguaje de programación para crear informes.' }
    ],
    correctas: ['a'],
    explicacion: 'Data Modeler permite diseñar ERD (modelo lógico), transformarlos en modelos relacionales y físicos, generar DDL y hacer ingeniería inversa de bases existentes.',
    porQueNo: {
      b: 'Data Modeler es una herramienta gratuita de escritorio, no un servicio de alojamiento.',
      c: 'No almacena datos; modela estructuras.',
      d: 'No es un lenguaje de programación.'
    }
  },
  {
    id: 'F028', examen: 'foundation', tema: 'Oracle SQL Developer Data Modeler',
    tipo: 'unica',
    enunciado: 'En Data Modeler, ¿qué hace la opción de ingeniería inversa "Reverse Engineer to Logical Model"?',
    opciones: [
      { id: 'a', texto: 'Genera un modelo lógico (ERD) a partir de un modelo relacional.' },
      { id: 'b', texto: 'Genera un modelo relacional a partir del modelo lógico.' },
      { id: 'c', texto: 'Elimina el modelo lógico.' },
      { id: 'd', texto: 'Ejecuta el DDL en la base de datos.' }
    ],
    correctas: ['a'],
    explicacion: 'La ingeniería inversa va "hacia atrás": del modelo relacional (tablas) al modelo lógico (entidades). Es útil para documentar bases de datos existentes.',
    porQueNo: {
      b: 'Eso es la ingeniería hacia adelante (Engineer to Relational Model).',
      c: 'No elimina ningún modelo.',
      d: 'Ejecutar DDL no forma parte de la ingeniería inversa.'
    }
  },
  {
    id: 'F029', examen: 'foundation', tema: 'Oracle SQL Developer Data Modeler',
    tipo: 'unica',
    enunciado: 'Una vez terminado el modelo relacional en Data Modeler, ¿qué opción produce el script con las sentencias CREATE TABLE?',
    opciones: [
      { id: 'a', texto: 'Generate DDL' },
      { id: 'b', texto: 'Engineer to Logical Model' },
      { id: 'c', texto: 'Import Data Dictionary' },
      { id: 'd', texto: 'Compare Models' }
    ],
    correctas: ['a'],
    explicacion: 'Generate DDL abre el editor de archivos DDL y produce las sentencias CREATE TABLE, ALTER TABLE ... ADD CONSTRAINT, etc., listas para ejecutarse.',
    porQueNo: {
      b: 'Engineer to Logical Model genera el ERD a partir del modelo relacional.',
      c: 'Import Data Dictionary lee la estructura de una base existente.',
      d: 'Compare Models muestra diferencias entre dos modelos.'
    }
  },
  {
    id: 'F030', examen: 'foundation', tema: 'Mapping al modelo físico',
    tipo: 'unica',
    enunciado: 'Al transformar el ERD a tablas, un atributo marcado como obligatorio (*) se convierte en:',
    opciones: [
      { id: 'a', texto: 'Una columna con restricción NOT NULL.' },
      { id: 'b', texto: 'Una columna de clave foránea.' },
      { id: 'c', texto: 'Un índice.' },
      { id: 'd', texto: 'Una columna con DEFAULT 0.' }
    ],
    correctas: ['a'],
    explicacion: 'Atributo obligatorio (*) → columna NOT NULL; atributo opcional (o) → columna que admite NULL; UID (#) → clave primaria.',
    porQueNo: {
      b: 'Las claves foráneas provienen de las relaciones, no de los atributos.',
      c: 'La obligatoriedad no implica crear un índice.',
      d: 'Obligatorio significa que debe tener valor, no que tenga un valor por defecto.'
    }
  },
  {
    id: 'F031', examen: 'foundation', tema: 'Mapping al modelo físico',
    tipo: 'unica',
    enunciado: 'Siguiendo la convención habitual de Oracle Academy, ¿qué nombre recibe la tabla que implementa la entidad EMPLOYEE?',
    opciones: [
      { id: 'a', texto: 'EMPLOYEES' },
      { id: 'b', texto: 'EMPLOYEE_ENTITY' },
      { id: 'c', texto: 'TBL_EMP' },
      { id: 'd', texto: 'EMPLOYEE_PK' }
    ],
    correctas: ['a'],
    explicacion: 'Por convención, las entidades se nombran en singular (una instancia) y las tablas en plural (el conjunto de filas).',
    porQueNo: {
      b: 'No se añade el sufijo ENTITY a las tablas.',
      c: 'Los prefijos como TBL_ no forman parte de la convención.',
      d: 'El sufijo _PK se usa para el nombre de la restricción de clave primaria.'
    }
  },
{
    id: 'F032', examen: 'foundation', tema: 'Mapping al modelo físico',
    tipo: 'unica',
    enunciado: 'Hay una relación 1:1 entre EMPLEADO y CARNET: cada carnet debe pertenecer a un empleado, y un empleado puede tener un carnet. ¿Cómo se implementa?',
    opciones: [
      { id: 'a', texto: 'Con una FK en CARNET hacia EMPLEADO, con restricciones NOT NULL y UNIQUE.' },
      { id: 'b', texto: 'Con una FK en EMPLEADO hacia CARNET, que admite NULL y valores repetidos.' },
      { id: 'c', texto: 'Con una tabla de intersección entre ambas.' },
      { id: 'd', texto: 'Fusionando las dos entidades en una sola tabla obligatoriamente.' }
    ],
    correctas: ['a'],
    explicacion: 'En una relación 1:1, la FK se coloca en el lado obligatorio (CARNET). NOT NULL refleja que el carnet debe tener empleado, y UNIQUE garantiza que cada empleado aparezca una sola vez (cardinalidad 1).',
    porQueNo: {
      b: 'Sin UNIQUE la relación sería 1:M, y en el lado opcional la FK quedaría con muchos NULL.',
      c: 'Las tablas de intersección resuelven relaciones M:M.',
      d: 'Fusionar es una opción de diseño posible, pero no la implementación estándar ni obligatoria.'
    }
  },
  {
    id: 'F033', examen: 'foundation', tema: 'Mapping al modelo físico',
    tipo: 'unica',
    enunciado: 'En el ERD, la relación entre PEDIDO y CLIENTE es obligatoria del lado de PEDIDO ("cada pedido debe pertenecer a un cliente"). ¿Cómo se refleja en la tabla PEDIDOS?',
    opciones: [
      { id: 'a', texto: 'La columna de clave foránea CLIENTE_ID tiene restricción NOT NULL.' },
      { id: 'b', texto: 'La columna CLIENTE_ID tiene restricción UNIQUE.' },
      { id: 'c', texto: 'La tabla CLIENTES tiene una columna PEDIDO_ID NOT NULL.' },
      { id: 'd', texto: 'No se refleja en la tabla; solo se documenta.' }
    ],
    correctas: ['a'],
    explicacion: 'Una relación obligatoria del lado hijo se implementa como una FK que no admite NULL: todo pedido debe tener un cliente.',
    porQueNo: {
      b: 'UNIQUE impediría que un cliente tuviera varios pedidos (convertiría la relación en 1:1).',
      c: 'La FK va en el lado "muchos" (PEDIDOS), no en CLIENTES.',
      d: 'La obligatoriedad se implementa directamente con NOT NULL.'
    }
  },
  {
    id: 'F034', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: SQL es un lenguaje procedural en el que se indica paso a paso cómo recorrer las tablas para obtener los datos.',
    opciones: [
      { id: 'a', texto: 'Falso' },
      { id: 'b', texto: 'Verdadero' }
    ],
    correctas: ['a'],
    explicacion: 'SQL es declarativo: se indica qué datos se quieren y el DBMS decide cómo obtenerlos (plan de ejecución). PL/SQL sí es un lenguaje procedural.',
    porQueNo: {
      b: 'En SQL no se escriben bucles ni se indica el camino de acceso; eso lo decide el optimizador.'
    }
  },
  {
    id: 'F035', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'multiple',
    enunciado: '¿Qué dos sentencias pertenecen al lenguaje de control de transacciones (TCL)? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'COMMIT' },
      { id: 'b', texto: 'ROLLBACK' },
      { id: 'c', texto: 'GRANT' },
      { id: 'd', texto: 'INSERT' },
      { id: 'e', texto: 'CREATE' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'TCL incluye COMMIT, ROLLBACK y SAVEPOINT, que controlan cuándo se confirman o deshacen los cambios.',
    porQueNo: {
      c: 'GRANT es DCL (control de acceso).',
      d: 'INSERT es DML.',
      e: 'CREATE es DDL.'
    }
  },
  {
    id: 'F036', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: '¿Qué significa el asterisco en `SELECT * FROM departments;`?',
    opciones: [
      { id: 'a', texto: 'Que se muestran todas las columnas de la tabla.' },
      { id: 'b', texto: 'Que se muestran todas las tablas de la base de datos.' },
      { id: 'c', texto: 'Que se multiplican las columnas.' },
      { id: 'd', texto: 'Que se eliminan las filas duplicadas.' }
    ],
    correctas: ['a'],
    explicacion: 'El asterisco en la lista del SELECT selecciona todas las columnas de las tablas del FROM, en el orden en que fueron definidas.',
    porQueNo: {
      b: 'El FROM indica una sola tabla; * se refiere a sus columnas.',
      c: 'En la lista del SELECT, * no es una multiplicación.',
      d: 'Para eliminar duplicados se usa DISTINCT.'
    }
  },
  {
    id: 'F037', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: '¿Qué muestra el comando DESCRIBE departments en SQL*Plus o SQL Developer?',
    opciones: [
      { id: 'a', texto: 'La estructura de la tabla: nombres de columnas, si admiten NULL y sus tipos de datos.' },
      { id: 'b', texto: 'Todas las filas de la tabla.' },
      { id: 'c', texto: 'El número de filas de la tabla.' },
      { id: 'd', texto: 'Las sentencias que se han ejecutado sobre la tabla.' }
    ],
    correctas: ['a'],
    explicacion: 'DESCRIBE (o DESC) muestra la definición de las columnas: Name, Null? y Type.',
    porQueNo: {
      b: 'Para ver las filas se usa SELECT.',
      c: 'Para contar filas se usa SELECT COUNT(*).',
      d: 'DESCRIBE no muestra el historial de sentencias.'
    }
  },
  {
    id: 'F038', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: 'Examina la estructura de COURSES. ¿Qué sentencia inserta correctamente una fila?',
    exhibit: [{ titulo: 'COURSES', estructura: [['COURSE_ID', 'NUMBER(4)', 'PRIMARY KEY'], ['TITLE', 'VARCHAR2(40)', 'NOT NULL'], ['CREDITS', 'NUMBER(2)', '']] }],
    opciones: [
      { id: 'a', texto: "INSERT INTO courses (course_id, title, credits) VALUES (101, 'Bases de datos', 4);" },
      { id: 'b', texto: 'INSERT INTO courses (course_id, title, credits) VALUES (101, Bases de datos, 4);' },
      { id: 'c', texto: "INSERT courses VALUES (101, 'Bases de datos', 4);" },
      { id: 'd', texto: "INSERT INTO courses (course_id, credits) VALUES (101, 4);" }
    ],
    correctas: ['a'],
    explicacion: 'INSERT INTO tabla (columnas) VALUES (valores). Los textos van entre comillas simples y los valores siguen el orden de la lista de columnas.',
    porQueNo: {
      b: 'Los literales de texto deben ir entre comillas simples.',
      c: 'Falta la palabra INTO (obligatoria en INSERT).',
      d: 'TITLE es NOT NULL y no se le da valor: ORA-01400.'
    }
  },
  {
    id: 'F039', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuántas filas modifica la sentencia?',
    exhibit: [{ titulo: 'STAFF', columnas: ['STAFF_ID', 'NAME', 'DEPT_ID', 'SALARY'], filas: [['1', 'Ana', '10', '3000'], ['2', 'Beto', '20', '4000'], ['3', 'Carla', '10', '3500'], ['4', 'Dario', '30', '5000']] }],
    codigo: 'UPDATE staff\nSET    salary = salary + 500\nWHERE  dept_id = 10;',
    opciones: [
      { id: 'a', texto: '2' },
      { id: 'b', texto: '4' },
      { id: 'c', texto: '1' },
      { id: 'd', texto: '0' }
    ],
    correctas: ['a'],
    explicacion: 'El WHERE limita la actualización a las filas del departamento 10: Ana y Carla.',
    porQueNo: {
      b: 'Se modificarían las 4 filas solo si no hubiera cláusula WHERE.',
      c: 'Hay dos empleados en el departamento 10.',
      d: 'Sí hay filas que cumplen la condición.'
    }
  },
  {
    id: 'F040', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'multiple',
    enunciado: '¿Qué dos sentencias CREATE TABLE se ejecutan sin error? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'CREATE TABLE students (id NUMBER(5), name VARCHAR2(30));' },
      { id: 'b', texto: 'CREATE TABLE courses (code CHAR(6) PRIMARY KEY, credits NUMBER(2));' },
      { id: 'c', texto: 'CREATE TABLE grades (id NUMBER, grade VARCHAR2);' },
      { id: 'd', texto: 'CREATE TABLE 1students (id NUMBER);' },
      { id: 'e', texto: 'CREATE students (id NUMBER);' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Una sentencia CREATE TABLE válida indica el nombre (que empiece con letra) y cada columna con su tipo; VARCHAR2 necesita longitud.',
    porQueNo: {
      c: 'VARCHAR2 requiere especificar la longitud máxima.',
      d: 'Un nombre sin comillas no puede empezar con un número.',
      e: 'Falta la palabra TABLE.'
    }
  },
  {
    id: 'F041', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: '¿Qué tipo de dato es el más adecuado para guardar la fecha de nacimiento de una persona?',
    opciones: [
      { id: 'a', texto: 'DATE' },
      { id: 'b', texto: 'VARCHAR2(10)' },
      { id: 'c', texto: 'NUMBER(8)' },
      { id: 'd', texto: 'CHAR(10)' }
    ],
    correctas: ['a'],
    explicacion: 'DATE permite validar fechas, calcular diferencias (edad) y usar funciones de fecha. Guardar fechas como texto o número impide estas operaciones y permite valores inválidos.',
    porQueNo: {
      b: "Como texto se aceptarían valores inválidos (por ejemplo '31/02/2000') y no se podría operar fácilmente.",
      c: 'Un número como 20000131 no se valida como fecha ni admite aritmética de fechas.',
      d: 'Tiene los mismos problemas que VARCHAR2 y además rellena con espacios.'
    }
  },
  {
    id: 'F042', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: '¿Qué ocurre al ejecutar la consulta?',
    codigo: 'SELECT last_name\nFROM   employees\nWHERE  first_name = "Steven";',
    opciones: [
      { id: 'a', texto: 'Error ORA-00904: "Steven": invalid identifier, porque las comillas dobles indican un nombre de columna.' },
      { id: 'b', texto: 'Devuelve los empleados que se llaman Steven.' },
      { id: 'c', texto: 'No devuelve filas, porque la búsqueda distingue mayúsculas.' },
      { id: 'd', texto: 'Devuelve todos los empleados.' }
    ],
    correctas: ['a'],
    explicacion: "En SQL, los literales de texto van entre comillas simples ('Steven'). Las comillas dobles se usan para identificadores (nombres de columnas, alias), así que Oracle busca una columna llamada Steven.",
    porQueNo: {
      b: "Funcionaría con comillas simples: WHERE first_name = 'Steven'.",
      c: 'La consulta no llega a ejecutar la búsqueda.',
      d: 'La condición produce un error, no un filtro siempre verdadero.'
    }
  },
  {
    id: 'F043', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: 'Examina los datos. ¿Cuál es el primer nombre que devuelve la consulta?',
    exhibit: [{ titulo: 'STAFF', columnas: ['NAME', 'SALARY'], filas: [['Ana', '3000'], ['Beto', '4000'], ['Carla', '3500'], ['Dario', '5000']] }],
    codigo: 'SELECT name, salary\nFROM   staff\nORDER BY salary DESC;',
    opciones: [
      { id: 'a', texto: 'Dario' },
      { id: 'b', texto: 'Ana' },
      { id: 'c', texto: 'Beto' },
      { id: 'd', texto: 'Carla' }
    ],
    correctas: ['a'],
    explicacion: 'DESC ordena de mayor a menor: el salario más alto (5000, Dario) aparece primero.',
    porQueNo: {
      b: 'Ana tiene el salario más bajo; aparecería primero con orden ascendente.',
      c: 'Beto (4000) aparece en segundo lugar.',
      d: 'Carla (3500) aparece en tercer lugar.'
    }
  },
  {
    id: 'F044', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: '¿Cuál es la diferencia entre `DELETE FROM staff;` y `DROP TABLE staff;`?',
    opciones: [
      { id: 'a', texto: 'DELETE elimina las filas y conserva la tabla; DROP TABLE elimina la tabla completa con sus datos.' },
      { id: 'b', texto: 'Ambas hacen exactamente lo mismo.' },
      { id: 'c', texto: 'DELETE elimina la tabla y DROP solo las filas.' },
      { id: 'd', texto: 'DROP TABLE solo elimina las columnas vacías.' }
    ],
    correctas: ['a'],
    explicacion: 'DELETE es DML: borra filas y puede deshacerse con ROLLBACK. DROP TABLE es DDL: elimina la definición de la tabla y todos sus datos.',
    porQueNo: {
      b: 'Una conserva la estructura y la otra no.',
      c: 'Es justo al revés.',
      d: 'DROP TABLE elimina toda la tabla.'
    }
  },
  {
    id: 'F045', examen: 'foundation', tema: 'Datos vs. información',
    tipo: 'unica',
    enunciado: '¿Qué son los metadatos?',
    opciones: [
      { id: 'a', texto: 'Datos que describen otros datos, como el nombre, el tipo y el tamaño de una columna.' },
      { id: 'b', texto: 'Datos que ya fueron eliminados.' },
      { id: 'c', texto: 'Datos duplicados en varias tablas.' },
      { id: 'd', texto: 'Datos cifrados por seguridad.' }
    ],
    correctas: ['a'],
    explicacion: 'Los metadatos son "datos sobre los datos". En Oracle se guardan en el diccionario de datos (por ejemplo, USER_TAB_COLUMNS describe las columnas de las tablas).',
    porQueNo: {
      b: 'Los metadatos describen datos existentes.',
      c: 'La duplicación es redundancia, no metadatos.',
      d: 'El cifrado es una técnica de seguridad, no un tipo de metadato.'
    }
  },
  {
    id: 'F046', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: '¿Qué rol es responsable de instalar, configurar, respaldar y asegurar la base de datos?',
    opciones: [
      { id: 'a', texto: 'El administrador de bases de datos (DBA)' },
      { id: 'b', texto: 'El usuario final' },
      { id: 'c', texto: 'El analista de negocio' },
      { id: 'd', texto: 'El diseñador gráfico' }
    ],
    correctas: ['a'],
    explicacion: 'El DBA administra el DBMS: instalación, configuración, seguridad, respaldos, recuperación y rendimiento.',
    porQueNo: {
      b: 'El usuario final usa las aplicaciones que acceden a la base de datos.',
      c: 'El analista de negocio define los requisitos de información.',
      d: 'El diseñador gráfico trabaja en la interfaz, no en la base de datos.'
    }
  },
  {
    id: 'F047', examen: 'foundation', tema: 'Introducción a bases de datos',
    tipo: 'unica',
    enunciado: 'En una arquitectura cliente/servidor, ¿dónde se ejecutan las sentencias SQL que envía una aplicación?',
    opciones: [
      { id: 'a', texto: 'En el servidor de base de datos, que devuelve los resultados al cliente.' },
      { id: 'b', texto: 'En el navegador del usuario.' },
      { id: 'c', texto: 'En el cliente, que descarga todas las tablas antes de consultar.' },
      { id: 'd', texto: 'En el sistema operativo del cliente, sin intervención del DBMS.' }
    ],
    correctas: ['a'],
    explicacion: 'El cliente (por ejemplo, SQL Developer o una aplicación) envía la sentencia; el servidor de base de datos la procesa y devuelve solo el resultado.',
    porQueNo: {
      b: 'El navegador muestra la interfaz; no ejecuta SQL sobre la base de datos.',
      c: 'Descargar todas las tablas sería ineficiente; el servidor filtra los datos.',
      d: 'Las sentencias SQL las procesa el DBMS en el servidor.'
    }
  },
  {
    id: 'F048', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: 'En el modelo de datos, ¿qué es el identificador único (UID) de una entidad?',
    opciones: [
      { id: 'a', texto: 'Un atributo, o combinación de atributos y relaciones, que distingue cada instancia de las demás.' },
      { id: 'b', texto: 'El nombre de la entidad.' },
      { id: 'c', texto: 'El primer atributo que aparece en la entidad.' },
      { id: 'd', texto: 'Un atributo opcional que puede repetirse.' }
    ],
    correctas: ['a'],
    explicacion: 'El UID identifica de forma única cada instancia (se marca con #). Al transformar el modelo, el UID primario se convierte en la clave primaria.',
    porQueNo: {
      b: 'El nombre identifica la entidad, no sus instancias.',
      c: 'La posición del atributo no lo convierte en UID.',
      d: 'Un UID debe ser obligatorio y único.'
    }
  },
  {
    id: 'F049', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: 'Regla de negocio: "Cada EMPLEADO debe estar asignado a uno y solo un DEPARTAMENTO". Desde el lado de EMPLEADO, ¿cómo es la relación?',
    opciones: [
      { id: 'a', texto: 'Obligatoria y de cardinalidad uno.' },
      { id: 'b', texto: 'Opcional y de cardinalidad uno.' },
      { id: 'c', texto: 'Obligatoria y de cardinalidad muchos.' },
      { id: 'd', texto: 'Opcional y de cardinalidad muchos.' }
    ],
    correctas: ['a'],
    explicacion: '"Debe" indica obligatoriedad (línea continua) y "uno y solo uno" indica cardinalidad uno.',
    porQueNo: {
      b: '"Debe" expresa obligatoriedad; opcional sería "puede".',
      c: 'Cada empleado tiene un solo departamento.',
      d: 'Ni es opcional ni de cardinalidad muchos.'
    }
  },
  {
    id: 'F050', examen: 'foundation', tema: 'Modelado de datos',
    tipo: 'unica',
    enunciado: '¿Cuál es el objetivo principal de la normalización?',
    opciones: [
      { id: 'a', texto: 'Reducir la redundancia de datos y evitar anomalías de inserción, actualización y borrado.' },
      { id: 'b', texto: 'Aumentar el número de tablas para mejorar la seguridad.' },
      { id: 'c', texto: 'Hacer que todas las consultas usen un solo join.' },
      { id: 'd', texto: 'Convertir todos los atributos en claves primarias.' }
    ],
    correctas: ['a'],
    explicacion: 'Normalizar consiste en organizar los atributos de modo que cada dato se guarde en un solo lugar, evitando duplicación e inconsistencias.',
    porQueNo: {
      b: 'El número de tablas aumenta como efecto, no como objetivo, y no tiene que ver con la seguridad.',
      c: 'Una base normalizada suele requerir más joins, no menos.',
      d: 'Solo los identificadores forman la clave primaria.'
    }
  },
  {
    id: 'F051', examen: 'foundation', tema: 'Introducción a SQL',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: si COMMISSION es NULL, la expresión `salary + commission` devuelve el valor de SALARY.',
    opciones: [
      { id: 'a', texto: 'Falso' },
      { id: 'b', texto: 'Verdadero' }
    ],
    correctas: ['a'],
    explicacion: 'Cualquier operación aritmética con NULL da NULL. Para tratar NULL como 0 se usa NVL(commission, 0).',
    porQueNo: {
      b: 'NULL no equivale a cero: salary + NULL es NULL.'
    }
  },
  {
    id: 'F052', examen: 'foundation', tema: 'Modelos conceptual, lógico y físico',
    tipo: 'unica',
    enunciado: '¿A qué tipo de usuario está dirigido principalmente el modelo conceptual?',
    opciones: [
      { id: 'a', texto: 'A los usuarios y responsables del negocio, para validar que se entienden sus necesidades de información.' },
      { id: 'b', texto: 'Al DBA, para configurar el almacenamiento.' },
      { id: 'c', texto: 'Al programador, para escribir las sentencias SQL.' },
      { id: 'd', texto: 'Al sistema operativo, para reservar espacio en disco.' }
    ],
    correctas: ['a'],
    explicacion: 'El modelo conceptual usa términos del negocio y omite detalles técnicos, por lo que sirve para validar los requisitos con los usuarios.',
    porQueNo: {
      b: 'El almacenamiento se define en el modelo físico.',
      c: 'El programador trabaja sobre el modelo físico (tablas y columnas).',
      d: 'Los modelos de datos no están dirigidos al sistema operativo.'
    }
  }
];
