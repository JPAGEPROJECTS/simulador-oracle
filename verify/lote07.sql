-- Lote 07 (1Z0-071): X168-X198 (ver también sondeo_lote07.sql, x190_*.sql, x197_emp_dept.sql)
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

PROMPT ==== X168 a, b = King, Kochhar, kelly; c = kelly; e = 0
CREATE TABLE names (last_name VARCHAR2(20));
INSERT INTO names VALUES ('King');
INSERT INTO names VALUES ('Kochhar');
INSERT INTO names VALUES ('kelly');
INSERT INTO names VALUES ('Abel');
SELECT COUNT(*) a FROM names WHERE UPPER(last_name) LIKE 'K%';
SELECT COUNT(*) b FROM names WHERE last_name LIKE 'K%' OR last_name LIKE 'k%';
SELECT COUNT(*) c FROM names WHERE last_name LIKE 'k%';
SELECT COUNT(*) d FROM names WHERE last_name = 'K%';
SELECT COUNT(*) e FROM names WHERE LOWER(last_name) LIKE 'K%';
DROP TABLE names PURGE;

PROMPT ==== X169 conteos: between = a = b; c distinto
SELECT (SELECT COUNT(*) FROM employees WHERE salary BETWEEN 6000 AND 17000) btw,
       (SELECT COUNT(*) FROM employees WHERE salary >= 6000 AND salary <= 17000) a,
       (SELECT COUNT(*) FROM employees WHERE NOT (salary < 6000 OR salary > 17000)) b,
       (SELECT COUNT(*) FROM employees WHERE salary > 6000 AND salary < 17000) c
FROM dual;

PROMPT ==== X170 esperado Beto, Carla, Ana, Dario
CREATE TABLE staff (name VARCHAR2(10), dept NUMBER, salary NUMBER);
INSERT INTO staff VALUES ('Ana', 10, 3000);
INSERT INTO staff VALUES ('Beto', NULL, 5000);
INSERT INTO staff VALUES ('Carla', 10, 4000);
INSERT INTO staff VALUES ('Dario', 20, 1000);
SELECT name FROM staff ORDER BY dept NULLS FIRST, salary DESC;
DROP TABLE staff PURGE;

PROMPT ==== X171 a, b, c = [ABC]; d [ABC   ]; e [abc]; f [ABC ]
SELECT '[' || UPPER('abc') || ']' a, '[' || SUBSTR('XABCX', 2, 3) || ']' b, '[' || LTRIM('  ABC') || ']' c,
       '[' || RTRIM('ABC   ', 'C') || ']' d, '[' || TRANSLATE('ABC', 'ABC', 'abc') || ']' e, '[' || CONCAT('A', 'BC ') || ']' f
FROM dual;

PROMPT ==== X172 a, b OK
SELECT TO_DATE('2025-01-01', 'YYYY-MM-DD') a, DATE '2025-01-01' b FROM dual;

PROMPT ==== X174 a = b = 7; c = 19; e = 8
SELECT COUNT(DISTINCT department_id) a FROM employees;
SELECT COUNT(*) b FROM (SELECT DISTINCT department_id FROM employees WHERE department_id IS NOT NULL);
SELECT COUNT(department_id) c FROM employees;
SELECT DISTINCT COUNT(department_id) d FROM employees;
SELECT COUNT(*) e FROM (SELECT DISTINCT department_id FROM employees);

PROMPT ==== X175 esperado OK
SELECT department_id, MAX(salary) FROM employees GROUP BY department_id ORDER BY MIN(salary);

PROMPT ==== X176 a, b OK; c ORA-00904; d, e error
SELECT COUNT(*) a FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN jobs j ON e.job_id = j.job_id;
SELECT COUNT(*) b FROM employees e JOIN departments d USING (department_id) JOIN jobs j USING (job_id);
SELECT COUNT(*) FROM employees e, departments d JOIN jobs j ON e.job_id = j.job_id WHERE e.department_id = d.department_id;
SELECT COUNT(*) FROM employees e JOIN departments d ON (department_id) JOIN jobs j ON (job_id);
SELECT COUNT(*) FROM employees e NATURAL JOIN departments d USING (department_id) JOIN jobs j USING (job_id);

PROMPT ==== X177 a = b; c distinto; d ORA-01427
SELECT COUNT(*) a FROM employees WHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 60);
SELECT COUNT(*) b FROM employees WHERE salary > (SELECT MAX(salary) FROM employees WHERE department_id = 60);
SELECT COUNT(*) c FROM employees WHERE salary > ANY (SELECT salary FROM employees WHERE department_id = 60);
SELECT COUNT(*) FROM employees WHERE salary > (SELECT salary FROM employees WHERE department_id = 60);

PROMPT ==== X178 esperado Grant con DEPT NULL
SELECT e.last_name, NVL((SELECT d.department_name FROM departments d WHERE d.department_id = e.department_id), '(null)') AS dept
FROM employees e WHERE e.last_name = 'Grant';

PROMPT ==== X179 a = b; e conserva duplicados
CREATE TABLE a (n NUMBER NOT NULL);
CREATE TABLE b (n NUMBER NOT NULL);
INSERT INTO a VALUES (1);
INSERT INTO a VALUES (1);
INSERT INTO a VALUES (2);
INSERT INTO a VALUES (3);
INSERT INTO b VALUES (3);
SELECT n FROM a MINUS SELECT n FROM b;
SELECT DISTINCT n FROM a WHERE NOT EXISTS (SELECT 1 FROM b WHERE b.n = a.n) ORDER BY 1;
SELECT n FROM a WHERE n NOT IN (SELECT n FROM b);
DROP TABLE a PURGE;
DROP TABLE b PURGE;

PROMPT ==== X187 USER_VIEWS.TEXT
CREATE VIEW v_txt AS SELECT employee_id FROM employees;
SELECT view_name, text FROM user_views WHERE view_name = 'V_TXT';
DROP VIEW v_txt;

PROMPT ==== X191 esperado ORA-14452
CREATE GLOBAL TEMPORARY TABLE gtt_cart (item NUMBER) ON COMMIT PRESERVE ROWS;
INSERT INTO gtt_cart VALUES (1);
COMMIT;
DROP TABLE gtt_cart;
TRUNCATE TABLE gtt_cart;
DROP TABLE gtt_cart;

PROMPT ==== X196 esperado 0 filas; con TRUNC 1
CREATE TABLE orders (order_id NUMBER, order_date DATE);
INSERT INTO orders VALUES (1, TO_DATE('2024-03-15 14:30:00', 'YYYY-MM-DD HH24:MI:SS'));
SELECT order_id FROM orders WHERE order_date = DATE '2024-03-15';
SELECT order_id FROM orders WHERE TRUNC(order_date) = DATE '2024-03-15';
DROP TABLE orders PURGE;

PROMPT ==== X198 e: CLOB como PK (esperado error)
CREATE TABLE t_clob (c CLOB PRIMARY KEY);
EXIT;
