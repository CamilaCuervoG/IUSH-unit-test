# Reporte de defectos — RutaSegura

Integrantes:
- Maria Camila Cuervo Gómez
- Juan Felipe Gaviria Giraldo

Reportamos aquí cada prueba que falla porque el código no cumple la especificación del README. Los 4 defectos fueron encontrados corriendo `npx jest --coverage` contra el código real de `src/` (sin modificarlo), tal como exige la regla del taller.

---

### DEF-01

| Campo | Detalle |
|---|---|
| Regla incumplida (RN-XX) | RN-01 |
| Función | `calcularMinutosEstimados` (`src/eta.ts`) |
| Prueba que lo detecta (nombre exacto del `it`) | `calcularMinutosEstimados_conDatosNormales_debeCalcularSegunFormula` (también lo detectan `..._conDecimalMinimo_debeRedondearHaciaArriba` y `..._conFactorEnLimiteSuperior_debeCalcular`) |
| Datos de entrada | velocidad=40, distancia=10, factor=1.5 |
| Resultado esperado (según README) | 23 (= ceil((10/40)×60×1.5)) |
| Resultado obtenido | 10 |
| Severidad (Alta / Media / Baja) y por qué | **Alta** — es la función central de la app (el cálculo del ETA), afecta a todos los viajes donde hay tráfico, y produce el síntoma exacto reportado por los colegios en el contexto del taller. |
| Falla que vería el usuario final | El acudiente ve un tiempo de llegada mucho más corto que el real cuando hay tráfico (el factor reduce el tiempo en vez de aumentarlo), lo que puede hacer que confíe en una hora de llegada equivocada. |
| Causa probable en el código (línea / condición) | Línea 38: `const minutosConTrafico = minutosSinTrafico / factorTrafico;` — divide en vez de multiplicar. El README es explícito: "Minutos = (distancia / velocidad) × 60 × factorTrafico". |
| RN-04 y RN-05 heredan de la funcion calcularMinutosEstimados los bugs al calcular con const = minutosConTrafico = minutosSinTrafico / factorTrafico; |
|

### DEF-02

| Campo | Detalle |
|---|---|
| Regla incumplida (RN-XX) | RN-06 |
| Función | `validarCoordenadas` (`src/validaciones.ts`) |
| Prueba que lo detecta (nombre exacto del `it`) | `validarCoordenadas_conLatitudEnLimiteSuperior90_debeRetornarTrue` y `validarCoordenadas_conLatitudEnLimiteInferiorMenos90_debeRetornarTrue` |
| Datos de entrada | (latitud=90, longitud=0) y (latitud=-90, longitud=0) |
| Resultado esperado (según README) | `true` (límites incluidos según el README) |
| Resultado obtenido | `false` |
| Severidad (Alta / Media / Baja) y por qué | **Baja** — geográficamente es un caso extremo (latitud exactamente ±90° = polos), muy poco probable en el contexto de un bus escolar en Colombia, pero sigue siendo un incumplimiento directo y verificable de la especificación. |
| Falla que vería el usuario final | Una lectura GPS válida en ese límite exacto sería rechazada por el sistema como si fuera un dato corrupto. |
| Causa probable en el código (línea / condición) | Línea 14: `const latitudValida = latitud > -90 && latitud < 90;` usa operadores estrictos, inconsistente con la validación de longitud en la línea 15 (`longitud >= -180 && longitud <= 180`), que sí está bien implementada. |

---

### DEF-03

| Campo | Detalle |
|---|---|
| Regla incumplida (RN-XX) | RN-08 |
| Función | `determinarNivelAlerta` (`src/alertas.ts`) |
| Prueba que lo detecta (nombre exacto del `it`) | `determinarNivelAlerta_conRetrasoDeQuinceMinutos_debeRetornarLeve` |
| Datos de entrada | minutosRetraso=15 |
| Resultado esperado (según README) | `'LEVE'` ("más de 5 y hasta 15, incluido") |
| Resultado obtenido | `'GRAVE'` |
| Severidad (Alta / Media / Baja) y por qué | **Media** — es un error de un solo minuto (`off-by-one`), pero puede disparar una escalación de alerta que no corresponde. |
| Falla que vería el usuario final | Un bus con 15 minutos exactos de retraso dispara una alerta GRAVE hacia la coordinación del colegio, cuando la especificación dice que debería ser una alerta LEVE — puede activar protocolos o notificaciones innecesarias. |
| Causa probable en el código (línea / condición) | Línea 18: `if (minutosRetraso >= 15) { return 'GRAVE'; }` — debería ser `> 15`, ya que 15 debe caer en LEVE según el README. |

---

### DEF-04

| Campo | Detalle |
|---|---|
| Regla incumplida (RN-XX) | RN-11 |
| Función | `notificarProximidad` (`src/notificador.ts`) |
| Prueba que lo detecta (nombre exacto del `it`) | `notificarProximidad_conAcudienteConNotificacionesDesactivadas_noDebeEnviarleSMS` y `notificarProximidad_conMezclaDeAcudientes_soloDebeEnviarleAlosActivos` |
| Datos de entrada | Un acudiente con `notificacionesActivas: false` (y, en el segundo caso, mezclado con uno con `notificacionesActivas: true`) |
| Resultado esperado (según README) | 0 envíos para el acudiente inactivo; 1 envío en la mezcla (solo al activo) |
| Resultado obtenido | 1 envío al acudiente inactivo (se le notifica igual); 2 envíos en la mezcla (se notifica a ambos) |
| Severidad (Alta / Media / Baja) y por qué | **Alta** — es una violación directa de la preferencia explícita del usuario, con implicaciones de privacidad/confianza y de costo (SMS enviados de más). |
| Falla que vería el usuario final | Un acudiente que desactivó las notificaciones en la app sigue recibiendo SMS de proximidad del bus, contradiciendo su configuración. |
| Causa probable en el código (línea / condición) | El bucle `for (const acudiente of acudientes)` (líneas 38–47) no filtra por `acudiente.notificacionesActivas`; itera y envía a todos sin excepción. |

---

## Resumen

| Defecto | Regla | Severidad | Suite que revienta |
|---|---|---|---|
| DEF-01 | RN-01 | Alta | `tests/eta.test.ts` |
| DEF-02 | RN-06 | Baja | `tests/validaciones.test.ts` |
| DEF-03 | RN-08 | Media | `tests/alertas.test.ts` |
| DEF-04 | RN-11 | Alta | `tests/notificador.test.ts` |

**Resultado de `npm test`:** 5 suites de prueba, 4 fallidas, 1 exitosa (`ejemplo.test.ts`) — 62 pruebas totales, 52 exitosas, 10 fallidas. **Cobertura:** 100% en statements, branches, functions y lines en los 4 archivos de `src/` (ver `evidencias/cobertura.png`), lo que confirma que la cobertura alta no garantiza ausencia de defectos (ver pregunta 6 de `RESPUESTAS.md`).
