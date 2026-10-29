-- ============================================================
-- setup.sql - Esquema de pruebas para verificar las preguntas
-- Uso: sqlplus -S <usuario>/<clave>@localhost:1521/COFFEEPDB @verify/setup.sql
-- Crea JOBS, DEPARTMENTS y EMPLOYEES (estilo HR) con NULLs. Solo ASCII.
-- Es re-ejecutable: borra las tablas si ya existen.
-- ============================================================
SET FEEDBACK OFF
SET SERVEROUTPUT ON

BEGIN
  FOR t IN (SELECT table_name FROM user_tables
            WHERE table_name IN ('EMPLOYEES', 'DEPARTMENTS', 'JOBS')) LOOP
    EXECUTE IMMEDIATE 'DROP TABLE ' || t.table_name || ' CASCADE CONSTRAINTS PURGE';
  END LOOP;
END;
/

CREATE TABLE jobs (
  job_id      VARCHAR2(10) CONSTRAINT jobs_pk PRIMARY KEY,
  job_title   VARCHAR2(35) NOT NULL,
  min_salary  NUMBER(6),
  max_salary  NUMBER(6)
);

CREATE TABLE departments (
  department_id    NUMBER(4)    CONSTRAINT dept_pk PRIMARY KEY,
  department_name  VARCHAR2(30) NOT NULL,
  manager_id       NUMBER(6),
  location_id      NUMBER(4)
);

CREATE TABLE employees (
  employee_id     NUMBER(6)    CONSTRAINT emp_pk PRIMARY KEY,
  first_name      VARCHAR2(20),
  last_name       VARCHAR2(25) NOT NULL,
  email           VARCHAR2(25) NOT NULL CONSTRAINT emp_email_uk UNIQUE,
  hire_date       DATE         NOT NULL,
  job_id          VARCHAR2(10) CONSTRAINT emp_job_fk REFERENCES jobs (job_id),
  salary          NUMBER(8,2),
  commission_pct  NUMBER(2,2),
  manager_id      NUMBER(6)    CONSTRAINT emp_mgr_fk REFERENCES employees (employee_id),
  department_id   NUMBER(4)    CONSTRAINT emp_dept_fk REFERENCES departments (department_id)
);

INSERT INTO jobs VALUES ('AD_PRES',   'President',                     20000, 40000);
INSERT INTO jobs VALUES ('AD_VP',     'Administration Vice President', 15000, 30000);
INSERT INTO jobs VALUES ('AD_ASST',   'Administration Assistant',       3000,  6000);
INSERT INTO jobs VALUES ('IT_PROG',   'Programmer',                     4000, 10000);
INSERT INTO jobs VALUES ('SA_MAN',    'Sales Manager',                 10000, 20000);
INSERT INTO jobs VALUES ('SA_REP',    'Sales Representative',           6000, 12000);
INSERT INTO jobs VALUES ('ST_MAN',    'Stock Manager',                  5500,  8500);
INSERT INTO jobs VALUES ('ST_CLERK',  'Stock Clerk',                    2000,  5000);
INSERT INTO jobs VALUES ('MK_MAN',    'Marketing Manager',              9000, 15000);
INSERT INTO jobs VALUES ('MK_REP',    'Marketing Representative',       4000,  9000);
INSERT INTO jobs VALUES ('AC_MGR',    'Accounting Manager',             8200, 16000);
INSERT INTO jobs VALUES ('AC_ACCOUNT','Public Accountant',              4200,  9000);
INSERT INTO jobs VALUES ('HR_REP',    'Human Resources Representative', 4000,  9000);

INSERT INTO departments VALUES (10,  'Administration', 200, 1700);
INSERT INTO departments VALUES (20,  'Marketing',      201, 1800);
INSERT INTO departments VALUES (50,  'Shipping',       124, 1500);
INSERT INTO departments VALUES (60,  'IT',             103, 1400);
INSERT INTO departments VALUES (80,  'Sales',          149, 2500);
INSERT INTO departments VALUES (90,  'Executive',      100, 1700);
INSERT INTO departments VALUES (110, 'Accounting',     205, 1700);
INSERT INTO departments VALUES (190, 'Contracting',    NULL, 1700);

-- employee_id, first, last, email, hire_date, job, salary, comm, mgr, dept
INSERT INTO employees VALUES (100, 'Steven',    'King',      'SKING',    DATE '2003-06-17', 'AD_PRES',    24000, NULL, NULL, 90);
INSERT INTO employees VALUES (101, 'Neena',     'Kochhar',   'NKOCHHAR', DATE '2005-09-21', 'AD_VP',      17000, NULL, 100,  90);
INSERT INTO employees VALUES (102, 'Lex',       'De Haan',   'LDEHAAN',  DATE '2001-01-13', 'AD_VP',      17000, NULL, 100,  90);
INSERT INTO employees VALUES (103, 'Alexander', 'Hunold',    'AHUNOLD',  DATE '2006-01-03', 'IT_PROG',     9000, NULL, 102,  60);
INSERT INTO employees VALUES (104, 'Bruce',     'Ernst',     'BERNST',   DATE '2007-05-21', 'IT_PROG',     6000, NULL, 103,  60);
INSERT INTO employees VALUES (107, 'Diana',     'Lorentz',   'DLORENTZ', DATE '2007-02-07', 'IT_PROG',     4200, NULL, 103,  60);
INSERT INTO employees VALUES (124, 'Kevin',     'Mourgos',   'KMOURGOS', DATE '2007-11-16', 'ST_MAN',      5800, NULL, 100,  50);
INSERT INTO employees VALUES (141, 'Trenna',    'Rajs',      'TRAJS',    DATE '2003-10-17', 'ST_CLERK',    3500, NULL, 124,  50);
INSERT INTO employees VALUES (142, 'Curtis',    'Davies',    'CDAVIES',  DATE '2005-01-29', 'ST_CLERK',    3100, NULL, 124,  50);
INSERT INTO employees VALUES (143, 'Randall',   'Matos',     'RMATOS',   DATE '2006-03-15', 'ST_CLERK',    2600, NULL, 124,  50);
INSERT INTO employees VALUES (144, 'Peter',     'Vargas',    'PVARGAS',  DATE '2006-07-09', 'ST_CLERK',    2500, NULL, 124,  50);
INSERT INTO employees VALUES (149, 'Eleni',     'Zlotkey',   'EZLOTKEY', DATE '2008-01-29', 'SA_MAN',     10500, .2,   100,  80);
INSERT INTO employees VALUES (174, 'Ellen',     'Abel',      'EABEL',    DATE '2004-05-11', 'SA_REP',     11000, .3,   149,  80);
INSERT INTO employees VALUES (176, 'Jonathon',  'Taylor',    'JTAYLOR',  DATE '2006-03-24', 'SA_REP',      8600, .2,   149,  80);
INSERT INTO employees VALUES (178, 'Kimberely', 'Grant',     'KGRANT',   DATE '2007-05-24', 'SA_REP',      7000, .15,  149,  NULL);
INSERT INTO employees VALUES (200, 'Jennifer',  'Whalen',    'JWHALEN',  DATE '2003-09-17', 'AD_ASST',     4400, NULL, 101,  10);
INSERT INTO employees VALUES (201, 'Michael',   'Hartstein', 'MHARTSTE', DATE '2004-02-17', 'MK_MAN',     13000, NULL, 100,  20);
INSERT INTO employees VALUES (202, 'Pat',       'Fay',       'PFAY',     DATE '2005-08-17', 'MK_REP',      6000, NULL, 201,  20);
INSERT INTO employees VALUES (205, 'Shelley',   'Higgins',   'SHIGGINS', DATE '2002-06-07', 'AC_MGR',     12008, NULL, 101,  110);
INSERT INTO employees VALUES (206, 'William',   'Gietz',     'WGIETZ',   DATE '2002-06-07', 'AC_ACCOUNT',  8300, NULL, 205,  110);
INSERT INTO employees VALUES (210, 'Ana',       'Lopez',     'ALOPEZ',   DATE '2009-04-01', NULL,          NULL, NULL, 100,  NULL);
COMMIT;

SELECT 'JOBS=' || (SELECT COUNT(*) FROM jobs) ||
       ' DEPARTMENTS=' || (SELECT COUNT(*) FROM departments) ||
       ' EMPLOYEES=' || (SELECT COUNT(*) FROM employees) AS setup
FROM dual;
EXIT;
