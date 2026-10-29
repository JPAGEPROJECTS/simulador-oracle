-- X009 (parte C, como SIM071): revoca a B y verifica la cascada
SET FEEDBACK ON
COLUMN grantee FORMAT A10
COLUMN grantor FORMAT A10
COLUMN privilege FORMAT A10
PROMPT ==== antes del REVOKE
SELECT grantee, grantor, privilege, grantable FROM user_tab_privs_made WHERE table_name = 'T_PRIV' ORDER BY 1;
REVOKE SELECT ON t_priv FROM sim071b;
PROMPT ==== despues del REVOKE (esperado: sin filas; PUBLIC tambien perdio el privilegio)
SELECT grantee, grantor, privilege, grantable FROM user_tab_privs_made WHERE table_name = 'T_PRIV' ORDER BY 1;
DROP TABLE t_priv PURGE;
EXIT;
