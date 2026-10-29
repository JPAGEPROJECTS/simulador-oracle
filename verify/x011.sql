-- X011: && define la variable; se pide una sola vez.
-- Ejecutar con la entrada por stdin: printf 'last_name\n' | sqlplus -S ... @verify/x011.sql
SET FEEDBACK ON
SET VERIFY OFF
SET PAGESIZE 0
SELECT employee_id, &&col
FROM   employees
WHERE  ROWNUM <= 1
ORDER BY &col;

SELECT &col FROM departments WHERE ROWNUM <= 1;
UNDEFINE col
EXIT;
