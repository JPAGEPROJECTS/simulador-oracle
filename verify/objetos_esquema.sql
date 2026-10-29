-- Lista los objetos del esquema SIM071 (control de limpieza)
SET PAGESIZE 100
COLUMN object_name FORMAT A30
PURGE RECYCLEBIN;
SELECT object_type, object_name FROM user_objects ORDER BY 1, 2;
SELECT COUNT(*) emp_rows FROM employees;
EXIT;
