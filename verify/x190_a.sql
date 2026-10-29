-- X190 (sesion A): crea GTT PRESERVE ROWS, inserta 3 filas, COMMIT y deja la sesion abierta
SET FEEDBACK OFF
CREATE GLOBAL TEMPORARY TABLE gtt_cart (item NUMBER) ON COMMIT PRESERVE ROWS;
INSERT INTO gtt_cart VALUES (1);
INSERT INTO gtt_cart VALUES (2);
INSERT INTO gtt_cart VALUES (3);
COMMIT;
SELECT 'A ve ' || COUNT(*) FROM gtt_cart;
