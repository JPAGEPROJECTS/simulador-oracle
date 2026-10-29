-- X024: DEFINE + VERIFY ON (no debe pedir valor; muestra old/new)
-- X025: &name sin comillas, entrada King por stdin (esperado ORA-00904 "KING")
-- Ejecutar: printf 'King\n' | sqlplus -S ... @verify/x024_x025.sql
SET FEEDBACK ON
PROMPT ==== X024
DEFINE dept = 50
SET VERIFY ON
SELECT last_name FROM employees WHERE department_id = &dept AND ROWNUM = 1;
PROMPT ==== X025
SELECT employee_id, salary FROM employees WHERE last_name = &name;
EXIT;
