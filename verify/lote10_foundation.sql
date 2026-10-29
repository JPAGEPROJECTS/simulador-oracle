-- Lote 10 (Database Foundation): preguntas con SQL ejecutable (F032, F038-F043, F051)
SET PAGESIZE 100
SET LINESIZE 200
SET FEEDBACK ON

PROMPT ==== F032 FK NOT NULL UNIQUE implementa 1:1 (segundo carnet del mismo empleado: ORA-00001)
CREATE TABLE empleados (emp_id NUMBER PRIMARY KEY);
CREATE TABLE carnets (carnet_id NUMBER PRIMARY KEY, emp_id NUMBER NOT NULL UNIQUE REFERENCES empleados (emp_id));
INSERT INTO empleados VALUES (1);
INSERT INTO carnets VALUES (10, 1);
INSERT INTO carnets VALUES (11, 1);
DROP TABLE carnets PURGE;
DROP TABLE empleados PURGE;

PROMPT ==== F038 a OK; b error; c sin INTO (error); d ORA-01400
CREATE TABLE courses (course_id NUMBER(4) PRIMARY KEY, title VARCHAR2(40) NOT NULL, credits NUMBER(2));
INSERT INTO courses (course_id, title, credits) VALUES (101, 'Bases de datos', 4);
INSERT INTO courses (course_id, title, credits) VALUES (101, Bases de datos, 4);
INSERT courses VALUES (102, 'Bases de datos', 4);
INSERT INTO courses (course_id, credits) VALUES (103, 4);
DROP TABLE courses PURGE;

PROMPT ==== F039 esperado 2 rows updated
CREATE TABLE staff (staff_id NUMBER, name VARCHAR2(10), dept_id NUMBER, salary NUMBER);
INSERT INTO staff VALUES (1, 'Ana', 10, 3000);
INSERT INTO staff VALUES (2, 'Beto', 20, 4000);
INSERT INTO staff VALUES (3, 'Carla', 10, 3500);
INSERT INTO staff VALUES (4, 'Dario', 30, 5000);
COMMIT;
UPDATE staff SET salary = salary + 500 WHERE dept_id = 10;
ROLLBACK;
PROMPT ==== F043 esperado Dario primero
SELECT name, salary FROM staff ORDER BY salary DESC;
DROP TABLE staff PURGE;

PROMPT ==== F040 a, b OK; c, d, e error
CREATE TABLE students (id NUMBER(5), name VARCHAR2(30));
CREATE TABLE courses (code CHAR(6) PRIMARY KEY, credits NUMBER(2));
CREATE TABLE grades (id NUMBER, grade VARCHAR2);
CREATE TABLE 1students (id NUMBER);
CREATE students (id NUMBER);
DROP TABLE students PURGE;
DROP TABLE courses PURGE;

PROMPT ==== F042 esperado ORA-00904 "Steven"
SELECT last_name FROM employees WHERE first_name = "Steven";

PROMPT ==== F051 esperado NULL
SELECT NVL(TO_CHAR(1000 + NULL), '(null)') r FROM dual;
EXIT;
