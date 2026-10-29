-- Lote 08 (Programming with SQL): P012-P036
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

PROMPT ==== P012 esperado 3 (Fay, Gietz, Hunold)
CREATE TABLE emp_sample (last_name VARCHAR2(20), dept_id NUMBER, salary NUMBER);
INSERT INTO emp_sample VALUES ('Abel', 80, 11000);
INSERT INTO emp_sample VALUES ('Davies', 50, 3100);
INSERT INTO emp_sample VALUES ('Fay', 20, 6000);
INSERT INTO emp_sample VALUES ('Gietz', 110, 8300);
INSERT INTO emp_sample VALUES ('Hunold', 60, 9000);
SELECT last_name FROM emp_sample WHERE salary BETWEEN 6000 AND 9000;
DROP TABLE emp_sample PURGE;

PROMPT ==== P013 encabezado Full Name
SELECT first_name || ' ' || last_name AS "Full Name" FROM employees WHERE employee_id = 100;

PROMPT ==== P014 esperado no rows
SELECT last_name FROM employees WHERE last_name = 'king';

PROMPT ==== P015 depto ASC, apellido DESC (dept 90: Kochhar, King, De Haan)
SELECT department_id, last_name FROM employees WHERE department_id IN (60, 90) ORDER BY department_id, last_name DESC;

PROMPT ==== P016 esperado 45.93, 45.92, 100
SELECT ROUND(45.926, 2), TRUNC(45.926, 2), MOD(1600, 300) FROM dual;

PROMPT ==== P017 esperado 50, 40
SELECT ROUND(45.923, -1), TRUNC(45.923, -1) FROM dual;

PROMPT ==== P018 esperado *****24000
SELECT LPAD(salary, 10, '*') FROM employees WHERE last_name = 'King';

PROMPT ==== P019 INSTR('ORACLE','C') = 4
SELECT INSTR('ORACLE', 'C') FROM dual;

PROMPT ==== P020 esperado HelloWorld, 10
SELECT CONCAT('Hello', 'World'), LENGTH(CONCAT('Hello', 'World')) FROM dual;

PROMPT ==== P021 esperado 2
SELECT MONTHS_BETWEEN(DATE '2024-03-31', DATE '2024-01-31') FROM dual;

PROMPT ==== P022 resta de fechas en dias (esperado 31)
SELECT DATE '2024-02-01' - DATE '2024-01-01' FROM dual;

PROMPT ==== P023 a [June 17, 2003]; b; c; d
SELECT '[' || TO_CHAR(DATE '2003-06-17', 'fmMonth DD, YYYY') || ']' a,
       '[' || TO_CHAR(DATE '2003-06-17', 'Month DD, YYYY') || ']' b,
       '[' || TO_CHAR(DATE '2003-06-17', 'MON DD, YYYY') || ']' c,
       '[' || TO_CHAR(DATE '2003-06-17', 'Mon dd, yyyy') || ']' d
FROM dual;

PROMPT ==== P024 esperado 1235.5
SELECT TO_NUMBER('1,234.50', '9,999.99') + 1 FROM dual;

PROMPT ==== P025 esperado 0
SELECT NVL2(commission_pct, salary * commission_pct, 0) FROM employees WHERE employee_id = 206;

PROMPT ==== P026 esperado A, X
SELECT NULLIF('A', 'a'), COALESCE(NULL, 'X', 'Y') FROM dual;

PROMPT ==== P027 esperado 7000 (Grant, SA_REP)
SELECT DECODE(job_id, 'IT_PROG', 1.10 * salary, 'ST_CLERK', 1.15 * salary, salary) FROM employees WHERE employee_id = 178;

PROMPT ==== P028 esperado Medio
SELECT CASE WHEN 12000 > 5000 THEN 'Medio' WHEN 12000 > 10000 THEN 'Alto' ELSE 'Bajo' END FROM dual;

PROMPT ==== P029 NATURAL JOIN sin columnas comunes = producto cartesiano
CREATE TABLE nj1 (a NUMBER);
CREATE TABLE nj2 (b NUMBER);
INSERT INTO nj1 VALUES (1);
INSERT INTO nj1 VALUES (2);
INSERT INTO nj2 VALUES (1);
INSERT INTO nj2 VALUES (2);
SELECT COUNT(*) FROM nj1 NATURAL JOIN nj2;
DROP TABLE nj1 PURGE;
DROP TABLE nj2 PURGE;

PROMPT ==== P030 esperado 4
CREATE TABLE emp (emp_id NUMBER, name VARCHAR2(10), dept_id NUMBER);
CREATE TABLE dept (dept_id NUMBER, dname VARCHAR2(10));
INSERT INTO emp VALUES (1, 'Ana', 10);
INSERT INTO emp VALUES (2, 'Beto', 20);
INSERT INTO emp VALUES (3, 'Carla', NULL);
INSERT INTO emp VALUES (4, 'Dario', 10);
INSERT INTO dept VALUES (10, 'Ventas');
INSERT INTO dept VALUES (20, 'TI');
INSERT INTO dept VALUES (30, 'RRHH');
SELECT e.name, d.dname FROM emp e RIGHT OUTER JOIN dept d ON e.dept_id = d.dept_id;
DROP TABLE emp PURGE;
DROP TABLE dept PURGE;

PROMPT ==== P031 esperado 12
CREATE TABLE colors (c NUMBER);
CREATE TABLE sizes (s NUMBER);
INSERT INTO colors SELECT LEVEL FROM dual CONNECT BY LEVEL <= 3;
INSERT INTO sizes SELECT LEVEL FROM dual CONNECT BY LEVEL <= 4;
SELECT COUNT(*) FROM colors CROSS JOIN sizes;
DROP TABLE colors PURGE;
DROP TABLE sizes PURGE;

PROMPT ==== P033 MIN(hire_date) = 13-JAN-01 (la mas antigua)
SELECT MIN(hire_date), MAX(hire_date) FROM employees;

PROMPT ==== P034 esperado 20 y 90
CREATE TABLE emp_sal (dept_id NUMBER, salary NUMBER);
INSERT INTO emp_sal VALUES (10, 4400);
INSERT INTO emp_sal VALUES (20, 13000);
INSERT INTO emp_sal VALUES (20, 6000);
INSERT INTO emp_sal VALUES (60, 9000);
INSERT INTO emp_sal VALUES (60, 6000);
INSERT INTO emp_sal VALUES (60, 4200);
INSERT INTO emp_sal VALUES (90, 24000);
INSERT INTO emp_sal VALUES (90, 17000);
SELECT dept_id, AVG(salary) FROM emp_sal GROUP BY dept_id HAVING AVG(salary) > 8000 ORDER BY 1;
DROP TABLE emp_sal PURGE;

PROMPT ==== P035 esperado ORA-00979
SELECT department_id, last_name, COUNT(*) FROM employees GROUP BY department_id;

PROMPT ==== P036 subconsulta (Abel = 11000): esperado King, Kochhar, De Haan, Hartstein, Higgins
SELECT last_name FROM employees WHERE salary > (SELECT salary FROM employees WHERE last_name = 'Abel');
EXIT;
