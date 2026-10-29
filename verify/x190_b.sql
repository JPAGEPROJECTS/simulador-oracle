-- X190 (sesion B): mientras A sigue abierta, cuenta las filas (esperado 0)
SET FEEDBACK OFF
SELECT 'B ve ' || COUNT(*) FROM gtt_cart;
EXIT;
