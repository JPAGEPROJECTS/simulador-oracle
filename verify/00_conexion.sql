SET HEADING ON
SELECT USER, SYS_CONTEXT('USERENV','CON_NAME') con, (SELECT version FROM product_component_version WHERE ROWNUM=1) ver FROM dual;
SELECT privilege FROM session_privs ORDER BY 1;
SELECT table_name FROM user_tables;
EXIT;
