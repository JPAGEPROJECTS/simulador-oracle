-- Lote 01: verificación de las preguntas iniciales (F/P/X 001-011)
-- Ejecutar con NLS_LANG=AMERICAN_AMERICA.AL32UTF8 después de setup.sql
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
COLUMN name FORMAT A12
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

-- ---------- F010 ----------
CREATE TABLE students (student_id NUMBER, first_name VARCHAR2(20), gpa NUMBER(3,1));
INSERT INTO students VALUES (1, 'Ana', 3.5);
INSERT INTO students VALUES (2, 'Luis', 2.8);
INSERT INTO students VALUES (3, 'Marta', 3.9);
PROMPT ==== F010 esperado: Ana, Marta
SELECT first_name FROM students WHERE gpa > 3;
DROP TABLE students PURGE;

-- ---------- P001 ----------
PROMPT ==== P001 esperado: apellidos con 'a' en 2a posicion (Hartstein, Rajs, Davies, Matos, Vargas, Fay)
SELECT last_name FROM employees WHERE last_name LIKE '_a%' ORDER BY 1;

-- ---------- P002 ----------
PROMPT ==== P002 esperado: 20, NULL, 7
SELECT NVL2(NULL, 10, 20) a, NULLIF(5, 5) b, COALESCE(NULL, NULL, 7) c FROM dual;

-- ---------- P003 ----------
PROMPT ==== P003 esperado: TABA34
SELECT SUBSTR('DATABASE', 3, 4) || LENGTH('SQL') || INSTR('ORACLE', 'C') r FROM dual;

-- ---------- P004 ----------
CREATE TABLE scores (id NUMBER, pts NUMBER);
INSERT INTO scores VALUES (1, 10);
INSERT INTO scores VALUES (2, 20);
INSERT INTO scores VALUES (3, NULL);
INSERT INTO scores VALUES (4, 30);
PROMPT ==== P004 esperado: 4, 3, 20
SELECT COUNT(*), COUNT(pts), AVG(pts) FROM scores;
DROP TABLE scores PURGE;

-- ---------- P005 ----------
PROMPT ==== P005 esperado: ORA-25154
SELECT department_id, department_name, last_name
FROM   employees JOIN departments
USING  (department_id)
WHERE  departments.department_id = 90;

-- ---------- P006 ----------
PROMPT ==== P006 esperado: ORA-01427
SELECT last_name FROM employees
WHERE  salary = (SELECT salary FROM employees WHERE department_id = 60);

-- ---------- P007 ----------
PROMPT ==== P007 esperado: [ $1,234.57]
SELECT '[' || TO_CHAR(1234.567, '$9,999.99') || ']' r FROM dual;

-- ---------- P008 ----------
PROMPT ==== P008 esperado: 21 filas actualizadas (todas), luego rollback
UPDATE employees SET salary = salary * 1.1;
ROLLBACK;

-- ---------- P009 ----------
PROMPT ==== P009: UNIQUE admite varios NULL (esperado: 2 inserts OK)
CREATE TABLE t_uk (c1 NUMBER CONSTRAINT t_uk_u UNIQUE);
INSERT INTO t_uk VALUES (NULL);
INSERT INTO t_uk VALUES (NULL);
DROP TABLE t_uk PURGE;
PROMPT ==== P009: dos PRIMARY KEY (esperado: ORA-02260)
CREATE TABLE t_pk2 (c1 NUMBER PRIMARY KEY, c2 NUMBER PRIMARY KEY);
PROMPT ==== P009: NOT NULL a nivel de tabla (esperado: error de sintaxis)
CREATE TABLE t_nn (c1 NUMBER, CONSTRAINT t_nn_c1 NOT NULL (c1));
PROMPT ==== P009: FK admite NULL (esperado: 1 fila insertada)
CREATE TABLE t_fk (c1 NUMBER REFERENCES departments(department_id));
INSERT INTO t_fk VALUES (NULL);
DROP TABLE t_fk PURGE;

-- ---------- P010 ----------
PROMPT ==== P010 esperado: NULLs primero
SELECT last_name, commission_pct FROM employees ORDER BY commission_pct DESC FETCH FIRST 3 ROWS ONLY;

-- ---------- P011 ----------
PROMPT ==== P011 esperado: 29-FEB-24
SELECT ADD_MONTHS(DATE '2024-01-31', 1) r FROM dual;

-- ---------- X001 ----------
CREATE TABLE emp (emp_id NUMBER, name VARCHAR2(10), dept_id NUMBER);
INSERT INTO emp VALUES (1, 'King', 10);
INSERT INTO emp VALUES (2, 'Lee', 20);
INSERT INTO emp VALUES (3, 'Diaz', NULL);
INSERT INTO emp VALUES (4, 'Mora', 30);
PROMPT ==== X001 esperado: no rows selected
SELECT name FROM emp WHERE dept_id NOT IN (10, NULL);
DROP TABLE emp PURGE;

-- ---------- X002 ----------
PROMPT ==== X002 esperado: ORA-00904 ANNUAL
SELECT last_name, salary * 12 AS annual FROM employees WHERE annual > 100000 ORDER BY annual;

-- ---------- X003 ----------
PROMPT ==== X003 a (esperado ORA-00979)
SELECT department_id, job_id, SUM(salary) FROM employees GROUP BY department_id;
PROMPT ==== X003 b (esperado ORA-00937)
SELECT department_id, MAX(AVG(salary)) FROM employees GROUP BY department_id;
PROMPT ==== X003 c (esperado OK, 1 fila)
SELECT MAX(AVG(salary)) FROM employees GROUP BY department_id;
PROMPT ==== X003 d (esperado OK)
SELECT SUM(salary) FROM employees GROUP BY department_id, job_id;
PROMPT ==== X003 e (esperado ORA-00934)
SELECT department_id, SUM(salary) FROM employees WHERE SUM(salary) > 10000 GROUP BY department_id;

-- ---------- X004 ----------
PROMPT ==== X004 esperado: ORA-00904 LAST_NAME
SELECT employee_id, last_name AS name FROM employees
UNION
SELECT department_id, department_name FROM departments
ORDER BY last_name;

-- ---------- X005 ----------
CREATE SEQUENCE seq1 START WITH 100;
PROMPT ==== X005 esperado: ORA-08002
SELECT seq1.CURRVAL FROM dual;
DROP SEQUENCE seq1;

-- ---------- X006 ----------
CREATE TABLE t1 (c1 NUMBER);
INSERT INTO t1 VALUES (1);
INSERT INTO t1 VALUES (2);
CREATE TABLE t2 (c1 NUMBER);
INSERT INTO t1 VALUES (3);
ROLLBACK;
PROMPT ==== X006 esperado: 2
SELECT COUNT(*) FROM t1;
DROP TABLE t1 PURGE;
DROP TABLE t2 PURGE;

-- ---------- X007 ----------
PROMPT ==== X007 esperado: ORA-01722
SELECT 'Total: ' || NULL || 5 + 3 FROM dual;

-- ---------- X008 ----------
PROMPT ==== X008: NATURAL JOIN debe igualar NATURAL JOIN ... ON dept AND mgr
SELECT COUNT(*) natural_cnt FROM employees NATURAL JOIN departments;
SELECT COUNT(*) on_ambas FROM employees e JOIN departments d
  ON e.department_id = d.department_id AND e.manager_id = d.manager_id;
SELECT COUNT(*) solo_dept FROM employees e JOIN departments d ON e.department_id = d.department_id;

-- ---------- X010 ----------
CREATE VIEW v_dept AS
  SELECT department_id, COUNT(*) AS total FROM employees GROUP BY department_id;
PROMPT ==== X010 esperado: ORA-01732 en DELETE y UPDATE
DELETE FROM v_dept WHERE department_id = 10;
UPDATE v_dept SET total = 0;
DROP VIEW v_dept;

EXIT;
