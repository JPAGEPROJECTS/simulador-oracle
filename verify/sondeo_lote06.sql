-- Sondeo previo al lote 06
SET FEEDBACK ON
CREATE TABLE t_tx (c NUMBER);
PROMPT ==== caso 1: DDL semanticamente invalido (tabla ya existe) tras INSERT
INSERT INTO t_tx VALUES (1);
CREATE TABLE t_tx (c NUMBER);
ROLLBACK;
SELECT COUNT(*) caso1 FROM t_tx;
PROMPT ==== caso 2: DDL con error de sintaxis tras INSERT
INSERT INTO t_tx VALUES (2);
CREATE TABLE t_tx2 (c NUMBER,);
ROLLBACK;
SELECT COUNT(*) caso2 FROM t_tx;
DROP TABLE t_tx PURGE;
PROMPT ==== (+) con OR y mezclado con ANSI
SELECT e.last_name FROM employees e, departments d WHERE e.department_id = d.department_id(+) OR e.manager_id = 100;
SELECT e.last_name FROM employees e JOIN jobs j ON e.job_id = j.job_id, departments d WHERE e.department_id = d.department_id(+);
PROMPT ==== LAST_NUMBER con cache
CREATE SEQUENCE s_ln START WITH 1 CACHE 20;
SELECT s_ln.NEXTVAL FROM dual;
SELECT last_number FROM user_sequences WHERE sequence_name = 'S_LN';
DROP SEQUENCE s_ln;
PROMPT ==== CHECK con SYSDATE
CREATE TABLE t_ck (d DATE CHECK (d <= SYSDATE));
PROMPT ==== UPDATE SET (a,b) = (literales)
UPDATE employees SET (job_id, salary) = ('IT_PROG', 1) WHERE employee_id = 999;
UPDATE employees SET job_id = 'IT_PROG' AND salary = 1 WHERE employee_id = 999;
EXIT;
