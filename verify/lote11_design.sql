-- Lote 11 (Database Design): implementaciones ejecutables (D041, D047, D048, D049)
SET FEEDBACK ON
SET LINESIZE 200

PROMPT ==== D041 FK autorreferenciada que admite NULL
CREATE TABLE emps (emp_id NUMBER PRIMARY KEY, manager_id NUMBER REFERENCES emps (emp_id));
INSERT INTO emps VALUES (1, NULL);
INSERT INTO emps VALUES (2, 1);
INSERT INTO emps VALUES (3, 99);
DROP TABLE emps PURGE;

PROMPT ==== D047 arco con CHECK de exclusividad (esperado: 1 y 2 OK; ambas o ninguna ORA-02290)
CREATE TABLE personas (persona_id NUMBER PRIMARY KEY);
CREATE TABLE empresas (empresa_id NUMBER PRIMARY KEY);
CREATE TABLE cuentas (
  cuenta_id  NUMBER PRIMARY KEY,
  persona_id NUMBER REFERENCES personas (persona_id),
  empresa_id NUMBER REFERENCES empresas (empresa_id),
  CONSTRAINT cuentas_arc_ck CHECK ((persona_id IS NOT NULL AND empresa_id IS NULL)
                                OR (persona_id IS NULL AND empresa_id IS NOT NULL)));
INSERT INTO personas VALUES (1);
INSERT INTO empresas VALUES (1);
INSERT INTO cuentas VALUES (1, 1, NULL);
INSERT INTO cuentas VALUES (2, NULL, 1);
INSERT INTO cuentas VALUES (3, 1, 1);
INSERT INTO cuentas VALUES (4, NULL, NULL);
DROP TABLE cuentas PURGE;
DROP TABLE personas PURGE;
DROP TABLE empresas PURGE;

PROMPT ==== D048 PK compuesta con FK (relacion barrada): linea 1 en dos pedidos OK; repetida ORA-00001
CREATE TABLE pedidos (pedido_id NUMBER PRIMARY KEY);
CREATE TABLE lineas_pedido (
  pedido_id    NUMBER REFERENCES pedidos (pedido_id),
  numero_linea NUMBER,
  CONSTRAINT lineas_pk PRIMARY KEY (pedido_id, numero_linea));
INSERT INTO pedidos VALUES (1);
INSERT INTO pedidos VALUES (2);
INSERT INTO lineas_pedido VALUES (1, 1);
INSERT INTO lineas_pedido VALUES (2, 1);
INSERT INTO lineas_pedido VALUES (1, 1);
DROP TABLE lineas_pedido PURGE;
DROP TABLE pedidos PURGE;

PROMPT ==== D049 UID secundario como UNIQUE NOT NULL
CREATE TABLE estudiantes (carne NUMBER PRIMARY KEY, cedula VARCHAR2(15) NOT NULL CONSTRAINT est_cedula_uk UNIQUE);
INSERT INTO estudiantes VALUES (1, '8-123-456');
INSERT INTO estudiantes VALUES (2, '8-123-456');
DROP TABLE estudiantes PURGE;
EXIT;
