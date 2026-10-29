-- Lote 06 (1Z0-071): X139-X167 (X160 en x160_describe.sql, X163 en x163_*.sql; X150 en sondeo_lote06.sql)
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
COLUMN comments FORMAT A30
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

PROMPT ==== X139 a, b OK (1 fila); c ORA-01767; d error; e ORA-01427
UPDATE employees SET (job_id, salary) = (SELECT job_id, salary FROM employees WHERE employee_id = 205) WHERE employee_id = 206;
SELECT job_id, salary FROM employees WHERE employee_id = 206;
ROLLBACK;
UPDATE employees SET job_id = (SELECT job_id FROM employees WHERE employee_id = 205), salary = (SELECT salary FROM employees WHERE employee_id = 205) WHERE employee_id = 206;
ROLLBACK;
UPDATE employees SET (job_id, salary) = ('AC_MGR', 12008) WHERE employee_id = 206;
UPDATE employees SET job_id = (SELECT job_id FROM employees WHERE employee_id = 205) AND salary = (SELECT salary FROM employees WHERE employee_id = 205) WHERE employee_id = 206;
UPDATE employees SET (job_id, salary) = (SELECT job_id, salary FROM employees) WHERE employee_id = 206;

PROMPT ==== X140 a, b OK (0 filas); c, d, e error
DELETE employees WHERE employee_id = 999;
DELETE FROM (SELECT * FROM employees WHERE department_id = 10) WHERE employee_id = 999;
DELETE * FROM employees WHERE employee_id = 999;
DELETE last_name FROM employees WHERE employee_id = 999;
DELETE FROM employees, departments WHERE employee_id = 999;

PROMPT ==== X141 esperado ORA-01722
INSERT INTO departments (department_name, department_id) VALUES (300, 'QA');

PROMPT ==== X142 a: INSERT ALL incondicional (esperado 6 filas con 3 de origen); c: sin subconsulta (error); e: vista (error)
CREATE TABLE m1 (c NUMBER);
CREATE TABLE m2 (c NUMBER);
INSERT ALL INTO m1 VALUES (c) INTO m2 VALUES (c) SELECT LEVEL c FROM dual CONNECT BY LEVEL <= 3;
INSERT ALL INTO m1 VALUES (1) INTO m2 VALUES (1);
CREATE VIEW v_m1 AS SELECT c FROM m1;
INSERT ALL INTO v_m1 VALUES (c) SELECT 1 c FROM dual;
PROMPT -- d: INSERT FIRST sin ELSE (OK, filas sin WHEN no se insertan)
INSERT FIRST WHEN c > 2 THEN INTO m1 VALUES (c) SELECT LEVEL c FROM dual CONNECT BY LEVEL <= 3;
ROLLBACK;
DROP VIEW v_m1;
DROP TABLE m1 PURGE;
DROP TABLE m2 PURGE;

PROMPT ==== X143 esperado (1,150), (2,200)
CREATE TABLE target (id NUMBER, val NUMBER);
CREATE TABLE source (id NUMBER, val NUMBER);
INSERT INTO target VALUES (1, 100);
INSERT INTO target VALUES (2, 200);
INSERT INTO source VALUES (1, 150);
INSERT INTO source VALUES (2, 50);
INSERT INTO source VALUES (3, 300);
MERGE INTO target t USING source s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET t.val = s.val WHERE s.val > t.val
WHEN NOT MATCHED THEN INSERT (id, val) VALUES (s.id, s.val) WHERE s.val > 500;
SELECT * FROM target ORDER BY id;
DROP TABLE target PURGE;
DROP TABLE source PURGE;

PROMPT ==== X144 esperado NULL
CREATE TABLE tasks (task_id NUMBER, notes VARCHAR2(100));
INSERT INTO tasks VALUES (7, 'algo');
UPDATE tasks SET notes = DEFAULT WHERE task_id = 7;
SELECT NVL(notes, '(null)') notes FROM tasks;
DROP TABLE tasks PURGE;

PROMPT ==== X145 esperado consulta1 = 5, consulta2 = 2
CREATE TABLE emp (emp_id NUMBER, name VARCHAR2(10), dept_id NUMBER);
CREATE TABLE dept (dept_id NUMBER, dname VARCHAR2(10));
INSERT INTO emp VALUES (1, 'Ana', 10);
INSERT INTO emp VALUES (2, 'Beto', 20);
INSERT INTO emp VALUES (3, 'Carla', NULL);
INSERT INTO emp VALUES (4, 'Dario', 10);
INSERT INTO emp VALUES (5, 'Eva', 40);
INSERT INTO dept VALUES (10, 'Ventas');
INSERT INTO dept VALUES (20, 'TI');
INSERT INTO dept VALUES (30, 'RRHH');
SELECT COUNT(*) c1 FROM emp e LEFT OUTER JOIN dept d ON e.dept_id = d.dept_id AND d.dname = 'Ventas';
SELECT COUNT(*) c2 FROM emp e LEFT OUTER JOIN dept d ON e.dept_id = d.dept_id WHERE d.dname = 'Ventas';
DROP TABLE emp PURGE;
DROP TABLE dept PURGE;

PROMPT ==== X146 esperado error
SELECT last_name, department_name FROM employees NATURAL JOIN departments ON (employees.department_id = departments.department_id);

PROMPT ==== X147 esperado 24
SELECT COUNT(*) FROM employees e, departments d WHERE e.department_id = 90;

PROMPT ==== X149 esperado ORA-00001 y 1 fila
CREATE TABLE t (c NUMBER PRIMARY KEY);
INSERT INTO t (c) VALUES (1);
INSERT INTO t (c) SELECT LEVEL FROM dual CONNECT BY LEVEL <= 3;
COMMIT;
SELECT COUNT(*) FROM t;
DROP TABLE t PURGE;

PROMPT ==== X151 esperado 2
CREATE TABLE t (c NUMBER);
INSERT INTO t VALUES (1);
SAVEPOINT a;
INSERT INTO t VALUES (2);
SAVEPOINT a;
INSERT INTO t VALUES (3);
ROLLBACK TO SAVEPOINT a;
COMMIT;
SELECT COUNT(*) FROM t;
PROMPT ==== X152 c: COMMIT borra savepoints (esperado ORA-01086)
SAVEPOINT z;
INSERT INTO t VALUES (9);
COMMIT;
ROLLBACK TO SAVEPOINT z;
DROP TABLE t PURGE;

PROMPT ==== X153 esperado no rows
SELECT last_name FROM employees ORDER BY last_name OFFSET 25 ROWS FETCH NEXT 5 ROWS ONLY;

PROMPT ==== X154 esperado 10, 20, 50
SELECT DISTINCT department_id FROM employees ORDER BY department_id FETCH FIRST 3 ROWS ONLY;

PROMPT ==== X155 a y b: King, Kochhar/De Haan (24000, 17000, 17000)
SELECT last_name, salary FROM employees WHERE salary IS NOT NULL ORDER BY salary DESC FETCH FIRST 3 ROWS ONLY;
SELECT last_name, salary FROM (SELECT last_name, salary FROM employees WHERE salary IS NOT NULL ORDER BY salary DESC) WHERE ROWNUM <= 3;
PROMPT -- c: ROWNUM antes de ORDER BY (filas arbitrarias)
SELECT last_name, salary FROM employees WHERE ROWNUM <= 3 ORDER BY salary DESC;

PROMPT ==== X157 a: DICTIONARY; c: minusculas no encuentra; d: USER_SEQUENCES sin CURRVAL
SELECT table_name FROM dictionary WHERE table_name = 'USER_TABLES';
SELECT COUNT(*) FROM user_tables WHERE table_name = 'employees';
CREATE SEQUENCE s_x;
SELECT currval FROM user_sequences;
DROP SEQUENCE s_x;

PROMPT ==== X158 esperado 21
CREATE SEQUENCE s_inv START WITH 1 INCREMENT BY 1 CACHE 20;
SELECT s_inv.NEXTVAL FROM dual;
SELECT last_number FROM user_sequences WHERE sequence_name = 'S_INV';
DROP SEQUENCE s_inv;

PROMPT ==== X159 USER_COL_COMMENTS
COMMENT ON COLUMN employees.salary IS 'Monthly salary in USD';
SELECT column_name, comments FROM user_col_comments WHERE table_name = 'EMPLOYEES' AND comments IS NOT NULL;
SELECT COUNT(*) FROM user_comments;
COMMENT ON COLUMN employees.salary IS '';

PROMPT ==== X161 esperado [Lopez earns  monthly]
SELECT '[' || last_name || ' earns ' || salary || ' monthly' || ']' AS info FROM employees WHERE employee_id = 210;

PROMPT ==== X164 a: privilegios conservados tras CREATE OR REPLACE (esperado 1 fila antes y despues)
CREATE VIEW v_emp AS SELECT employee_id FROM employees;
GRANT SELECT ON v_emp TO sim071b;
SELECT grantee, privilege FROM user_tab_privs_made WHERE table_name = 'V_EMP';
CREATE OR REPLACE VIEW v_emp AS SELECT employee_id, last_name FROM employees;
SELECT grantee, privilege FROM user_tab_privs_made WHERE table_name = 'V_EMP';
DROP VIEW v_emp;

PROMPT ==== X165 esperado ORA-00998
CREATE VIEW v_annual AS SELECT last_name, salary * 12 FROM employees;

PROMPT ==== X166 esperado ORA-02437
CREATE TABLE clients (code NUMBER);
INSERT INTO clients VALUES (1);
INSERT INTO clients VALUES (1);
ALTER TABLE clients ADD CONSTRAINT clients_pk PRIMARY KEY (code);
DROP TABLE clients PURGE;

PROMPT ==== X167 a: CHECK multicolumna OK; b: SYSDATE ORA-02436
CREATE TABLE t_dates (start_date DATE, end_date DATE, CHECK (end_date > start_date));
DROP TABLE t_dates PURGE;
CREATE TABLE t_ck (d DATE CHECK (d <= SYSDATE));
EXIT;
