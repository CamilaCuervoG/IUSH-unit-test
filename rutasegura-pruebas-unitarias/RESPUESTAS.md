# Respuestas del taller — RutaSegura

Integrantes:
- Maria Camila Cuervo Gómez
- Juan Felipe Gaviria Giraldo

## Ejercicio 1 — Diseño de casos (RN-01 a RN-04)

Los resultados esperados se calcularon a mano a partir de la fórmula y los rangos del README, **antes** de correr la función. `calcularMinutosEstimados(velocidadKmh, distanciaRestanteKm, factorTrafico)`.

| Regla | Entradas (velocidad, distancia, factor) | Resultado esperado (a mano) | Tipo |
|---|---|---|---|
| RN-01 | (40, 10, 1.5) | (10/40)×60×1.5 = 22.5 → **23** | Feliz |
| RN-01 | (40, 20, 1.0) | (20/40)×60×1.0 = **30** (exacto, sin decimales) | Límite |
| RN-01 | (60, 10, 1.01) | (10/60)×60×1.01 = 10.1 → **11** (decimal mínimo, prueba el `ceil`) | Límite |
| RN-02 | (40, 0, 1.5) | **0** (ya está en el paradero, distancia manda) | Feliz |
| RN-02 | (0, 0, 1.5) | **0** (distancia=0 debe primar sobre velocidad=0) | Límite |
| RN-02 | (0, 10, 1.5) | **null** (bus detenido, trayecto pendiente) | Límite |
| RN-03 | (-5, 10, 1.5) | **RangeError** (velocidad negativa) | Error |
| RN-03 | (40, -5, 1.5) | **RangeError** (distancia negativa) | Error |
| RN-03 | (0, 10, 1.5) | no lanza error (0 no es negativo) | Límite |
| RN-04 | (40, 10, 1.0) | (10/40)×60×1.0 = **15** (límite inferior incluido) | Límite |
| RN-04 | (40, 10, 3.0) | (10/40)×60×3.0 = **45** (límite superior incluido) | Límite |
| RN-04 | (40, 10, 0.99) | **RangeError** (justo debajo del rango) | Error |
| RN-04 | (40, 10, 3.01) | **RangeError** (justo encima del rango) | Error |

**Resultado real al correr la suite:** de estas 13 combinaciones, **3 fallaron contra el código real** (factor=1.5, factor=1.01 y factor=3.0) porque `src/eta.ts` divide por `factorTrafico` en vez de multiplicar (ver `REPORTE_DEFECTOS.md`, DEF-01).

## Preguntas

1. **Para `calcularMinutosEstimados`, ¿qué valores escogieron para el caso feliz y por qué? ¿Qué demuestra esa prueba y qué no demuestra?**

  Elegimos los valores del ejemplo de RN-01 en el README: velocidad de **40 km/h**, distancia de **10 km** y factor de tráfico **1.5**. Son entradas representativas, y el factor decimal distinto de 1 permite distinguir entre multiplicar y dividir por el tráfico.

  Con la fórmula especificada, el cálculo es `(10 / 40) × 60 × 1.5 = 22.5`, que se redondea hacia arriba a **23 minutos**. La prueba comprueba ese resultado para esta combinación y, por tanto, detecta una implementación que produzca otro valor. No demuestra que la función sea correcta para todas las entradas ni prueba por separado cada regla o cada rango.

  **Resultado observado:** la prueba falla. `src/eta.ts` divide por `factorTrafico` en lugar de multiplicar: `(10 / 40) × 60 / 1.5 = 10`. El factor 1.5 hace visible la diferencia entre las dos operaciones; con un factor de 1.0, ambas producirían el mismo resultado.

2. **Si cambian solo `factorTrafico` a 1.0, ¿cambia el resultado? ¿Qué enseña esto sobre la selección de datos?**

  Para velocidad de 40 km/h y distancia de 10 km:

  - Fórmula especificada: `(10 / 40) × 60 × 1.0 = 15` minutos.
  - Implementación actual, que divide: `(10 / 40) × 60 / 1.0 = 15` minutos.

  La prueba pasaría aunque el defecto siguiera presente: 1.0 es el elemento identidad de la multiplicación y también de la división. Esto muestra que los datos deben ser sensibles a los errores que se quieren detectar. Conviene evitar que el único caso use valores que hagan equivalentes la operación correcta y la incorrecta; aquí, un factor distinto de 1 expone la inversión del operador.

3. **En RN-06 y RN-08, ¿por qué probar los límites (90, -90, 5, 15…) y no solo valores intermedios como 45 o 10? Expliquen los resultados.**

  Los valores intermedios comprueban el comportamiento dentro de un rango, pero no si sus fronteras están incluidas correctamente. Los casos exactos de límite detectan errores como usar `>` en vez de `>=`, o `<=` en vez de `<`. Probar también un valor a cada lado permite confirmar dónde cambia la regla.

  | Prueba | Valor | Qué comprueba | Resultado observado |
  |---|---:|---|---|
  | RN-06, coordenada de Medellín | (6.25, -75.56) | Punto válido intermedio | Pasa |
  | RN-06, latitud límite superior | 90 | El límite está incluido | Falla; retorna `false` |
  | RN-06, latitud límite inferior | -90 | El límite está incluido | Falla; retorna `false` |
  | RN-08, retraso intermedio | 10 | Corresponde a `LEVE` | Pasa |
  | RN-08, frontera de `LEVE` | 15 | 15 todavía corresponde a `LEVE` | Falla; retorna `GRAVE` |

  Los resultados muestran por qué hacen falta ambas clases de casos: Medellín y 10 minutos pasan, pero no detectan los defectos en los extremos de los rangos. En RN-06, ±90 deben ser válidos; en RN-08, 15 todavía pertenece a `LEVE`. Una estrategia sólida prueba el límite exacto y valores inmediatamente inferiores y superiores.

4. **¿Una prueba que pasa demuestra que la función es correcta? Argumenten con ejemplos de la suite.**

  No. Una prueba que pasa confirma el comportamiento para las entradas y las condiciones que esa prueba ejercita; no garantiza la corrección para todos los casos.

  - **RN-06:** `validarCoordenadas_conCoordenadaDeMedellin_debeRetornarTrue` pasa con `(6.25, -75.56)`. Sin las pruebas de frontera, podría parecer que la función es correcta aunque rechaza las latitudes 90 y -90, que la especificación considera válidas.
  - **RN-01:** con factor 1.0, el caso de 40 km/h y 10 km daría 15 tanto al multiplicar como al dividir. Esa prueba pasaría y no revelaría el operador invertido.
  - **RN-08:** el caso de 10 minutos pasa y retorna `LEVE`, pero el caso de 15 falla porque retorna `GRAVE` en vez de `LEVE`.

  Por eso la confianza depende de una selección diversa de casos —particiones, límites, entradas inválidas e interacciones— y de aserciones que contrasten el resultado con la especificación. Una prueba que pasa no prueba la ausencia de defectos.

5. **¿Por qué usaron un mock en lugar del proveedor real de SMS? ¿Qué verifica `toHaveBeenCalledWith` que no verifica el valor de retorno?**

  El mock evita enviar mensajes reales y mantiene las pruebas aisladas, rápidas y repetibles. También permite controlar respuestas que serían difíciles de provocar con el proveedor real, como un rechazo de red (`mockRejectedValueOnce`) o una respuesta `false` (`mockResolvedValueOnce(false)`), escenarios cubiertos por RN-13.

  El valor de retorno indica cuántos envíos fueron exitosos, pero no confirma por sí solo a qué teléfono se envió el mensaje ni cuál fue su contenido. `toHaveBeenCalledWith` comprueba esos argumentos exactos. Por ejemplo, en `tests/notificador.test.ts`:

  ```ts
  expect(mensajeria.enviarSMS).toHaveBeenCalledWith(
    '3001111111',
    'RutaSegura: el bus WPX482 llegará en aproximadamente 7 minutos.'
  );
  ```

  Aunque el resultado fuera `1`, una aserción solo sobre ese conteo no detectaría un teléfono equivocado o un mensaje con la placa o los minutos incorrectos. Además, las pruebas verifican por separado que no se llame al servicio para acudientes inactivos. Así, el valor de retorno valida el conteo y `toHaveBeenCalledWith` valida la interacción con la dependencia; son comprobaciones complementarias.


**6. ¿Qué cobertura obtuvieron? ¿Se puede tener 100% de cobertura y aun así un defecto sin detectar?**

Obtuvimos **100% en statements, branches, functions y lines** en los cuatro archivos de `src/` (ver `evidencias/cobertura.png`). Sí, es completamente posible tener 100% de cobertura y no detectar un defecto: la cobertura solo mide si una línea **se ejecutó** durante las pruebas, no si su resultado **se verificó correctamente**.

Ejemplo concreto de este mismo código: la línea `const minutosConTrafico = minutosSinTrafico / factorTrafico;` (línea 38 de `eta.ts`, el defecto DEF-01) se ejecuta y se cubre al 100% con **cualquier** prueba de RN-01, incluida `calcularMinutosEstimados_conFactorEnLimiteInferior_debeCalcular` (factor=1.0). Esa prueba pasa, cubre la línea, y sin embargo **no revela** que la operación está invertida (división en vez de multiplicación), porque con factor=1.0 el resultado es idéntico para ambas operaciones. La cobertura del 100% no dice nada sobre si el *assert* comparó contra el valor correcto para *ese* input específico — solo dice que la línea se tocó.

**7. Para cada defecto encontrado, la cadena error → defecto → falla:**

Ver el detalle completo en `REPORTE_DEFECTOS.md`. Resumen:

- **DEF-01 (RN-01):** *Error humano* — probable inversión accidental del operador al escribir la fórmula (`/` en vez de `*`), quizás copiando la línea de "minutos sin tráfico" y olvidando cambiar la operación. *Defecto* — línea 38 de `eta.ts`. *Falla* — el acudiente ve un tiempo de llegada distinto del real (más corto cuando hay tráfico), justo el síntoma que reportaron los colegios en el contexto del taller.
- **DEF-02 (RN-06):** *Error humano* — al escribir la validación de latitud se usaron operadores estrictos (`>`/`<`) por descuido, inconsistentes con la validación de longitud (que sí usa `>=`/`<=`) en la misma función. *Defecto* — línea 14 de `validaciones.ts`. *Falla* — una coordenada GPS legítima en el límite exacto (±90°) se marcaría como inválida, pudiendo descartar una lectura real del bus.
- **DEF-03 (RN-08):** *Error humano* — error de "uno de más" (`off-by-one`) al escribir la condición de frontera, usando `>= 15` en vez de `> 15`. *Defecto* — línea 18 de `alertas.ts`. *Falla* — un retraso de exactamente 15 minutos se escala a alerta GRAVE cuando debería ser LEVE, pudiendo activar protocolos de emergencia innecesarios en la coordinación del colegio.
- **DEF-04 (RN-11):** *Error humano* — se omitió el filtro por `notificacionesActivas` al recorrer la lista de acudientes, probablemente por olvido al implementar el bucle. *Defecto* — el `for` en `notificador.ts` no valida la preferencia del acudiente. *Falla* — un acudiente que desactivó explícitamente las notificaciones sigue recibiendo SMS, lo cual viola su preferencia y puede tener implicaciones de costo y de confianza en la app.

**8. ¿Su suite cumple FIRST?**

| Letra | Ejemplo propio | ¿Se cumple? |
|---|---|---|
| **F**ast | Las 62 pruebas corren en ~5 segundos (`npx jest --coverage`) | Sí |
| **I**ndependent | En `notificador.test.ts`, `beforeEach` crea un `mensajeria`/`notificador` nuevos para cada `it`, sin estado compartido entre pruebas | Sí |
| **R**epeatable | En `eta.test.ts` usamos `new Date(2026, 8, 22, 6, 30, 0)` en vez de `new Date()` sin argumentos, así el resultado no depende del momento en que se ejecute | Sí |
| **S**elf-validating | Cada prueba termina en un `expect(...).toBe/toEqual/toThrow(...)` explícito; ninguna requiere inspección manual | Sí |
| **T**imely | Se viola parcialmente por el propio planteamiento del taller: el código de `src/` ya existía antes de escribir las pruebas ("código heredado"), no hubo TDD estricto (prueba antes que código) | No |

**9. Si el equipo corrige todos los defectos mañana, ¿qué valor tiene conservar las pruebas? ¿Qué pasa si en 6 meses alguien reintroduce el error de RN-01?**

Las pruebas dejan de ser "detectoras de defectos actuales" y pasan a ser **red de seguridad contra regresiones**: documentan el comportamiento correcto según la especificación, de forma ejecutable y repetible. Si en seis meses alguien — sin mala intención, por ejemplo al "optimizar" la fórmula — vuelve a invertir el operador de `eta.ts` (de `*` a `/`), la prueba `calcularMinutosEstimados_conDatosNormales_debeCalcularSegunFormula` (que compara contra `23`, un valor fijo tomado del README, no del código) fallaría inmediatamente en el siguiente `npm test` o en el pipeline de CI, mucho antes de que el error llegue a producción y a los acudientes. Sin la prueba, ese mismo error podría pasar inadvertido durante meses, exactamente como ocurrió la primera vez.

**10. Si solo pudieran entregar 3 pruebas de todo el repositorio, ¿cuáles y por qué?**

1. **`calcularMinutosEstimados_conDatosNormales_debeCalcularSegunFormula`** (RN-01) — protege el defecto de mayor impacto: la fórmula central del ETA, que es el problema que originó todo el taller ("la hora de llegada no coincide con la real"). Afecta a *todos* los viajes con tráfico.
2. **`notificarProximidad_conAcudienteConNotificacionesDesactivadas_noDebeEnviarleSMS`** (RN-11) — protege contra el envío de SMS a alguien que explícitamente pidió no recibirlos: es un riesgo de privacidad/confianza y un costo económico innecesario para el colegio, no solo un error de cálculo.
3. **`determinarNivelAlerta_conRetrasoDeQuinceMinutos_debeRetornarLeve`** (RN-08) — protege contra una escalación incorrecta a alerta GRAVE, que podría disparar protocolos de emergencia y alarmar a acudientes y colegio sin necesidad real.

El criterio detrás de las tres: priorizamos el **impacto en personas reales** (acudientes, estudiantes, coordinación) sobre defectos más "cosméticos" como el de las coordenadas GPS en los polos exactos (DEF-02), que es real pero de menor probabilidad de ocurrencia práctica en Colombia.
