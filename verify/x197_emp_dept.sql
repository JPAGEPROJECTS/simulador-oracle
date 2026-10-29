-- X197: ejecutar con @verify/x197_emp_dept.sql 50
SET VERIFY OFF
SELECT last_name FROM employees WHERE department_id = &1 AND ROWNUM <= 2;
EXIT;
