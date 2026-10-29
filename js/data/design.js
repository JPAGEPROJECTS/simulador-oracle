/* Banco: Database Design (Oracle Academy) */
var BANCO_DESIGN = [
  {
    id: 'D001', examen: 'design', tema: 'Entidades y atributos',
    tipo: 'unica',
    enunciado: 'Una entidad EMPLEADO tiene el atributo "edad", calculado a partir de la fecha de nacimiento. ¿Cómo se clasifica la edad y qué es preferible almacenar?',
    opciones: [
      { id: 'a', texto: 'Es un atributo volátil; es preferible almacenar la fecha de nacimiento.' },
      { id: 'b', texto: 'Es un atributo no volátil; es preferible almacenar la edad.' },
      { id: 'c', texto: 'Es un UID; debe almacenarse como clave primaria.' },
      { id: 'd', texto: 'Es un atributo obligatorio; deben almacenarse ambos siempre.' }
    ],
    correctas: ['a'],
    explicacion: 'Un atributo volátil cambia con el tiempo (la edad cambia cada año). Se prefiere almacenar un atributo no volátil, como la fecha de nacimiento, y calcular la edad cuando se necesite.',
    porQueNo: {
      b: 'La edad cambia constantemente, por lo que es volátil; almacenarla obliga a actualizarla periódicamente.',
      c: 'La edad no identifica de forma única a un empleado.',
      d: 'Guardar ambos introduce redundancia y riesgo de inconsistencia; la edad se deriva de la fecha de nacimiento.'
    }
  },
  {
    id: 'D002', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'unica',
    enunciado: 'Regla de negocio: "Cada pedido debe ser realizado por un único cliente. Un cliente puede realizar uno o muchos pedidos". Desde el lado de CLIENTE, ¿cómo se describe la relación?',
    opciones: [
      { id: 'a', texto: 'Opcional y de cardinalidad "uno o muchos" (pata de gallo con línea discontinua).' },
      { id: 'b', texto: 'Obligatoria y de cardinalidad "uno o muchos".' },
      { id: 'c', texto: 'Opcional y de cardinalidad "uno y solo uno".' },
      { id: 'd', texto: 'Obligatoria y de cardinalidad "uno y solo uno".' }
    ],
    correctas: ['a'],
    explicacion: '"Puede realizar" indica opcionalidad (línea discontinua en el lado CLIENTE) y "uno o muchos" indica cardinalidad muchos (pata de gallo junto a PEDIDO).',
    porQueNo: {
      b: '"Puede" expresa opcionalidad; obligatoria sería "debe realizar".',
      c: 'La cardinalidad desde CLIENTE es "uno o muchos" pedidos, no uno solo.',
      d: 'Ni es obligatoria (dice "puede") ni la cardinalidad es uno.'
    }
  },
  {
    id: 'D003', examen: 'design', tema: 'Normalización',
    tipo: 'unica',
    enunciado: 'Una entidad está en 1FN cuando...',
    opciones: [
      { id: 'a', texto: 'todos sus atributos tienen un único valor (no hay atributos multivaluados ni grupos repetitivos).' },
      { id: 'b', texto: 'ningún atributo no-UID depende de otro atributo no-UID.' },
      { id: 'c', texto: 'todos sus atributos dependen de todo el UID y no solo de una parte.' },
      { id: 'd', texto: 'no tiene relaciones con otras entidades.' }
    ],
    correctas: ['a'],
    explicacion: 'La Primera Forma Normal exige que cada atributo tenga un solo valor por instancia; los atributos multivaluados o repetidos deben llevarse a otra entidad.',
    porQueNo: {
      b: 'Eso define la Tercera Forma Normal (eliminar dependencias transitivas).',
      c: 'Eso define la Segunda Forma Normal (eliminar dependencias parciales del UID compuesto).',
      d: 'La normalización no prohíbe las relaciones; de hecho, normalizar suele crear nuevas relaciones.'
    }
  },
  {
    id: 'D004', examen: 'design', tema: 'Normalización',
    tipo: 'unica',
    enunciado: 'La entidad INSCRIPCION tiene UID compuesto (id_estudiante, id_curso) y los atributos nota y nombre_curso. ¿Qué regla se viola y por qué?',
    opciones: [
      { id: 'a', texto: '2FN, porque nombre_curso depende solo de id_curso, una parte del UID.' },
      { id: 'b', texto: '1FN, porque nombre_curso es multivaluado.' },
      { id: 'c', texto: '3FN, porque nota depende de nombre_curso.' },
      { id: 'd', texto: 'Ninguna; la entidad está en 3FN.' }
    ],
    correctas: ['a'],
    explicacion: 'Hay una dependencia parcial: nombre_curso depende únicamente de id_curso y no del UID completo. Para cumplir 2FN, nombre_curso debe moverse a la entidad CURSO.',
    porQueNo: {
      b: 'nombre_curso tiene un solo valor por instancia, así que no viola 1FN.',
      c: 'nota depende del UID completo (estudiante y curso), no de nombre_curso.',
      d: 'La dependencia parcial de nombre_curso impide que esté siquiera en 2FN.'
    }
  },
  {
    id: 'D005', examen: 'design', tema: 'Supertipos y subtipos',
    tipo: 'multiple',
    enunciado: '¿Qué dos reglas deben cumplir los subtipos de un supertipo en un ERD? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Deben ser exhaustivos: toda instancia del supertipo pertenece a algún subtipo.' },
      { id: 'b', texto: 'Deben ser mutuamente excluyentes: una instancia pertenece a un solo subtipo.' },
      { id: 'c', texto: 'Cada subtipo debe tener su propio UID distinto del supertipo.' },
      { id: 'd', texto: 'Un supertipo solo puede tener exactamente dos subtipos.' },
      { id: 'e', texto: 'Los subtipos no pueden tener atributos propios.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los subtipos deben ser exhaustivos y mutuamente excluyentes. Suele añadirse un subtipo "OTRO" para garantizar la exhaustividad.',
    porQueNo: {
      c: 'Los subtipos heredan el UID del supertipo.',
      d: 'Un supertipo puede tener dos o más subtipos.',
      e: 'Los subtipos heredan los atributos del supertipo y además pueden tener atributos y relaciones propios.'
    }
  },
  {
    id: 'D006', examen: 'design', tema: 'Identificadores únicos (UID)',
    tipo: 'unica',
    enunciado: 'Un UID formado por un atributo y una relación (barra en la relación) se denomina:',
    opciones: [
      { id: 'a', texto: 'UID con barra (UID compuesto que incluye una relación)' },
      { id: 'b', texto: 'UID artificial' },
      { id: 'c', texto: 'UID secundario' },
      { id: 'd', texto: 'UID simple' }
    ],
    correctas: ['a'],
    explicacion: 'Cuando la identificación de una entidad depende de otra, el UID incluye la relación, que se dibuja con una barra (relación "barrada"). Es típico de entidades de intersección o dependientes.',
    porQueNo: {
      b: 'Un UID artificial es un identificador creado sin significado de negocio (por ejemplo, un número consecutivo).',
      c: 'Un UID secundario es un identificador candidato alternativo que no se eligió como primario.',
      d: 'Un UID simple está formado por un único atributo.'
    }
  },
  {
    id: 'D007', examen: 'design', tema: 'Arcos',
    tipo: 'unica',
    enunciado: '¿Qué representa un arco en un ERD?',
    opciones: [
      { id: 'a', texto: 'Una relación exclusiva (OR): cada instancia participa en una sola de las relaciones del arco.' },
      { id: 'b', texto: 'Que todas las relaciones del arco son obligatorias a la vez.' },
      { id: 'c', texto: 'Una relación recursiva de la entidad consigo misma.' },
      { id: 'd', texto: 'Una relación muchos a muchos sin resolver.' }
    ],
    correctas: ['a'],
    explicacion: 'Un arco agrupa dos o más relaciones de una misma entidad e indica exclusividad: cada instancia se relaciona mediante una, y solo una, de las relaciones del arco.',
    porQueNo: {
      b: 'El arco expresa "una u otra", no "todas a la vez".',
      c: 'La relación recursiva se dibuja como un "oído de cerdo" (pig\'s ear), no como un arco.',
      d: 'Las relaciones M:M se resuelven con entidades de intersección; el arco no está relacionado con eso.'
    }
  },
  {
    id: 'D008', examen: 'design', tema: 'Jerarquías y modelado recursivo',
    tipo: 'unica',
    enunciado: 'Regla: "Cada empleado puede ser supervisado por un empleado; un empleado puede supervisar a uno o muchos empleados". ¿Cómo se modela?',
    opciones: [
      { id: 'a', texto: 'Con una relación recursiva 1:M de EMPLEADO consigo misma, opcional en ambos extremos.' },
      { id: 'b', texto: 'Creando una entidad SUPERVISOR y otra EMPLEADO con relación 1:1.' },
      { id: 'c', texto: 'Con una relación recursiva obligatoria en ambos extremos.' },
      { id: 'd', texto: 'Con un arco entre EMPLEADO y DEPARTAMENTO.' }
    ],
    correctas: ['a'],
    explicacion: 'Es una relación recursiva (pig\'s ear). Debe ser opcional en ambos extremos: el jefe máximo no tiene supervisor y muchos empleados no supervisan a nadie.',
    porQueNo: {
      b: 'Un supervisor también es un empleado; duplicar entidades genera redundancia. Además la regla es 1:M, no 1:1.',
      c: 'Si fuera obligatoria, todo empleado necesitaría un supervisor y la jerarquía no tendría fin.',
      d: 'Un arco expresa exclusividad entre relaciones, no supervisión entre empleados.'
    }
  },
  {
    id: 'D009', examen: 'design', tema: 'Modelado histórico',
    tipo: 'unica',
    enunciado: 'El negocio necesita conocer el precio que tenía cada producto en cualquier fecha pasada. ¿Cuál es el diseño más adecuado?',
    opciones: [
      { id: 'a', texto: 'Crear una entidad HISTORIAL_PRECIO con fecha de inicio, fecha de fin y precio, relacionada con PRODUCTO.' },
      { id: 'b', texto: 'Añadir a PRODUCTO los atributos precio_1, precio_2 y precio_3.' },
      { id: 'c', texto: 'Sobrescribir el precio en PRODUCTO cada vez que cambie.' },
      { id: 'd', texto: 'Guardar el precio solo en la factura.' }
    ],
    correctas: ['a'],
    explicacion: 'El modelado histórico agrega una entidad que guarda los valores a lo largo del tiempo, con fechas de vigencia, en relación 1:M con la entidad original.',
    porQueNo: {
      b: 'Son grupos repetitivos que violan 1FN y limitan la cantidad de cambios almacenables.',
      c: 'Sobrescribir pierde el historial, justo lo que el negocio necesita conservar.',
      d: 'Solo registraría los precios de productos vendidos, y no permitiría conocer el precio vigente en cualquier fecha.'
    }
  },
  {
    id: 'D010', examen: 'design', tema: 'Mapping de ERD a tablas',
    tipo: 'unica',
    enunciado: 'Al transformar a tablas una relación muchos a muchos entre ESTUDIANTE y CURSO, ¿cuál es el resultado correcto?',
    opciones: [
      { id: 'a', texto: 'Una tabla de intersección (por ejemplo, INSCRIPCION) con claves foráneas a ESTUDIANTE y a CURSO.' },
      { id: 'b', texto: 'Una clave foránea en ESTUDIANTE que referencia a CURSO.' },
      { id: 'c', texto: 'Una clave foránea en CURSO que referencia a ESTUDIANTE.' },
      { id: 'd', texto: 'Una sola tabla ESTUDIANTE_CURSO que reemplaza a ambas.' }
    ],
    correctas: ['a'],
    explicacion: 'Las relaciones M:M se resuelven con una entidad (tabla) de intersección, cuya clave primaria suele componerse de las dos claves foráneas.',
    porQueNo: {
      b: 'Una FK en ESTUDIANTE solo permitiría un curso por estudiante.',
      c: 'Una FK en CURSO solo permitiría un estudiante por curso.',
      d: 'Combinar ambas entidades duplicaría datos y violaría la normalización.'
    }
  },
  {
    id: 'D011', examen: 'design', tema: 'Reglas de negocio',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: la regla "un empleado no puede tener un salario mayor que el de su gerente" puede representarse completamente en un ERD mediante cardinalidad y opcionalidad.',
    opciones: [
      { id: 'a', texto: 'Falso' },
      { id: 'b', texto: 'Verdadero' }
    ],
    correctas: ['a'],
    explicacion: 'Es una regla de negocio procedimental: no se puede expresar con la notación del ERD y debe documentarse aparte e implementarse con código (por ejemplo, triggers o lógica de aplicación).',
    porQueNo: {
      b: 'La cardinalidad y la opcionalidad solo indican cuántas instancias se relacionan y si la relación es obligatoria; no comparan valores de atributos.'
    }
  },
{
    id: 'D012', examen: 'design', tema: 'Entidades y atributos',
    tipo: 'unica',
    enunciado: 'Según las convenciones de dibujo de ERD de Oracle, ¿cómo se nombra una entidad?',
    opciones: [
      { id: 'a', texto: 'Con un sustantivo en singular y en mayúsculas, dentro de una caja de esquinas redondeadas.' },
      { id: 'b', texto: 'Con un sustantivo en plural y en minúsculas.' },
      { id: 'c', texto: 'Con un verbo en infinitivo.' },
      { id: 'd', texto: 'Con el prefijo TBL_ seguido del nombre.' }
    ],
    correctas: ['a'],
    explicacion: 'En la notación de Oracle (Barker) las entidades se dibujan como "softboxes" con el nombre en singular y en mayúsculas (por ejemplo, EMPLOYEE), porque representan el tipo de una instancia.',
    porQueNo: {
      b: 'El plural se reserva para los nombres de tabla en el modelo físico.',
      c: 'Los verbos se usan para nombrar relaciones, no entidades.',
      d: 'Los prefijos técnicos no forman parte de un modelo conceptual.'
    }
  },
  {
    id: 'D013', examen: 'design', tema: 'Entidades y atributos',
    tipo: 'unica',
    enunciado: 'En un sistema de biblioteca, ¿cuál de los siguientes elementos debería modelarse como atributo y no como entidad?',
    opciones: [
      { id: 'a', texto: 'Fecha de devolución' },
      { id: 'b', texto: 'Libro' },
      { id: 'c', texto: 'Socio' },
      { id: 'd', texto: 'Préstamo' }
    ],
    correctas: ['a'],
    explicacion: 'La fecha de devolución es un valor único que describe a otra cosa (el préstamo). Libro, socio y préstamo son "cosas" de interés con sus propios atributos e instancias.',
    porQueNo: {
      b: 'Un libro tiene atributos propios (título, ISBN...) y muchas instancias: es una entidad.',
      c: 'Un socio tiene atributos propios (nombre, número de socio...): es una entidad.',
      d: 'Un préstamo es un evento con atributos (fechas) y relaciones con libro y socio: es una entidad.'
    }
  },
  {
    id: 'D014', examen: 'design', tema: 'Entidades y atributos',
    tipo: 'unica',
    enunciado: 'En la notación de Oracle, ¿qué indican los símbolos #, * y o delante de los atributos?',
    opciones: [
      { id: 'a', texto: '# parte del UID, * obligatorio, o opcional' },
      { id: 'b', texto: '# opcional, * UID, o obligatorio' },
      { id: 'c', texto: '# clave foránea, * índice, o columna calculada' },
      { id: 'd', texto: '# numérico, * texto, o fecha' }
    ],
    correctas: ['a'],
    explicacion: 'El numeral marca los atributos que forman el identificador único; el asterisco, los atributos obligatorios; y la "o", los opcionales.',
    porQueNo: {
      b: 'Asigna los significados al revés.',
      c: 'Las claves foráneas e índices no aparecen en el ERD conceptual.',
      d: 'Los símbolos no indican tipos de datos.'
    }
  },
  {
    id: 'D015', examen: 'design', tema: 'Entidades y atributos',
    tipo: 'unica',
    enunciado: 'Un cliente puede tener varios números de teléfono. ¿Cuál es la forma correcta de modelarlo?',
    opciones: [
      { id: 'a', texto: 'Crear una entidad TELEFONO relacionada 1:M con CLIENTE.' },
      { id: 'b', texto: 'Añadir a CLIENTE los atributos telefono1, telefono2 y telefono3.' },
      { id: 'c', texto: 'Guardar todos los teléfonos separados por comas en un solo atributo.' },
      { id: 'd', texto: 'Crear un subtipo de CLIENTE por cada teléfono.' }
    ],
    correctas: ['a'],
    explicacion: 'Un atributo multivaluado viola la 1FN. Se resuelve creando una nueva entidad relacionada con la original (un cliente tiene muchos teléfonos).',
    porQueNo: {
      b: 'Son grupos repetitivos: limitan la cantidad y violan la 1FN.',
      c: 'Un atributo con varios valores viola la 1FN y dificulta las búsquedas.',
      d: 'Los subtipos clasifican instancias; no sirven para valores repetidos.'
    }
  },
  {
    id: 'D016', examen: 'design', tema: 'Entidades y atributos',
    tipo: 'multiple',
    enunciado: '¿Qué dos características debe tener una entidad? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Tener instancias (más de una ocurrencia posible).' },
      { id: 'b', texto: 'Que cada instancia pueda distinguirse de las demás mediante un UID.' },
      { id: 'c', texto: 'Tener exactamente un atributo.' },
      { id: 'd', texto: 'Nombrarse en plural.' },
      { id: 'e', texto: 'Representar un único valor, como una fecha.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Una entidad es algo de interés del que se guardan varias instancias, cada una identificable de forma única.',
    porQueNo: {
      c: 'Una entidad suele tener varios atributos que la describen.',
      d: 'Las entidades se nombran en singular.',
      e: 'Un único valor es un atributo, no una entidad.'
    }
  },
  {
    id: 'D017', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'unica',
    enunciado: 'En la frase ERDish "Cada PEDIDO debe ser realizado por uno y solo un CLIENTE", ¿qué parte expresa la cardinalidad?',
    opciones: [
      { id: 'a', texto: '"uno y solo un"' },
      { id: 'b', texto: '"debe"' },
      { id: 'c', texto: '"ser realizado por"' },
      { id: 'd', texto: '"Cada"' }
    ],
    correctas: ['a'],
    explicacion: 'ERDish tiene esta estructura: Cada ENTIDAD1 + opcionalidad (debe/puede) + nombre de la relación + cardinalidad (uno y solo un / uno o más) + ENTIDAD2.',
    porQueNo: {
      b: '"debe" expresa la opcionalidad (obligatoriedad).',
      c: 'Es el nombre de la relación.',
      d: '"Cada" inicia la frase; no expresa cardinalidad.'
    }
  },
  {
    id: 'D018', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'unica',
    enunciado: '"Un estudiante puede inscribirse en uno o muchos cursos, y un curso puede tener uno o muchos estudiantes." ¿Qué tipo de relación es?',
    opciones: [
      { id: 'a', texto: 'Muchos a muchos (M:M)' },
      { id: 'b', texto: 'Uno a muchos (1:M)' },
      { id: 'c', texto: 'Uno a uno (1:1)' },
      { id: 'd', texto: 'Recursiva' }
    ],
    correctas: ['a'],
    explicacion: 'En ambas direcciones la cardinalidad es "muchos", así que es M:M. En el modelo debe resolverse con una entidad de intersección (por ejemplo, INSCRIPCION).',
    porQueNo: {
      b: 'Sería 1:M si un curso solo pudiera tener un estudiante, o viceversa.',
      c: 'Ninguna de las dos direcciones es de cardinalidad uno.',
      d: 'Una relación recursiva une una entidad consigo misma.'
    }
  },
  {
    id: 'D019', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'multiple',
    enunciado: 'Al resolver una relación M:M con una entidad de intersección, ¿qué dos afirmaciones son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'La entidad de intersección queda en el lado "muchos" de dos relaciones 1:M.' },
      { id: 'b', texto: 'Las nuevas relaciones son obligatorias desde la entidad de intersección.' },
      { id: 'c', texto: 'La entidad de intersección no puede tener atributos propios.' },
      { id: 'd', texto: 'Las dos entidades originales se eliminan del modelo.' },
      { id: 'e', texto: 'La relación M:M original se conserva junto a la nueva entidad.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'La relación M:M se reemplaza por dos relaciones 1:M hacia la entidad de intersección. Cada instancia de la intersección debe relacionarse con una instancia de cada entidad original; con frecuencia ambas relaciones forman parte de su UID (barradas).',
    porQueNo: {
      c: 'Suele tener atributos propios, como la fecha de inscripción o la nota.',
      d: 'Las entidades originales se mantienen.',
      e: 'La relación M:M desaparece: queda reemplazada.'
    }
  },
  {
    id: 'D020', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'unica',
    enunciado: 'Una relación marcada como no transferible (con un rombo) entre CUENTA y CLIENTE significa que:',
    opciones: [
      { id: 'a', texto: 'Una vez asignada una cuenta a un cliente, no puede reasignarse a otro cliente.' },
      { id: 'b', texto: 'La relación es opcional.' },
      { id: 'c', texto: 'Un cliente solo puede tener una cuenta.' },
      { id: 'd', texto: 'La cuenta no puede eliminarse.' }
    ],
    correctas: ['a'],
    explicacion: 'La no transferibilidad indica que la instancia hija no puede "moverse" a otra instancia padre después de crearse. Es una regla que suele implementarse con código.',
    porQueNo: {
      b: 'La opcionalidad se indica con el tipo de línea, no con el rombo.',
      c: 'Eso es cardinalidad, no transferibilidad.',
      d: 'No impide eliminar la instancia, solo cambiar su padre.'
    }
  },
  {
    id: 'D021', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'unica',
    enunciado: '"Cada país debe tener una y solo una ciudad capital, y cada ciudad capital debe ser la capital de uno y solo un país." ¿Qué tipo de relación es?',
    opciones: [
      { id: 'a', texto: 'Uno a uno (1:1), obligatoria en ambos extremos.' },
      { id: 'b', texto: 'Uno a muchos (1:M).' },
      { id: 'c', texto: 'Muchos a muchos (M:M).' },
      { id: 'd', texto: 'Uno a uno (1:1), opcional en ambos extremos.' }
    ],
    correctas: ['a'],
    explicacion: 'La cardinalidad es "uno" en ambas direcciones y la palabra "debe" en ambas frases indica obligatoriedad.',
    porQueNo: {
      b: 'En ninguna dirección hay "muchos".',
      c: 'Ninguna dirección admite varias instancias.',
      d: '"Debe" expresa obligatoriedad, no opcionalidad.'
    }
  },
  {
    id: 'D022', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'unica',
    enunciado: 'Existen las relaciones EMPLEADO–DEPARTAMENTO y DEPARTAMENTO–SEDE (cada departamento está en una sede). Alguien propone añadir también una relación directa EMPLEADO–SEDE que indica la sede donde trabaja el empleado. ¿Cómo se clasifica esa nueva relación?',
    opciones: [
      { id: 'a', texto: 'Redundante, porque la sede puede obtenerse a través del departamento.' },
      { id: 'b', texto: 'Recursiva.' },
      { id: 'c', texto: 'No transferible.' },
      { id: 'd', texto: 'Obligatoria para cumplir la 3FN.' }
    ],
    correctas: ['a'],
    explicacion: 'Una relación es redundante cuando su información puede derivarse de otras relaciones existentes. En general debe eliminarse para evitar inconsistencias (salvo que signifique algo distinto para el negocio).',
    porQueNo: {
      b: 'Una relación recursiva une una entidad consigo misma.',
      c: 'La transferibilidad no tiene relación con esta situación.',
      d: 'Al contrario: duplica información que ya se puede derivar.'
    }
  },
  {
    id: 'D023', examen: 'design', tema: 'Supertipos y subtipos',
    tipo: 'unica',
    enunciado: 'El supertipo VEHICULO tiene los subtipos AUTO, CAMION, MOTOCICLETA y OTRO. ¿Para qué se incluye el subtipo OTRO?',
    opciones: [
      { id: 'a', texto: 'Para que los subtipos sean exhaustivos: todo vehículo pertenece a algún subtipo.' },
      { id: 'b', texto: 'Para que un vehículo pueda pertenecer a varios subtipos.' },
      { id: 'c', texto: 'Para almacenar los atributos comunes.' },
      { id: 'd', texto: 'Porque un supertipo debe tener al menos cuatro subtipos.' }
    ],
    correctas: ['a'],
    explicacion: 'Los subtipos deben cubrir todas las instancias del supertipo. OTRO recoge las instancias que no encajan en los subtipos específicos.',
    porQueNo: {
      b: 'Los subtipos deben ser mutuamente excluyentes.',
      c: 'Los atributos comunes van en el supertipo.',
      d: 'Un supertipo necesita al menos dos subtipos, no cuatro.'
    }
  },
  {
    id: 'D024', examen: 'design', tema: 'Supertipos y subtipos',
    tipo: 'unica',
    enunciado: 'El atributo capacidad_de_carga solo tiene sentido para los camiones. ¿Dónde debe colocarse?',
    opciones: [
      { id: 'a', texto: 'En el subtipo CAMION.' },
      { id: 'b', texto: 'En el supertipo VEHICULO, como atributo obligatorio.' },
      { id: 'c', texto: 'En todos los subtipos.' },
      { id: 'd', texto: 'En una entidad separada sin relación con VEHICULO.' }
    ],
    correctas: ['a'],
    explicacion: 'Los atributos y relaciones comunes van en el supertipo; los que solo aplican a un tipo de instancia van en el subtipo correspondiente.',
    porQueNo: {
      b: 'Sería obligatorio para autos y motocicletas, que no lo tienen.',
      c: 'No aplica a los demás subtipos.',
      d: 'Separarlo rompería el modelo y perdería la relación con el vehículo.'
    }
  },
  {
    id: 'D025', examen: 'design', tema: 'Supertipos y subtipos',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: un subtipo hereda todos los atributos y relaciones de su supertipo.',
    opciones: [
      { id: 'a', texto: 'Verdadero' },
      { id: 'b', texto: 'Falso' }
    ],
    correctas: ['a'],
    explicacion: 'Cada subtipo hereda los atributos, el UID y las relaciones del supertipo, y además puede tener atributos y relaciones propios.',
    porQueNo: {
      b: 'La herencia es precisamente la razón de usar supertipos: lo común se define una sola vez.'
    }
  },
  {
    id: 'D026', examen: 'design', tema: 'Supertipos y subtipos',
    tipo: 'multiple',
    enunciado: '¿En qué dos situaciones conviene modelar supertipos y subtipos? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Las instancias comparten atributos comunes, pero tienen atributos específicos según su tipo.' },
      { id: 'b', texto: 'Algunas relaciones solo aplican a ciertos tipos de instancias.' },
      { id: 'c', texto: 'Siempre que una entidad tenga más de cinco atributos.' },
      { id: 'd', texto: 'Para representar una relación muchos a muchos.' },
      { id: 'e', texto: 'Cuando una instancia puede pertenecer a varios subtipos a la vez.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Los subtipos son útiles cuando hay variaciones por tipo en los atributos o en las relaciones, manteniendo en el supertipo lo común.',
    porQueNo: {
      c: 'El número de atributos no es un criterio.',
      d: 'Las relaciones M:M se resuelven con entidades de intersección.',
      e: 'Los subtipos deben ser mutuamente excluyentes.'
    }
  },
  {
    id: 'D027', examen: 'design', tema: 'Reglas de negocio',
    tipo: 'unica',
    enunciado: '¿Cuál de estas reglas de negocio es estructural (puede representarse directamente en el ERD)?',
    opciones: [
      { id: 'a', texto: 'Cada empleado debe pertenecer a un departamento.' },
      { id: 'b', texto: 'Un pedido mayor de $10 000 requiere la aprobación del gerente.' },
      { id: 'c', texto: 'El descuento no puede superar el 30% del precio.' },
      { id: 'd', texto: 'Las facturas deben emitirse dentro de los 5 días posteriores a la venta.' }
    ],
    correctas: ['a'],
    explicacion: 'Las reglas estructurales se expresan con entidades, atributos, relaciones, cardinalidad y opcionalidad. Las reglas procedurales (de proceso, cálculos o condiciones sobre valores) requieren documentación y código.',
    porQueNo: {
      b: 'Es una regla procedural: depende de un valor y de un flujo de aprobación.',
      c: 'Es una restricción sobre valores calculados; se implementa con código o con CHECK, no con el ERD.',
      d: 'Es una regla de proceso basada en el tiempo.'
    }
  },
  {
    id: 'D028', examen: 'design', tema: 'Reglas de negocio',
    tipo: 'unica',
    enunciado: 'La regla "un pedido mayor de $10 000 requiere la aprobación del gerente" no puede dibujarse en el ERD. ¿Qué debe hacerse con ella?',
    opciones: [
      { id: 'a', texto: 'Documentarla e implementarla después mediante código (en la aplicación o en la base de datos).' },
      { id: 'b', texto: 'Ignorarla, porque no forma parte del modelo de datos.' },
      { id: 'c', texto: 'Crear una entidad llamada REGLA.' },
      { id: 'd', texto: 'Representarla con un arco.' }
    ],
    correctas: ['a'],
    explicacion: 'Las reglas procedurales se documentan junto al modelo para no perderlas y se implementan con programación (lógica de la aplicación, procedimientos, triggers, etc.).',
    porQueNo: {
      b: 'Ignorarla dejaría al sistema sin cumplir un requisito del negocio.',
      c: 'Una regla no es una "cosa" de la que se guarden instancias.',
      d: 'Un arco expresa exclusividad entre relaciones, no condiciones sobre valores.'
    }
  },
  {
    id: 'D029', examen: 'design', tema: 'Identificadores únicos (UID)',
    tipo: 'unica',
    enunciado: 'Cada estudiante tiene un número de carné y una cédula, ambos únicos. ¿Cómo se tratan en el modelo?',
    opciones: [
      { id: 'a', texto: 'Son UID candidatos: se elige uno como UID primario y el otro queda como UID secundario.' },
      { id: 'b', texto: 'Ambos deben formar juntos un UID compuesto.' },
      { id: 'c', texto: 'Ninguno puede ser UID, porque hay dos.' },
      { id: 'd', texto: 'Se debe eliminar uno de los dos atributos.' }
    ],
    correctas: ['a'],
    explicacion: 'Cuando varios atributos identifican de forma única, todos son candidatos. Se elige uno como primario (luego clave primaria) y los demás quedan como secundarios (luego restricciones UNIQUE).',
    porQueNo: {
      b: 'Cada uno basta por sí solo; combinarlos no es necesario.',
      c: 'Una entidad puede tener varios UID candidatos.',
      d: 'Ambos atributos pueden ser datos de negocio necesarios.'
    }
  },
  {
    id: 'D030', examen: 'design', tema: 'Identificadores únicos (UID)',
    tipo: 'unica',
    enunciado: 'Ningún atributo ni combinación de atributos de la entidad VISITANTE identifica de forma confiable a cada visitante. ¿Qué se hace?',
    opciones: [
      { id: 'a', texto: 'Crear un UID artificial, como un número de visitante.' },
      { id: 'b', texto: 'Usar el nombre del visitante aunque pueda repetirse.' },
      { id: 'c', texto: 'Dejar la entidad sin UID.' },
      { id: 'd', texto: 'Usar como UID todos los atributos opcionales.' }
    ],
    correctas: ['a'],
    explicacion: 'Cuando no existe un identificador natural confiable, se crea un UID artificial (por ejemplo, un número secuencial) sin significado de negocio.',
    porQueNo: {
      b: 'Un UID no puede tener valores repetidos.',
      c: 'Toda entidad necesita un UID para distinguir sus instancias.',
      d: 'Un UID debe ser obligatorio; los atributos opcionales pueden faltar.'
    }
  },
  {
    id: 'D031', examen: 'design', tema: 'Identificadores únicos (UID)',
    tipo: 'multiple',
    enunciado: '¿Qué dos afirmaciones sobre los identificadores únicos son verdaderas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Un UID puede estar compuesto por varios atributos.' },
      { id: 'b', texto: 'Un UID puede incluir una o más relaciones (relaciones barradas).' },
      { id: 'c', texto: 'Un atributo opcional puede formar parte del UID.' },
      { id: 'd', texto: 'El valor del UID de una instancia debería cambiar con frecuencia.' },
      { id: 'e', texto: 'Una entidad solo puede tener un UID candidato.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Un UID puede ser simple (un atributo), compuesto (varios atributos) o incluir relaciones (barra). Debe ser obligatorio y estable.',
    porQueNo: {
      c: 'Todos los componentes de un UID deben ser obligatorios.',
      d: 'Un buen UID es estable; cambiarlo afecta a todas las relaciones que lo usan.',
      e: 'Puede haber varios candidatos; se elige uno como primario.'
    }
  },
{
    id: 'D032', examen: 'design', tema: 'Normalización',
    tipo: 'unica',
    enunciado: 'La entidad CLIENTE tiene el atributo telefonos, que guarda valores como "6000-1111, 6000-2222". ¿Qué forma normal se viola?',
    opciones: [
      { id: 'a', texto: 'Primera forma normal (1FN)' },
      { id: 'b', texto: 'Segunda forma normal (2FN)' },
      { id: 'c', texto: 'Tercera forma normal (3FN)' },
      { id: 'd', texto: 'Ninguna' }
    ],
    correctas: ['a'],
    explicacion: 'La 1FN exige que cada atributo tenga un único valor por instancia. Un atributo con varios teléfonos es multivaluado.',
    porQueNo: {
      b: 'La 2FN trata de dependencias parciales de un UID compuesto.',
      c: 'La 3FN trata de dependencias entre atributos que no forman el UID.',
      d: 'Un atributo multivaluado viola la 1FN.'
    }
  },
  {
    id: 'D033', examen: 'design', tema: 'Normalización',
    tipo: 'unica',
    enunciado: 'La entidad EMPLEADO tiene el UID id_empleado y los atributos nombre, cod_departamento y nombre_departamento. ¿Qué forma normal se viola?',
    opciones: [
      { id: 'a', texto: 'Tercera forma normal (3FN), porque nombre_departamento depende de cod_departamento.' },
      { id: 'b', texto: 'Segunda forma normal (2FN), porque el UID es compuesto.' },
      { id: 'c', texto: 'Primera forma normal (1FN), porque hay dos atributos de departamento.' },
      { id: 'd', texto: 'Ninguna; la entidad está normalizada.' }
    ],
    correctas: ['a'],
    explicacion: 'nombre_departamento no depende directamente del UID, sino de otro atributo que no es UID (cod_departamento): es una dependencia transitiva. Se resuelve creando la entidad DEPARTAMENTO.',
    porQueNo: {
      b: 'El UID es simple (id_empleado), por lo que no puede haber dependencias parciales.',
      c: 'Cada atributo tiene un solo valor, así que cumple la 1FN.',
      d: 'La dependencia transitiva viola la 3FN.'
    }
  },
  {
    id: 'D034', examen: 'design', tema: 'Normalización',
    tipo: 'unica',
    enunciado: 'Verdadero o falso: una entidad en 1FN cuyo UID está formado por un único atributo está automáticamente en 2FN.',
    opciones: [
      { id: 'a', texto: 'Verdadero' },
      { id: 'b', texto: 'Falso' }
    ],
    correctas: ['a'],
    explicacion: 'La 2FN prohíbe que un atributo dependa solo de una parte del UID. Si el UID tiene un solo atributo, no hay "partes", así que no puede haber dependencias parciales.',
    porQueNo: {
      b: 'Las dependencias parciales solo son posibles con UID compuestos.'
    }
  },
  {
    id: 'D035', examen: 'design', tema: 'Normalización',
    tipo: 'multiple',
    enunciado: 'Una entidad viola la 3FN. ¿Qué dos acciones forman parte de la corrección? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Mover los atributos que dependen de otro atributo no-UID a una nueva entidad.' },
      { id: 'b', texto: 'Relacionar la nueva entidad con la entidad original.' },
      { id: 'c', texto: 'Eliminar el UID de la entidad original.' },
      { id: 'd', texto: 'Duplicar los atributos movidos en ambas entidades.' },
      { id: 'e', texto: 'Convertir todos los atributos en opcionales.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Se extraen los atributos con dependencia transitiva a una nueva entidad (cuyo UID es el atributo del que dependían) y se crea una relación entre ambas.',
    porQueNo: {
      c: 'La entidad original conserva su UID.',
      d: 'Duplicarlos mantendría la redundancia que se quiere eliminar.',
      e: 'La normalización no cambia la opcionalidad de los atributos.'
    }
  },
  {
    id: 'D036', examen: 'design', tema: 'Normalización',
    tipo: 'unica',
    enunciado: 'La entidad LINEA_FACTURA tiene los atributos cantidad, precio_unitario y total (cantidad × precio_unitario). ¿Qué recomienda el diseño normalizado sobre total?',
    opciones: [
      { id: 'a', texto: 'No almacenarlo, porque es un atributo derivado que puede calcularse.' },
      { id: 'b', texto: 'Hacerlo parte del UID.' },
      { id: 'c', texto: 'Moverlo a una entidad TOTAL.' },
      { id: 'd', texto: 'Guardarlo dos veces para mayor seguridad.' }
    ],
    correctas: ['a'],
    explicacion: 'Los atributos derivados (calculables a partir de otros) generan redundancia y riesgo de inconsistencia, por lo que en general no se almacenan.',
    porQueNo: {
      b: 'Un valor calculado no identifica a la línea de factura.',
      c: 'No es una "cosa" con instancias propias.',
      d: 'Guardarlo dos veces aumenta la redundancia.'
    }
  },
  {
    id: 'D037', examen: 'design', tema: 'Arcos',
    tipo: 'unica',
    enunciado: '¿Qué regla deben cumplir las relaciones incluidas en un mismo arco?',
    opciones: [
      { id: 'a', texto: 'Deben salir de la misma entidad y tener la misma opcionalidad.' },
      { id: 'b', texto: 'Deben ser todas relaciones M:M.' },
      { id: 'c', texto: 'Deben conectar siempre las mismas dos entidades.' },
      { id: 'd', texto: 'Deben ser recursivas.' }
    ],
    correctas: ['a'],
    explicacion: 'Un arco agrupa relaciones que parten de una misma entidad y son mutuamente excluyentes. Todas deben ser obligatorias u opcionales a la vez.',
    porQueNo: {
      b: 'Las relaciones de un arco suelen ser 1:M; las M:M deben resolverse.',
      c: 'Cada relación del arco conecta con una entidad distinta.',
      d: 'No tienen por qué ser recursivas.'
    }
  },
  {
    id: 'D038', examen: 'design', tema: 'Arcos',
    tipo: 'unica',
    enunciado: '"Cada cuenta bancaria pertenece a una persona o a una empresa, pero no a ambas." ¿Qué elemento del ERD modela mejor esta regla?',
    opciones: [
      { id: 'a', texto: 'Un arco sobre las relaciones CUENTA–PERSONA y CUENTA–EMPRESA.' },
      { id: 'b', texto: 'Una relación recursiva en CUENTA.' },
      { id: 'c', texto: 'Una relación M:M entre PERSONA y EMPRESA.' },
      { id: 'd', texto: 'Un atributo opcional en CUENTA.' }
    ],
    correctas: ['a'],
    explicacion: 'Un arco expresa exclusividad: cada cuenta participa en una sola de las relaciones del arco.',
    porQueNo: {
      b: 'La regla no relaciona cuentas entre sí.',
      c: 'La regla trata sobre a quién pertenece la cuenta, no sobre personas y empresas.',
      d: 'Un atributo no representa la relación ni garantiza la exclusividad.'
    }
  },
  {
    id: 'D039', examen: 'design', tema: 'Arcos',
    tipo: 'unica',
    enunciado: 'El arco entre CUENTA–PERSONA y CUENTA–EMPRESA también podría modelarse de otra forma. ¿Cuál?',
    opciones: [
      { id: 'a', texto: 'Con un supertipo TITULAR, con subtipos PERSONA y EMPRESA, y una sola relación CUENTA–TITULAR.' },
      { id: 'b', texto: 'Con una relación recursiva en TITULAR.' },
      { id: 'c', texto: 'Eliminando la entidad CUENTA.' },
      { id: 'd', texto: 'Con dos relaciones obligatorias sin arco.' }
    ],
    correctas: ['a'],
    explicacion: 'Un arco y una estructura supertipo/subtipo suelen ser alternativas: si las entidades del arco comparten características, se pueden convertir en subtipos de un supertipo común.',
    porQueNo: {
      b: 'La recursividad no expresa exclusividad entre tipos de titular.',
      c: 'CUENTA sigue siendo necesaria.',
      d: 'Dos relaciones obligatorias exigirían que la cuenta tuviera persona y empresa a la vez.'
    }
  },
  {
    id: 'D040', examen: 'design', tema: 'Jerarquías y modelado recursivo',
    tipo: 'unica',
    enunciado: 'Una empresa se organiza en divisiones, cada división en departamentos y cada departamento en equipos. Cada nivel tiene atributos distintos. ¿Cómo se modela mejor?',
    opciones: [
      { id: 'a', texto: 'Como una jerarquía de entidades separadas (DIVISION, DEPARTAMENTO, EQUIPO) unidas por relaciones 1:M.' },
      { id: 'b', texto: 'Con una sola entidad UNIDAD con una relación recursiva, aunque los niveles tengan atributos distintos.' },
      { id: 'c', texto: 'Con una relación M:M entre DIVISION y EQUIPO.' },
      { id: 'd', texto: 'Con un arco entre los tres niveles.' }
    ],
    correctas: ['a'],
    explicacion: 'Si el número de niveles es fijo y cada nivel tiene atributos o reglas distintas, se usa una jerarquía de entidades. La relación recursiva es preferible cuando todos los niveles son del mismo tipo y la profundidad puede variar.',
    porQueNo: {
      b: 'Una sola entidad obligaría a mezclar atributos que no aplican a todos los niveles.',
      c: 'La estructura es jerárquica (1:M), no M:M.',
      d: 'Un arco expresa exclusividad entre relaciones, no niveles jerárquicos.'
    }
  },
  {
    id: 'D041', examen: 'design', tema: 'Jerarquías y modelado recursivo',
    tipo: 'unica',
    enunciado: '¿Cómo se implementa en tablas una relación recursiva 1:M, como "un empleado puede supervisar a muchos empleados"?',
    opciones: [
      { id: 'a', texto: 'Con una columna de clave foránea en la misma tabla (por ejemplo, MANAGER_ID) que referencia a su propia clave primaria.' },
      { id: 'b', texto: 'Creando una tabla SUPERVISORES con los mismos datos que EMPLEADOS.' },
      { id: 'c', texto: 'Con una columna NOT NULL que referencia a otra tabla.' },
      { id: 'd', texto: 'Las relaciones recursivas no pueden implementarse en tablas.' }
    ],
    correctas: ['a'],
    explicacion: 'La FK autorreferenciada (MANAGER_ID → EMPLOYEE_ID) implementa la relación. Debe admitir NULL, porque el jefe máximo no tiene supervisor.',
    porQueNo: {
      b: 'Duplicaría los datos de los empleados que son supervisores.',
      c: 'La FK apunta a la misma tabla y debe admitir NULL.',
      d: 'Se implementan sin problemas con una FK autorreferenciada.'
    }
  },
  {
    id: 'D042', examen: 'design', tema: 'Jerarquías y modelado recursivo',
    tipo: 'unica',
    enunciado: 'Un PRODUCTO puede estar compuesto por muchos productos, y un producto puede formar parte de muchos productos (lista de materiales). ¿Cómo se modela?',
    opciones: [
      { id: 'a', texto: 'Con una entidad de intersección (por ejemplo, COMPONENTE) que tiene dos relaciones hacia PRODUCTO.' },
      { id: 'b', texto: 'Con una relación recursiva 1:M en PRODUCTO.' },
      { id: 'c', texto: 'Con un arco en PRODUCTO.' },
      { id: 'd', texto: 'Con subtipos PRODUCTO_COMPUESTO y PRODUCTO_SIMPLE sin relaciones.' }
    ],
    correctas: ['a'],
    explicacion: 'Es una relación recursiva M:M. Se resuelve como cualquier M:M: una entidad de intersección con dos relaciones 1:M hacia la misma entidad (el producto "padre" y el producto "componente"), que puede guardar la cantidad.',
    porQueNo: {
      b: 'Una relación 1:M no permite que un componente forme parte de varios productos.',
      c: 'No hay exclusividad entre relaciones.',
      d: 'Sin relaciones no se puede saber qué productos forman a otros.'
    }
  },
  {
    id: 'D043', examen: 'design', tema: 'Modelado histórico',
    tipo: 'multiple',
    enunciado: '¿En qué dos situaciones se necesita modelado histórico? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'El negocio necesita conocer los valores anteriores de un atributo, como los precios pasados.' },
      { id: 'b', texto: 'Hay que conservar a lo largo del tiempo los cambios de una relación, como los departamentos en los que trabajó un empleado.' },
      { id: 'c', texto: 'Los atributos nunca cambian.' },
      { id: 'd', texto: 'La entidad tiene pocos atributos.' },
      { id: 'e', texto: 'Se quiere borrar automáticamente los datos antiguos.' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'El modelado histórico se usa cuando hay que consultar el estado pasado de atributos o relaciones (auditoría, historial de precios, asignaciones).',
    porQueNo: {
      c: 'Si nada cambia, no hay historia que conservar.',
      d: 'El número de atributos no determina la necesidad de historia.',
      e: 'El modelado histórico conserva datos, no los elimina.'
    }
  },
  {
    id: 'D044', examen: 'design', tema: 'Modelado histórico',
    tipo: 'unica',
    enunciado: 'La entidad HISTORIAL_PRECIO guarda los precios de cada PRODUCTO con su fecha de inicio. ¿Cuál es un UID adecuado para HISTORIAL_PRECIO?',
    opciones: [
      { id: 'a', texto: 'La relación con PRODUCTO (barrada) más la fecha de inicio.' },
      { id: 'b', texto: 'Solo el precio.' },
      { id: 'c', texto: 'Solo la fecha de inicio.' },
      { id: 'd', texto: 'Solo la relación con PRODUCTO.' }
    ],
    correctas: ['a'],
    explicacion: 'Un producto tiene muchos precios a lo largo del tiempo, pero solo uno que empieza en cada fecha. Por eso el UID combina el producto (relación barrada) y la fecha de inicio.',
    porQueNo: {
      b: 'Varios productos (o el mismo en distintas fechas) pueden tener el mismo precio.',
      c: 'Muchos productos pueden cambiar de precio el mismo día.',
      d: 'Un producto tiene varias filas de historial, así que no basta.'
    }
  },
  {
    id: 'D045', examen: 'design', tema: 'Modelado histórico',
    tipo: 'unica',
    enunciado: 'Se necesita saber en qué departamento estuvo cada empleado en cada periodo. ¿Qué diseño es el adecuado?',
    opciones: [
      { id: 'a', texto: 'Una entidad ASIGNACION entre EMPLEADO y DEPARTAMENTO, con fecha de inicio y fecha de fin.' },
      { id: 'b', texto: 'Un atributo departamento_anterior en EMPLEADO.' },
      { id: 'c', texto: 'Actualizar el departamento del empleado cada vez que cambia.' },
      { id: 'd', texto: 'Un subtipo de EMPLEADO por cada departamento.' }
    ],
    correctas: ['a'],
    explicacion: 'A lo largo del tiempo, un empleado se relaciona con muchos departamentos y un departamento con muchos empleados (M:M temporal). Una entidad de intersección con fechas conserva todo el historial.',
    porQueNo: {
      b: 'Solo guardaría un cambio, no todo el historial.',
      c: 'Sobrescribir pierde la historia.',
      d: 'Los subtipos clasifican instancias; no registran periodos.'
    }
  },
  {
    id: 'D046', examen: 'design', tema: 'Mapping de ERD a tablas',
    tipo: 'unica',
    enunciado: 'Un supertipo y sus subtipos se implementan con una sola tabla (implementación de tabla única). ¿Qué columna suele añadirse?',
    opciones: [
      { id: 'a', texto: 'Una columna discriminadora que indica el subtipo de cada fila (por ejemplo, TIPO).' },
      { id: 'b', texto: 'Una clave foránea hacia cada subtipo.' },
      { id: 'c', texto: 'Una columna por cada instancia.' },
      { id: 'd', texto: 'Ninguna; las columnas de los subtipos bastan.' }
    ],
    correctas: ['a'],
    explicacion: 'En la implementación de tabla única, todas las columnas de supertipo y subtipos van en una tabla, y una columna de tipo indica a qué subtipo pertenece cada fila. Las columnas específicas de un subtipo deben admitir NULL.',
    porQueNo: {
      b: 'En la implementación de tabla única no hay tablas separadas de subtipos.',
      c: 'Las instancias son filas, no columnas.',
      d: 'Sin una columna de tipo no se sabría a qué subtipo pertenece cada fila.'
    }
  },
  {
    id: 'D047', examen: 'design', tema: 'Mapping de ERD a tablas',
    tipo: 'unica',
    enunciado: 'Un arco obligatorio indica que cada CUENTA pertenece a una PERSONA o a una EMPRESA. Al implementarlo en la tabla CUENTAS con las FK PERSONA_ID y EMPRESA_ID, ¿qué restricción garantiza el arco?',
    opciones: [
      { id: 'a', texto: 'Una restricción CHECK que exige que exactamente una de las dos columnas tenga valor.' },
      { id: 'b', texto: 'NOT NULL en ambas columnas.' },
      { id: 'c', texto: 'UNIQUE en ambas columnas.' },
      { id: 'd', texto: 'Ninguna; el arco no puede implementarse.' }
    ],
    correctas: ['a'],
    explicacion: 'Cada relación del arco se convierte en una FK que admite NULL, y una CHECK garantiza la exclusividad, por ejemplo: CHECK ((persona_id IS NOT NULL AND empresa_id IS NULL) OR (persona_id IS NULL AND empresa_id IS NOT NULL)).',
    porQueNo: {
      b: 'Exigiría que la cuenta perteneciera a ambos a la vez.',
      c: 'UNIQUE no expresa exclusividad entre dos columnas.',
      d: 'Se implementa con FK opcionales y una restricción CHECK.'
    }
  },
  {
    id: 'D048', examen: 'design', tema: 'Mapping de ERD a tablas',
    tipo: 'unica',
    enunciado: 'La entidad LINEA_PEDIDO tiene como UID la relación barrada con PEDIDO más el atributo numero_linea. ¿Cuál es la clave primaria de la tabla LINEAS_PEDIDO?',
    opciones: [
      { id: 'a', texto: 'Compuesta: (PEDIDO_ID, NUMERO_LINEA), donde PEDIDO_ID también es FK.' },
      { id: 'b', texto: 'Solo NUMERO_LINEA.' },
      { id: 'c', texto: 'Solo PEDIDO_ID.' },
      { id: 'd', texto: 'Una columna nueva sin relación con PEDIDO.' }
    ],
    correctas: ['a'],
    explicacion: 'Una relación barrada forma parte del UID, por lo que la FK resultante se incluye en la clave primaria junto con los atributos del UID.',
    porQueNo: {
      b: 'El número de línea se repite en cada pedido (1, 2, 3...).',
      c: 'Un pedido tiene varias líneas.',
      d: 'Eso ignora el UID definido en el modelo.'
    }
  },
  {
    id: 'D049', examen: 'design', tema: 'Mapping de ERD a tablas',
    tipo: 'unica',
    enunciado: 'Al transformar el modelo a tablas, ¿cómo se implementa un UID secundario (por ejemplo, la cédula de un estudiante)?',
    opciones: [
      { id: 'a', texto: 'Con una restricción UNIQUE (y NOT NULL si es obligatorio).' },
      { id: 'b', texto: 'Con una segunda clave primaria.' },
      { id: 'c', texto: 'Con una clave foránea.' },
      { id: 'd', texto: 'Con una restricción CHECK.' }
    ],
    correctas: ['a'],
    explicacion: 'El UID primario se convierte en la PRIMARY KEY; los UID secundarios, en restricciones UNIQUE.',
    porQueNo: {
      b: 'Una tabla solo puede tener una clave primaria.',
      c: 'Las claves foráneas implementan relaciones.',
      d: 'CHECK valida condiciones sobre valores, no unicidad.'
    }
  },
  {
    id: 'D050', examen: 'design', tema: 'Mapping de ERD a tablas',
    tipo: 'multiple',
    enunciado: '¿Qué dos transformaciones del ERD a tablas son correctas? (Elige dos)',
    opciones: [
      { id: 'a', texto: 'Entidad → tabla' },
      { id: 'b', texto: 'Relación 1:M → clave foránea en la tabla del lado "muchos"' },
      { id: 'c', texto: 'Atributo → índice' },
      { id: 'd', texto: 'UID → secuencia' },
      { id: 'e', texto: 'Relación M:M → clave foránea en ambas tablas' }
    ],
    correctas: ['a', 'b'],
    explicacion: 'Correspondencias básicas: entidad → tabla, atributo → columna, UID → clave primaria, relación 1:M → FK en el lado "muchos".',
    porQueNo: {
      c: 'Un atributo se convierte en columna.',
      d: 'Un UID se convierte en clave primaria (una secuencia solo puede generar sus valores).',
      e: 'Una relación M:M se resuelve con una tabla de intersección.'
    }
  },
  {
    id: 'D051', examen: 'design', tema: 'Relaciones (cardinalidad y opcionalidad)',
    tipo: 'unica',
    enunciado: '¿Para qué se usa un diagrama de matriz (matrix diagram) durante el modelado?',
    opciones: [
      { id: 'a', texto: 'Para identificar sistemáticamente qué pares de entidades están relacionados.' },
      { id: 'b', texto: 'Para calcular el tamaño de las tablas.' },
      { id: 'c', texto: 'Para definir los índices.' },
      { id: 'd', texto: 'Para escribir las sentencias SQL.' }
    ],
    correctas: ['a'],
    explicacion: 'El diagrama de matriz coloca las entidades en filas y columnas; en cada celda se anota si existe relación entre ese par y cómo se llama, para no omitir ninguna.',
    porQueNo: {
      b: 'El tamaño de las tablas es un tema del diseño físico.',
      c: 'Los índices se definen en el diseño físico.',
      d: 'El diagrama de matriz se usa en el modelado conceptual, no para escribir SQL.'
    }
  },
  {
    id: 'D052', examen: 'design', tema: 'Reglas de negocio',
    tipo: 'unica',
    enunciado: 'En lugar de crear una entidad para cada tipo de producto (LIBRO, DISCO, PELICULA...), se crea una entidad PRODUCTO con una relación hacia TIPO_PRODUCTO. ¿Cuál es la principal ventaja de este modelo genérico?',
    opciones: [
      { id: 'a', texto: 'Permite añadir nuevos tipos de producto sin cambiar la estructura del modelo.' },
      { id: 'b', texto: 'Permite representar más reglas de negocio específicas de cada tipo.' },
      { id: 'c', texto: 'Elimina la necesidad de un UID.' },
      { id: 'd', texto: 'Hace innecesarias las relaciones.' }
    ],
    correctas: ['a'],
    explicacion: 'Un modelo genérico es más flexible: un tipo nuevo es solo una instancia más de TIPO_PRODUCTO. A cambio, se pierden reglas específicas que un modelo más detallado podría expresar.',
    porQueNo: {
      b: 'Ocurre lo contrario: al generalizar se pierde detalle sobre las reglas de cada tipo.',
      c: 'Las entidades siguen necesitando UID.',
      d: 'Se mantienen las relaciones, incluida la nueva con TIPO_PRODUCTO.'
    }
  }
];
