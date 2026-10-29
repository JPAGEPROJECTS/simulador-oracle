-- Lote 02 (1Z0-071): X012-X040
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON
SET VERIFY OFF
ALTER SESSION SET NLS_DATE_FORMAT = 'DD-MON-RR';

PROMPT ==== X012 c: tabla sin PK se crea (esperado OK)
CREATE TABLE t_nopk (c1 NUMBER);
DROP TABLE t_nopk PURGE;
PROMPT ==== X012 b: FK hacia columna sin PK/UK (esperado ORA-02270)
CREATE TABLE t_p (c1 NUMBER);
CREATE TABLE t_h (c1 NUMBER REFERENCES t_p(c1));
DROP TABLE t_p PURGE;
PROMPT ==== X012 d: FK con nombre distinto (esperado OK)
CREATE TABLE t_h2 (depto NUMBER REFERENCES departments(department_id));
DROP TABLE t_h2 PURGE;

PROMPT ==== X013 a: CHAR(10) longitud 10
CREATE TABLE t_ch (c CHAR(10));
INSERT INTO t_ch VALUES ('abc');
SELECT LENGTH(c) FROM t_ch;
DROP TABLE t_ch PURGE;
PROMPT ==== X013 b: dos LONG (esperado ORA-01754)
CREATE TABLE t_long (a LONG, b LONG);
PROMPT ==== X013 c: VARCHAR2 sin longitud (esperado error)
CREATE TABLE t_v (a VARCHAR2);
PROMPT ==== X013 d: NUMBER(5,2) 1234.5 (esperado ORA-01438)
CREATE TABLE t_n (a NUMBER(5,2));
INSERT INTO t_n VALUES (1234.5);
DROP TABLE t_n PURGE;
PROMPT ==== X013 e: BLOB en ORDER BY (esperado error)
CREATE TABLE t_b (a BLOB);
SELECT * FROM t_b ORDER BY a;
DROP TABLE t_b PURGE;

PROMPT ==== X014: DISTINCT dept, job (NULL dept aparece)
SELECT COUNT(*) FROM (SELECT DISTINCT department_id, job_id FROM employees);
SELECT COUNT(*) FROM (SELECT DISTINCT department_id, job_id FROM employees) WHERE department_id IS NULL;

PROMPT ==== X015 esperado: King NULL, Abel 14300
SELECT last_name, salary + salary * commission_pct AS total FROM employees WHERE last_name IN ('King', 'Abel');

PROMPT ==== X016 esperado: King's salary is 24000
SELECT last_name || q'['s salary is ]' || salary AS info FROM employees WHERE employee_id = 100;

PROMPT ==== X017 a, b OK; c, d, e error
SELECT last_name "Employee Name" FROM employees WHERE ROWNUM = 1;
SELECT last_name AS "Employee Name" FROM employees WHERE ROWNUM = 1;
SELECT last_name AS 'Employee Name' FROM employees;
SELECT last_name Employee Name FROM employees;
SELECT last_name AS [Employee Name] FROM employees;

PROMPT ==== X018 esperado: no rows
SELECT last_name FROM employees WHERE salary BETWEEN 10000 AND 5000;

PROMPT ==== X019
CREATE TABLE t_jobs (job_id VARCHAR2(10));
INSERT INTO t_jobs VALUES ('SA_MAN');
INSERT INTO t_jobs VALUES ('SA_REP');
INSERT INTO t_jobs VALUES ('SAX1');
INSERT INTO t_jobs VALUES ('AD_PRES');
PROMPT -- a (esperado SA_MAN, SA_REP)
SELECT job_id FROM t_jobs WHERE job_id LIKE 'SA\_%' ESCAPE '\';
PROMPT -- b (esperado tambien SAX1)
SELECT job_id FROM t_jobs WHERE job_id LIKE 'SA_%';
PROMPT -- c (esperado no rows)
SELECT job_id FROM t_jobs WHERE job_id LIKE 'SA\_%';
DROP TABLE t_jobs PURGE;

PROMPT ==== X020 esperado: 3 SA_REP + King
SELECT last_name, job_id, salary FROM employees
WHERE job_id = 'SA_REP' OR job_id = 'AD_PRES' AND salary > 15000;

PROMPT ==== X021 a, b, c OK; d ORA-01785; e ORA-00904
SELECT last_name, salary * 12 annual FROM employees WHERE ROWNUM < 2 ORDER BY annual;
SELECT last_name, salary * 12 annual FROM employees WHERE ROWNUM < 2 ORDER BY 2;
SELECT last_name, salary * 12 annual FROM employees WHERE ROWNUM < 2 ORDER BY department_id;
SELECT last_name, salary * 12 annual FROM employees ORDER BY 3;
SELECT last_name, salary * 12 annual FROM employees ORDER BY "Annual";

PROMPT ==== X022 esperado: no rows
CREATE TABLE sales_reps (rep_id NUMBER, name VARCHAR2(10), commission_pct NUMBER(2,2));
INSERT INTO sales_reps VALUES (1, 'Abel', .3);
INSERT INTO sales_reps VALUES (2, 'Grant', NULL);
INSERT INTO sales_reps VALUES (3, 'Vargas', NULL);
INSERT INTO sales_reps VALUES (4, 'Taylor', .2);
SELECT name FROM sales_reps WHERE commission_pct = NULL OR commission_pct != NULL;
DROP TABLE sales_reps PURGE;

PROMPT ==== X023 esperado ORA-01791
SELECT DISTINCT department_id FROM employees ORDER BY last_name;

PROMPT ==== X026 esperado 1600, 1572.3, 2
SELECT ROUND(1572.36, -2), TRUNC(1572.36, 1), MOD(17, -5) FROM dual;

PROMPT ==== X027 esperado BC, Hix, 007
SELECT TRIM('A' FROM 'AABCAA') AS t1, LTRIM('xxyxHix', 'xy') AS t2, LPAD('7', 3, '0') AS t3 FROM dual;

PROMPT ==== X028 esperado BLACK AND BLUE, XBC23
SELECT REPLACE('JACK AND JUE', 'J', 'BL'), TRANSLATE('ABC123', 'A1', 'X') FROM dual;

PROMPT ==== X029 esperado a=6 b=2 c=3 d=3 e=3 f=3.9
SELECT INSTR('ABCABC', 'C', 1, 2) a, LENGTH(TRIM(' AB ')) b, CEIL(2.01) c, FLOOR(3.99) d, ROUND(2.5) e, TRUNC(3.999, 1) f FROM dual;

PROMPT ==== X030 esperado RR 1950, YY 2050
SELECT TO_CHAR(TO_DATE('10-MAR-50', 'DD-MON-RR'), 'YYYY') AS rr, TO_CHAR(TO_DATE('10-MAR-50', 'DD-MON-YY'), 'YYYY') AS yy FROM dual;

PROMPT ==== X031 a OK, b ORA-01722, c OK, d ORA-01843, e ORA-01722
SELECT TO_NUMBER('$1,000.50', '$9,999.99') FROM dual;
SELECT TO_NUMBER('$1,000') FROM dual;
SELECT TO_CHAR(SYSDATE, 'fmMonth DD, YYYY') FROM dual;
SELECT TO_DATE('2024-13-01', 'YYYY-MM-DD') FROM dual;
SELECT TO_CHAR('2024-01-01', 'YYYY') FROM dual;

PROMPT ==== X032 esperado ORA-01722
SELECT last_name, NVL(commission_pct, 'No commission') FROM employees;

PROMPT ==== X033 para King: a None, b Has, c None, d Has, e Has
SELECT DECODE(commission_pct, NULL, 'None', 'Has') a,
       CASE commission_pct WHEN NULL THEN 'None' ELSE 'Has' END b,
       CASE WHEN commission_pct IS NULL THEN 'None' ELSE 'Has' END c,
       NVL2(commission_pct, 'None', 'Has') d,
       NVL(TO_CHAR(commission_pct), 'Has') e
FROM employees WHERE employee_id = 100;

PROMPT ==== X034 esperado 1 fila: 21
SELECT COUNT(*) FROM employees HAVING COUNT(*) > 5;

PROMPT ==== X035 esperado 5, 3, 2
CREATE TABLE staff (staff_id NUMBER, dept NUMBER);
INSERT INTO staff VALUES (1, 10);
INSERT INTO staff VALUES (2, 10);
INSERT INTO staff VALUES (3, 20);
INSERT INTO staff VALUES (4, NULL);
INSERT INTO staff VALUES (5, NULL);
SELECT COUNT(*), COUNT(dept), COUNT(DISTINCT dept) FROM staff;
DROP TABLE staff PURGE;

PROMPT ==== X036 a OK, b ORA-00904, c OK, d ORA-00934, e ORA-00979
SELECT department_id, SUM(salary) FROM employees HAVING SUM(salary) > 20000 GROUP BY department_id;
SELECT department_id dept, SUM(salary) FROM employees GROUP BY dept;
SELECT department_id, SUM(salary) FROM employees GROUP BY department_id ORDER BY SUM(salary) FETCH FIRST 1 ROWS ONLY;
SELECT last_name FROM employees WHERE salary > AVG(salary);
SELECT department_id, SUM(salary) FROM employees GROUP BY 1;

PROMPT ==== X037/X038
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
PROMPT -- X037 full (esperado 6), left 5, inner 3
SELECT COUNT(*) full_cnt FROM emp e FULL OUTER JOIN dept d ON e.dept_id = d.dept_id;
SELECT COUNT(*) left_cnt FROM emp e LEFT OUTER JOIN dept d ON e.dept_id = d.dept_id;
SELECT COUNT(*) inner_cnt FROM emp e JOIN dept d ON e.dept_id = d.dept_id;
PROMPT -- X038: original MINUS a / b deben dar 0 filas y mismo conteo (5)
SELECT e.name, d.dname FROM emp e LEFT OUTER JOIN dept d ON e.dept_id = d.dept_id
MINUS SELECT e.name, d.dname FROM emp e, dept d WHERE e.dept_id = d.dept_id(+);
SELECT COUNT(*) a_cnt FROM emp e, dept d WHERE e.dept_id = d.dept_id(+);
SELECT COUNT(*) b_cnt FROM dept d RIGHT OUTER JOIN emp e ON e.dept_id = d.dept_id;
SELECT COUNT(*) c_cnt FROM emp e, dept d WHERE e.dept_id(+) = d.dept_id;
SELECT e.name FROM emp e, dept d WHERE e.dept_id(+) = d.dept_id(+);
DROP TABLE emp PURGE;
DROP TABLE dept PURGE;

PROMPT ==== X039 King no debe aparecer como worker (esperado 20 filas, 0 King)
SELECT COUNT(*), SUM(CASE WHEN w.last_name = 'King' THEN 1 ELSE 0 END) king
FROM employees w JOIN employees m ON w.manager_id = m.employee_id;

PROMPT ==== X040 esperado 2 filas (A y B)
CREATE TABLE job_grades (grade CHAR(1), lowest_sal NUMBER, highest_sal NUMBER);
INSERT INTO job_grades VALUES ('A', 1000, 3000);
INSERT INTO job_grades VALUES ('B', 3000, 5999);
INSERT INTO job_grades VALUES ('C', 6000, 9999);
CREATE TABLE emp2 (last_name VARCHAR2(10), salary NUMBER);
INSERT INTO emp2 VALUES ('Ruiz', 3000);
SELECT e.last_name, g.grade FROM emp2 e JOIN job_grades g ON e.salary BETWEEN g.lowest_sal AND g.highest_sal WHERE e.last_name = 'Ruiz';
DROP TABLE job_grades PURGE;
DROP TABLE emp2 PURGE;
ROLLBACK;
EXIT;
