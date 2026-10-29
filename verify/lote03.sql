-- Lote 03 (1Z0-071): X041-X066
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

PROMPT ==== X041 esperado ORA-00918
SELECT department_id, last_name, department_name
FROM employees e JOIN departments d ON e.department_id = d.department_id;

PROMPT ==== X042 a OK, b ORA-25155, c OK, d error, e ORA-25155
SELECT department_id, e.last_name FROM employees e JOIN departments d USING (department_id) WHERE ROWNUM = 1;
SELECT e.department_id, e.last_name FROM employees e NATURAL JOIN departments d;
SELECT d.department_name, e.manager_id FROM employees e JOIN departments d USING (department_id) WHERE ROWNUM = 1;
SELECT e.last_name FROM employees e JOIN departments d USING (e.department_id);
SELECT last_name, department_name FROM employees NATURAL JOIN departments WHERE employees.manager_id = 100;

PROMPT ==== X043 esperado 24
CREATE TABLE t1 (c NUMBER);
CREATE TABLE t2 (c NUMBER);
CREATE TABLE t3 (c NUMBER);
INSERT INTO t1 SELECT LEVEL FROM dual CONNECT BY LEVEL <= 4;
INSERT INTO t2 SELECT LEVEL FROM dual CONNECT BY LEVEL <= 3;
INSERT INTO t3 SELECT LEVEL FROM dual CONNECT BY LEVEL <= 2;
SELECT COUNT(*) FROM t1 CROSS JOIN t2 CROSS JOIN t3;
DROP TABLE t1 PURGE;
DROP TABLE t2 PURGE;
DROP TABLE t3 PURGE;

PROMPT ==== X044 esperado no rows
SELECT last_name FROM employees WHERE employee_id NOT IN (SELECT manager_id FROM employees);

PROMPT ==== X045 (dept 60 = 9000, 6000, 4200): >ALL=>9000, <ANY=<9000, >ANY=>4200
SELECT (SELECT COUNT(*) FROM employees WHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 60)) gt_all,
       (SELECT COUNT(*) FROM employees WHERE salary > 9000) gt_max,
       (SELECT COUNT(*) FROM employees WHERE salary < ANY (SELECT salary FROM employees WHERE department_id = 60)) lt_any,
       (SELECT COUNT(*) FROM employees WHERE salary < 9000) lt_max,
       (SELECT COUNT(*) FROM employees WHERE salary > ANY (SELECT salary FROM employees WHERE department_id = 60)) gt_any,
       (SELECT COUNT(*) FROM employees WHERE salary > 4200) gt_min
FROM dual;

PROMPT ==== X046 esperado 21
SELECT COUNT(*) FROM employees WHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 999);

PROMPT ==== X047 esperado Hunold, Rajs
CREATE TABLE staff (name VARCHAR2(10), dept NUMBER, salary NUMBER);
INSERT INTO staff VALUES ('Hunold', 60, 9000);
INSERT INTO staff VALUES ('Ernst', 60, 6000);
INSERT INTO staff VALUES ('Lorentz', 60, 4200);
INSERT INTO staff VALUES ('Rajs', 50, 3500);
INSERT INTO staff VALUES ('Davies', 50, 3100);
SELECT s.name FROM staff s WHERE s.salary > (SELECT AVG(i.salary) FROM staff i WHERE i.dept = s.dept);
DROP TABLE staff PURGE;

PROMPT ==== X048 esperado Contracting
SELECT department_name FROM departments d
WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);

PROMPT ==== X049 a,b,c OK; d ORA-22818; e, f error
SELECT (SELECT MAX(salary) FROM employees) m FROM dual;
SELECT last_name FROM employees WHERE salary = (SELECT MAX(salary) FROM employees);
SELECT department_name FROM departments d ORDER BY (SELECT COUNT(*) FROM employees e WHERE e.department_id = d.department_id) FETCH FIRST 1 ROW ONLY;
SELECT COUNT(*) FROM employees GROUP BY (SELECT 1 FROM dual);
CREATE TABLE t_def (c NUMBER DEFAULT (SELECT 1 FROM dual));
CREATE TABLE t_chk (c NUMBER CHECK (c IN (SELECT 1 FROM dual)));

PROMPT ==== X050 esperado 1 fila (1)
CREATE TABLE a (n NUMBER);
CREATE TABLE b (n NUMBER);
INSERT INTO a VALUES (1);
INSERT INTO a VALUES (2);
INSERT INTO a VALUES (2);
INSERT INTO a VALUES (3);
INSERT INTO b VALUES (2);
INSERT INTO b VALUES (3);
INSERT INTO b VALUES (3);
INSERT INTO b VALUES (4);
SELECT n FROM a UNION ALL SELECT n FROM b MINUS SELECT n FROM b;
DROP TABLE a PURGE;
DROP TABLE b PURGE;

PROMPT ==== X051 d: INTERSECT con NULL (esperado 1 fila)
SELECT NULL FROM dual INTERSECT SELECT NULL FROM dual;
PROMPT ==== X051 e: ORDER BY en la primera consulta (esperado error)
SELECT last_name FROM employees ORDER BY 1 UNION SELECT department_name FROM departments;

PROMPT ==== X052 esperado ORA-01790
SELECT employee_id, hire_date FROM employees UNION SELECT department_id, department_name FROM departments;

PROMPT ==== X053
CREATE TABLE dept_copy (department_id NUMBER(4) PRIMARY KEY, department_name VARCHAR2(30) NOT NULL, location_id NUMBER(4) DEFAULT 1700);
PROMPT -- a OK (8 filas)
INSERT INTO dept_copy (department_id, department_name) SELECT department_id, department_name FROM departments;
PROMPT -- b error
INSERT INTO dept_copy VALUES (SELECT department_id, department_name, location_id FROM departments);
PROMPT -- c ORA-01400
INSERT INTO dept_copy (department_id, department_name) VALUES (300, DEFAULT);
PROMPT -- d OK y location 1700
INSERT INTO dept_copy (department_id, department_name, location_id) VALUES (310, 'QA', DEFAULT);
SELECT location_id FROM dept_copy WHERE department_id = 310;
PROMPT -- e ORA-00947
INSERT INTO dept_copy (department_id, department_name) VALUES (320);
DROP TABLE dept_copy PURGE;

PROMPT ==== X054 esperado filas 1 y 3
CREATE TABLE target (id NUMBER, name VARCHAR2(5), val NUMBER);
CREATE TABLE source (id NUMBER, name VARCHAR2(5), val NUMBER);
INSERT INTO target VALUES (1, 'A', 100);
INSERT INTO target VALUES (2, 'B', 200);
INSERT INTO source VALUES (2, 'B2', 250);
INSERT INTO source VALUES (3, 'C', 300);
MERGE INTO target t USING source s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET t.name = s.name, t.val = s.val DELETE WHERE t.val > 240
WHEN NOT MATCHED THEN INSERT VALUES (s.id, s.name, s.val);
SELECT * FROM target ORDER BY id;
PROMPT ==== X055 esperado ORA-38104
MERGE INTO target t USING source s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET t.id = s.id, t.val = s.val;
PROMPT -- X055 c: solo WHEN MATCHED es valido
MERGE INTO target t USING source s ON (t.id = s.id)
WHEN MATCHED THEN UPDATE SET t.val = s.val;
DROP TABLE target PURGE;
DROP TABLE source PURGE;

PROMPT ==== X056 esperado 6 filas insertadas (big 2, mid 3, small 1); INSERT FIRST 4
CREATE TABLE pay (sal NUMBER);
CREATE TABLE big (sal NUMBER);
CREATE TABLE mid (sal NUMBER);
CREATE TABLE small (sal NUMBER);
INSERT INTO pay VALUES (15000);
INSERT INTO pay VALUES (12000);
INSERT INTO pay VALUES (8000);
INSERT INTO pay VALUES (3000);
INSERT ALL
  WHEN sal > 10000 THEN INTO big VALUES (sal)
  WHEN sal > 5000 THEN INTO mid VALUES (sal)
  ELSE INTO small VALUES (sal)
SELECT sal FROM pay;
ROLLBACK;
INSERT FIRST
  WHEN sal > 10000 THEN INTO big VALUES (sal)
  WHEN sal > 5000 THEN INTO mid VALUES (sal)
  ELSE INTO small VALUES (sal)
SELECT sal FROM pay;
DROP TABLE pay PURGE;
DROP TABLE big PURGE;
DROP TABLE mid PURGE;
DROP TABLE small PURGE;

PROMPT ==== X057 b: TRUNCATE de padre con hija vacia (esperado ORA-02266)
CREATE TABLE padre (id NUMBER PRIMARY KEY);
CREATE TABLE hija (pid NUMBER REFERENCES padre(id));
INSERT INTO padre VALUES (1);
TRUNCATE TABLE padre;
PROMPT ==== X057 a: TRUNCATE no se deshace (esperado 0 tras rollback)
DROP TABLE hija PURGE;
TRUNCATE TABLE padre;
ROLLBACK;
SELECT COUNT(*) FROM padre;
DROP TABLE padre PURGE;

PROMPT ==== X058 esperado 3 filas
CREATE TABLE players (name VARCHAR2(10), score NUMBER);
INSERT INTO players VALUES ('Ana', 95);
INSERT INTO players VALUES ('Beto', 90);
INSERT INTO players VALUES ('Carla', 90);
INSERT INTO players VALUES ('Dario', 85);
INSERT INTO players VALUES ('Eva', 80);
SELECT name, score FROM players ORDER BY score DESC FETCH FIRST 2 ROWS WITH TIES;
PROMPT ==== X059 esperado filas 4 y 5 (scores 70, 60)
DELETE FROM players;
INSERT INTO players SELECT 'P' || LEVEL, 110 - LEVEL * 10 FROM dual CONNECT BY LEVEL <= 10;
SELECT name, score FROM players ORDER BY score DESC OFFSET 3 ROWS FETCH NEXT 20 PERCENT ROWS ONLY;
PROMPT ==== X060 b: OFFSET negativo (esperado 2 primeras filas, sin error)
SELECT name, score FROM players ORDER BY score DESC OFFSET -5 ROWS FETCH NEXT 2 ROWS ONLY;
PROMPT ==== X060 e: PERCENT + WITH TIES (esperado OK)
SELECT name, score FROM players ORDER BY score DESC FETCH FIRST 10 PERCENT ROWS WITH TIES;
DROP TABLE players PURGE;

PROMPT ==== X061 esperado ORA-01086 y luego 1 fila
CREATE TABLE t (c NUMBER);
INSERT INTO t VALUES (1);
SAVEPOINT a;
INSERT INTO t VALUES (2);
SAVEPOINT b;
INSERT INTO t VALUES (3);
ROLLBACK TO SAVEPOINT a;
ROLLBACK TO SAVEPOINT b;
COMMIT;
SELECT COUNT(*) FROM t;

PROMPT ==== X062 e: error de restriccion no termina la transaccion (esperado: tras rollback, 1 fila)
INSERT INTO t VALUES (99);
INSERT INTO employees (employee_id, last_name, email, hire_date) VALUES (100, 'X', 'X', SYSDATE);
ROLLBACK;
SELECT COUNT(*) FROM t;
PROMPT ==== X062 a: CREATE INDEX confirma (esperado 2 filas tras rollback)
INSERT INTO t VALUES (5);
CREATE INDEX t_ix ON t (c);
ROLLBACK;
SELECT COUNT(*) FROM t;
PROMPT ==== X062 b: fila insertada antes de EXIT (verificar en x062_exit.sql)
INSERT INTO t VALUES (7);

PROMPT ==== X064 a, b OK; c ORA-00975; d ORA-00932; e ORA-00909
SELECT hire_date + 30 FROM employees WHERE employee_id = 100;
SELECT ROUND(SYSDATE - hire_date) FROM employees WHERE employee_id = 100;
SELECT SYSDATE + hire_date FROM employees;
SELECT hire_date * 2 FROM employees;
SELECT MONTHS_BETWEEN(hire_date) FROM employees;

PROMPT ==== X065 esperado 16-MAR-2024 06:00
SELECT TO_CHAR(DATE '2024-03-15' + 1/24 * 30, 'DD-MON-YYYY HH24:MI') AS r FROM dual;

PROMPT ==== X066 esperado -6
SELECT ROUND(MONTHS_BETWEEN(DATE '2024-01-01', DATE '2024-07-01')) AS m FROM dual;
EXIT;
