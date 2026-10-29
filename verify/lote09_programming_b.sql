-- Lote 09 (Programming with SQL): P037-P062
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

PROMPT ==== P037 IN/ANY/ALL OK; = ORA-01427; LIKE con subconsulta multifila error
SELECT COUNT(*) FROM employees WHERE salary IN (SELECT salary FROM employees WHERE department_id = 60);
SELECT COUNT(*) FROM employees WHERE salary > ANY (SELECT salary FROM employees WHERE department_id = 60);
SELECT COUNT(*) FROM employees WHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 60);
SELECT COUNT(*) FROM employees WHERE salary = (SELECT salary FROM employees WHERE department_id = 60);
SELECT COUNT(*) FROM employees WHERE last_name LIKE (SELECT last_name FROM employees WHERE department_id = 60);

PROMPT ==== P038 esperado 7 departamentos (todos menos Contracting)
SELECT COUNT(*) FROM departments d WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);

PROMPT ==== P039 esperado LOCATION_ID NULL
INSERT INTO departments (department_id, department_name) VALUES (280, 'Training');
SELECT NVL(TO_CHAR(location_id), '(null)') loc FROM departments WHERE department_id = 280;
ROLLBACK;

PROMPT ==== P040 DELETE sin WHERE conserva la tabla
CREATE TABLE copy_emp AS SELECT * FROM employees;
DELETE FROM copy_emp;
SELECT COUNT(*) FROM copy_emp;
DROP TABLE copy_emp PURGE;

PROMPT ==== P042 esperado 12008
UPDATE employees SET salary = (SELECT salary FROM employees WHERE employee_id = 205) WHERE employee_id = 206;
SELECT salary FROM employees WHERE employee_id = 206;
ROLLBACK;

PROMPT ==== P043 a, b OK; c, d, e error
CREATE TABLE emp_2024 (c NUMBER);
CREATE TABLE "Order Details" (c NUMBER);
CREATE TABLE 2024_emp (c NUMBER);
CREATE TABLE order (c NUMBER);
CREATE TABLE emp-data (c NUMBER);
DROP TABLE emp_2024 PURGE;
DROP TABLE "Order Details" PURGE;

PROMPT ==== P044 CREATED = momento del INSERT
CREATE TABLE notes (id NUMBER, created DATE DEFAULT SYSDATE);
INSERT INTO notes (id) VALUES (1);
SELECT CASE WHEN created BETWEEN SYSDATE - 1/1440 AND SYSDATE THEN 'ahora' ELSE 'otro' END r FROM notes;
DROP TABLE notes PURGE;

PROMPT ==== P045 columna al final con NULL
CREATE TABLE copy_emp AS SELECT employee_id, last_name FROM employees;
ALTER TABLE copy_emp ADD (bonus NUMBER(6));
SELECT column_name, column_id FROM user_tab_columns WHERE table_name = 'COPY_EMP' ORDER BY column_id;
SELECT COUNT(*) total, COUNT(bonus) con_bonus FROM copy_emp;
DROP TABLE copy_emp PURGE;

PROMPT ==== P047 esperado ORA-02291
INSERT INTO employees (employee_id, last_name, email, hire_date, department_id) VALUES (300, 'Ruiz', 'RRUIZ', SYSDATE, 999);

PROMPT ==== P048 PK compuesta a nivel de tabla OK; PRIMARY KEY en dos columnas ORA-02260
CREATE TABLE enrollments (student_id NUMBER, course_id NUMBER, CONSTRAINT enr_pk PRIMARY KEY (student_id, course_id));
DROP TABLE enrollments PURGE;
CREATE TABLE enrollments (student_id NUMBER PRIMARY KEY, course_id NUMBER PRIMARY KEY);

PROMPT ==== P050 WITH READ ONLY (esperado ORA-42399)
CREATE VIEW v_ro AS SELECT employee_id, salary FROM employees WITH READ ONLY;
UPDATE v_ro SET salary = salary;
DROP VIEW v_ro;

PROMPT ==== P051 esperado King, Kochhar/De Haan (top 3)
SELECT ROWNUM AS rank, last_name, salary FROM (SELECT last_name, salary FROM employees WHERE salary IS NOT NULL ORDER BY salary DESC) WHERE ROWNUM <= 3;

PROMPT ==== P052 esperado 10, 15, 15
CREATE SEQUENCE emp_seq START WITH 10 INCREMENT BY 5;
SELECT emp_seq.NEXTVAL FROM dual;
SELECT emp_seq.NEXTVAL FROM dual;
SELECT emp_seq.CURRVAL FROM dual;
DROP SEQUENCE emp_seq;

PROMPT ==== P057 esperado Steven, Stephen
CREATE TABLE names (first_name VARCHAR2(20));
INSERT INTO names VALUES ('Steven');
INSERT INTO names VALUES ('Stephen');
INSERT INTO names VALUES ('Stevenson');
INSERT INTO names VALUES ('steven');
SELECT first_name FROM names WHERE REGEXP_LIKE(first_name, '^Ste(v|ph)en$');
DROP TABLE names PURGE;

PROMPT ==== P058 esperado ###-###-####
SELECT REGEXP_REPLACE('507-123-4567', '[0-9]', '#') FROM dual;

PROMPT ==== P059 esperado 3, 123
SELECT REGEXP_COUNT('banana', 'a'), REGEXP_SUBSTR('abc123def45', '[0-9]+') FROM dual;

PROMPT ==== P060/P061
CREATE TABLE copy_dept (id NUMBER, name VARCHAR2(10));
INSERT INTO copy_dept VALUES (300, 'QA');
ROLLBACK;
SELECT COUNT(*) p060 FROM copy_dept;
INSERT INTO copy_dept VALUES (1, 'A');
SAVEPOINT s1;
INSERT INTO copy_dept VALUES (2, 'B');
ROLLBACK TO SAVEPOINT s1;
COMMIT;
SELECT id FROM copy_dept;
DROP TABLE copy_dept PURGE;

PROMPT ==== P062 TRUNC(fecha) -> medianoche
SELECT TO_CHAR(TRUNC(TO_DATE('2026-10-29 15:45', 'YYYY-MM-DD HH24:MI')), 'DD-MM-YYYY HH24:MI') r FROM dual;
EXIT;
