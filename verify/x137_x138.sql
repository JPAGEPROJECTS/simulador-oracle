-- X137: && + UNDEFINE + & + & => 3 solicitudes.  X138: SET DEFINE OFF.
-- Ejecutar: printf 'last_name\nfirst_name\nemail\n' | sqlplus -S ... @verify/x137_x138.sql
SET FEEDBACK OFF
SET VERIFY OFF
PROMPT ==== X137
SELECT &&col FROM employees WHERE ROWNUM = 1;
UNDEFINE col
SELECT &col FROM employees WHERE ROWNUM = 1;
SELECT &col FROM employees WHERE ROWNUM = 1;
PROMPT ==== X138
SET DEFINE OFF
SELECT 'R&D Department' AS dept FROM dual;
EXIT;
