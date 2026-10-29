-- Lote 05 (1Z0-071): X104-X136 (X137/X138 en x137_x138.sql)
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

PROMPT ==== X104 esperado a=150 b=150 c=200 d=200 e=200
CREATE TABLE bonuses (emp_id NUMBER, bonus NUMBER);
INSERT INTO bonuses VALUES (1, 100);
INSERT INTO bonuses VALUES (2, NULL);
INSERT INTO bonuses VALUES (3, 200);
INSERT INTO bonuses VALUES (4, 300);
SELECT SUM(bonus)/COUNT(*) a, AVG(NVL(bonus, 0)) b, AVG(bonus) c, SUM(bonus)/COUNT(bonus) d, AVG(DISTINCT bonus) e FROM bonuses;
DROP TABLE bonuses PURGE;

PROMPT ==== X105 a OK; c, d, e errores
SELECT MIN(last_name), MAX(hire_date), MIN(salary) FROM employees;
SELECT COUNT(DISTINCT *) FROM employees;
SELECT AVG(hire_date) FROM employees;
SELECT MAX(AVG(SUM(salary))) FROM employees GROUP BY department_id;

PROMPT ==== X106 esperado 3 filas
CREATE TABLE staff (staff_id NUMBER, dept NUMBER);
INSERT INTO staff VALUES (1, 10);
INSERT INTO staff VALUES (2, 10);
INSERT INTO staff VALUES (3, 20);
INSERT INTO staff VALUES (4, NULL);
INSERT INTO staff VALUES (5, NULL);
SELECT dept, COUNT(*) FROM staff GROUP BY dept;
DROP TABLE staff PURGE;

PROMPT ==== X107 esperado ORA-00979
SELECT department_id, COUNT(*) FROM employees GROUP BY department_id HAVING salary > 5000;

PROMPT ==== X108 esperado ORA-00978
SELECT MAX(AVG(salary)) FROM employees;

PROMPT ==== X109 esperado 1 fila: 0, NULL
SELECT COUNT(*), SUM(salary) FROM employees WHERE 1 = 0;
PROMPT -- con GROUP BY: no rows
SELECT COUNT(*) FROM employees WHERE 1 = 0 GROUP BY department_id;

PROMPT ==== X110 a OK, b OK, c ORA-00904, d ORA-00979, e ORA-00979
SELECT TO_CHAR(hire_date, 'YYYY'), COUNT(*) FROM employees GROUP BY TO_CHAR(hire_date, 'YYYY') FETCH FIRST 1 ROW ONLY;
SELECT TO_CHAR(hire_date, 'YYYY'), COUNT(*) FROM employees GROUP BY hire_date FETCH FIRST 1 ROW ONLY;
SELECT TO_CHAR(hire_date, 'YYYY') yr, COUNT(*) FROM employees GROUP BY yr;
SELECT hire_date, COUNT(*) FROM employees GROUP BY TO_CHAR(hire_date, 'YYYY');
SELECT COUNT(*) FROM employees GROUP BY TO_CHAR(hire_date, 'YYYY') HAVING hire_date > SYSDATE - 365;

PROMPT ==== X111 esperado ORA-00909
SELECT CONCAT(first_name, ' ', last_name) FROM employees;

PROMPT ==== X112 esperado CL, OR, ACLE
SELECT SUBSTR('ORACLE', -3, 2) s1, SUBSTR('ORACLE', 0, 2) s2, SUBSTR('ORACLE', 3) s3 FROM dual;

PROMPT ==== X113 esperado Hello World-Sql 2go
SELECT INITCAP('hELLO wORLD-sql 2go') FROM dual;

PROMPT ==== X114 esperado NULL, -1, A
SELECT LENGTH('') l, NVL(LENGTH(''), -1) n, '' || 'A' c FROM dual;

PROMPT ==== X115 esperado 01-AUG-24, 01-JAN-25, 01-JAN-24
SELECT ROUND(DATE '2024-07-16', 'MONTH') r1, ROUND(DATE '2024-07-01', 'YEAR') r2, TRUNC(DATE '2024-07-16', 'YEAR') r3 FROM dual;
PROMPT -- control: dia 15 y 30-jun
SELECT ROUND(DATE '2024-07-15', 'MONTH') r1b, ROUND(DATE '2024-06-30', 'YEAR') r2b FROM dual;

PROMPT ==== X116 esperado 22-MAR-24, 28-FEB-23 (y 15-mar-24 es FRIDAY)
SELECT TO_CHAR(DATE '2024-03-15', 'DAY') d, NEXT_DAY(DATE '2024-03-15', 'FRIDAY') nd, LAST_DAY(DATE '2023-02-10') ld FROM dual;

PROMPT ==== X117 anidacion profunda (esperado OK)
SELECT UPPER(LOWER(UPPER(LOWER(UPPER(SUBSTR(LPAD(TRIM(' x '), 3, '*'), 1, 3)))))) r FROM dual;

PROMPT ==== X118 esperado 9, 7 (y TUESDAY)
SELECT LENGTH(TO_CHAR(DATE '2024-03-05', 'Day')) l1, LENGTH(TO_CHAR(DATE '2024-03-05', 'fmDay')) l2, TO_CHAR(DATE '2024-03-05', 'fmDay') d FROM dual;

PROMPT ==== X119 esperado [######] [ 0.50]
SELECT '[' || TO_CHAR(12345, '9,999') || ']' c1, '[' || TO_CHAR(0.5, '0.99') || ']' c2, '[' || TO_CHAR(0.5, '9.99') || ']' c3 FROM dual;

PROMPT ==== X120 a OK, b OK, c ORA-01722, d ORA-01722, e ORA-01861
SELECT last_name FROM employees WHERE employee_id = '100';
SELECT last_name FROM employees WHERE hire_date = '17-JUN-03';
SELECT last_name FROM employees WHERE last_name = 100;
SELECT last_name FROM employees WHERE salary = '24,000';
SELECT last_name FROM employees WHERE hire_date = '2003-06-17';

PROMPT ==== X121 esperado ORA-00932
SELECT last_name, CASE WHEN salary > 10000 THEN 'High' ELSE 0 END AS lvl FROM employees;

PROMPT ==== X122 a, b OK ('none' para King); c ORA-00932; d ORA-00932; e ORA-01722
SELECT NVL(TO_CHAR(commission_pct), 'none') a, COALESCE(TO_CHAR(commission_pct), 'none') b FROM employees WHERE employee_id = 100;
SELECT COALESCE(commission_pct, 'none') FROM employees;
SELECT CASE WHEN commission_pct IS NULL THEN 'none' ELSE commission_pct END FROM employees;
SELECT NVL(commission_pct, 'none') FROM employees;

PROMPT ==== X123 esperado Ana, Carla
CREATE TABLE staff (name VARCHAR2(10), dept NUMBER, salary NUMBER);
INSERT INTO staff VALUES ('Ana', 10, 3000);
INSERT INTO staff VALUES ('Beto', 10, 5000);
INSERT INTO staff VALUES ('Carla', 20, 4000);
INSERT INTO staff VALUES ('Dario', NULL, 2000);
INSERT INTO staff VALUES ('Eva', NULL, 6000);
SELECT name FROM staff WHERE (dept, salary) IN (SELECT dept, MIN(salary) FROM staff GROUP BY dept);

PROMPT ==== X125 esperado Ana 4000, Beto 4000, Dario NULL
DELETE FROM staff WHERE name IN ('Carla', 'Eva');
UPDATE staff s SET salary = (SELECT AVG(i.salary) FROM staff i WHERE i.dept = s.dept);
SELECT name, salary FROM staff ORDER BY name;
DROP TABLE staff PURGE;

PROMPT ==== X124 esperado ORA-00904 D.DEPARTMENT_ID
SELECT d.department_id, d.avg_sal
FROM (SELECT department_id AS dept, AVG(salary) AS avg_sal FROM employees GROUP BY department_id) d
WHERE d.avg_sal > 10000;

PROMPT ==== X126 esperado no rows
SELECT last_name FROM employees WHERE salary = (SELECT salary FROM employees WHERE last_name = 'Nobody');

PROMPT ==== X127 b: subconsulta en HAVING (OK)
SELECT department_id FROM employees GROUP BY department_id HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);

PROMPT ==== X128 consulta (OK); e: referencia adelantada (esperado error)
WITH dept_costs AS (SELECT department_id, SUM(salary) AS total FROM employees GROUP BY department_id),
     avg_cost AS (SELECT AVG(total) AS avg_total FROM dept_costs)
SELECT d.department_id, d.total FROM dept_costs d, avg_cost a WHERE d.total > a.avg_total;
WITH avg_cost AS (SELECT AVG(total) AS avg_total FROM dept_costs),
     dept_costs AS (SELECT department_id, SUM(salary) AS total FROM employees GROUP BY department_id)
SELECT * FROM avg_cost;

PROMPT ==== X129 esperado ORA-01789
SELECT employee_id, last_name FROM employees UNION SELECT department_id FROM departments;

PROMPT ==== X130 a OK, b OK, c ORA-01790, d ORA-00904, e ORA-00933
SELECT COUNT(*) FROM (SELECT employee_id, last_name FROM employees UNION SELECT department_id, NULL FROM departments);
SELECT COUNT(*) FROM (SELECT last_name, hire_date FROM employees UNION SELECT department_name, TO_DATE(NULL) FROM departments);
SELECT last_name, hire_date FROM employees UNION SELECT department_name, 0 FROM departments;
SELECT last_name FROM employees UNION ALL SELECT department_name FROM departments ORDER BY department_name;
SELECT last_name FROM employees ORDER BY last_name UNION SELECT department_name FROM departments;

PROMPT ==== X131 esperado 40 (1 fila)
CREATE TABLE a (n NUMBER);
CREATE TABLE b (n NUMBER);
INSERT INTO a VALUES (10);
INSERT INTO a VALUES (20);
INSERT INTO a VALUES (30);
INSERT INTO a VALUES (30);
INSERT INTO b VALUES (20);
INSERT INTO b VALUES (40);
INSERT INTO b VALUES (40);
SELECT n FROM b MINUS SELECT n FROM a;
DROP TABLE a PURGE;
DROP TABLE b PURGE;

PROMPT ==== X132 esperado 2200, 13200
SELECT 1000 + 100 * 12 c1, (1000 + 100) * 12 c2 FROM dual;

PROMPT ==== X135 esperado King
CREATE TABLE emp (emp_id NUMBER, name VARCHAR2(10), dept_id NUMBER);
INSERT INTO emp VALUES (1, 'King', 10);
INSERT INTO emp VALUES (2, 'Lee', 20);
INSERT INTO emp VALUES (3, 'Diaz', NULL);
INSERT INTO emp VALUES (4, 'Mora', 30);
SELECT name FROM emp WHERE dept_id IN (10, NULL);
DROP TABLE emp PURGE;

PROMPT ==== X136 esperado empleados de 2003 (King, Rajs, Whalen)
SELECT last_name, hire_date FROM employees WHERE hire_date LIKE '%03';
EXIT;
