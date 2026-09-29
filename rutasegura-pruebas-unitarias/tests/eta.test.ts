import { calcularMinutosEstimados, calcularHoraEstimadaLlegada } from '../src/eta';

describe('RN-01 calcularMinutosEstimados - fórmula', () => {
  it('calcularMinutosEstimados_conDatosNormales_debeCalcularSegunFormula', () => {
    // Arrange: 10 km a 40 km/h, factor 1.5 -> (10/40)*60*1.5 = 22.5 -> 23
    const velocidad = 40;
    const distancia = 10;
    const factor = 1.5;

    // Act
    const resultado = calcularMinutosEstimados(velocidad, distancia, factor);

    // Assert
    expect(resultado).toBe(23);
  });

  it('calcularMinutosEstimados_conResultadoExacto_noDebeRedondearDeMas', () => {
    // Arrange: 20 km a 40 km/h, factor 1.0 -> 30 min exactos (límite: no debe sumar de más)
    const resultado = calcularMinutosEstimados(40, 20, 1.0);
    expect(resultado).toBe(30);
  });

  it('calcularMinutosEstimados_conDecimalMinimo_debeRedondearHaciaArriba', () => {
    // Arrange: 10 km a 60 km/h, factor 1.01 -> 10.1 -> debe redondear a 11
    const resultado = calcularMinutosEstimados(60, 10, 1.01);
    expect(resultado).toBe(11);
  });
});

describe('RN-02 calcularMinutosEstimados - bus detenido / en paradero', () => {
  it('calcularMinutosEstimados_conDistanciaCero_debeRetornarCero', () => {
    // Arrange: ya está en el paradero, sin importar la velocidad
    const resultado = calcularMinutosEstimados(40, 0, 1.5);
    expect(resultado).toBe(0);
  });

  it('calcularMinutosEstimados_conDistanciaCeroYVelocidadCero_debeRetornarCero', () => {
    // Límite clave: distancia=0 debe primar sobre velocidad=0
    const resultado = calcularMinutosEstimados(0, 0, 1.5);
    expect(resultado).toBe(0);
  });

  it('calcularMinutosEstimados_conVelocidadCero_debeRetornarNull', () => {
    // Arrange: bus detenido con trayecto pendiente -> tiempo indefinido
    const resultado = calcularMinutosEstimados(0, 10, 1.5);
    expect(resultado).toBeNull();
  });
});

describe('RN-03 calcularMinutosEstimados - datos negativos', () => {
  it('calcularMinutosEstimados_conVelocidadNegativa_debeLanzarRangeError', () => {
    expect(() => calcularMinutosEstimados(-5, 10, 1.5)).toThrow(RangeError);
  });

  it('calcularMinutosEstimados_conDistanciaNegativa_debeLanzarRangeError', () => {
    expect(() => calcularMinutosEstimados(40, -5, 1.5)).toThrow(RangeError);
  });

  it('calcularMinutosEstimados_conVelocidadCero_noDebeLanzarRangeError', () => {
    // Límite: 0 no es negativo, no debe entrar por la validación de RN-03
    expect(() => calcularMinutosEstimados(0, 10, 1.5)).not.toThrow();
  });
});

describe('RN-04 calcularMinutosEstimados - rango del factor de tráfico', () => {
  it('calcularMinutosEstimados_conFactorEnLimiteInferior_debeCalcular', () => {
    // Límite: 1.0 incluido -> (10/40)*60*1.0 = 15
    const resultado = calcularMinutosEstimados(40, 10, 1.0);
    expect(resultado).toBe(15);
  });

  it('calcularMinutosEstimados_conFactorEnLimiteSuperior_debeCalcular', () => {
    // Límite: 3.0 incluido -> (10/40)*60*3.0 = 45
    const resultado = calcularMinutosEstimados(40, 10, 3.0);
    expect(resultado).toBe(45);
  });

  it('calcularMinutosEstimados_conFactorDebajoDelLimiteInferior_debeLanzarRangeError', () => {
    expect(() => calcularMinutosEstimados(40, 10, 0.99)).toThrow(RangeError);
  });

  it('calcularMinutosEstimados_conFactorPorEncimaDelLimiteSuperior_debeLanzarRangeError', () => {
    expect(() => calcularMinutosEstimados(40, 10, 3.01)).toThrow(RangeError);
  });
});

describe('RN-05 calcularHoraEstimadaLlegada', () => {
  it('calcularHoraEstimadaLlegada_conDatosNormales_debeSumarMinutosAHoraActual', () => {
    // Arrange: hora fija (FIRST: repetible), 10km/40km/h/1.5 -> 23 min
    const horaActual = new Date(2026, 8, 22, 6, 30, 0);

    // Act
    const resultado = calcularHoraEstimadaLlegada(40, 10, 1.5, horaActual);

    // Assert
    expect(resultado).toEqual(new Date(2026, 8, 22, 6, 53, 0));
  });

  it('calcularHoraEstimadaLlegada_conCruceDeMedianoche_debeAvanzarAlDiaSiguiente', () => {
    // Límite: 23:50 + 23 min cruza a las 00:13 del día siguiente
    const horaActual = new Date(2026, 8, 22, 23, 50, 0);

    const resultado = calcularHoraEstimadaLlegada(40, 10, 1.5, horaActual);

    expect(resultado).toEqual(new Date(2026, 8, 23, 0, 13, 0));
  });

  it('calcularHoraEstimadaLlegada_conBusDetenido_debeRetornarNull', () => {
    const horaActual = new Date(2026, 8, 22, 6, 30, 0);
    const resultado = calcularHoraEstimadaLlegada(0, 10, 1.5, horaActual);
    expect(resultado).toBeNull();
  });

  it('calcularHoraEstimadaLlegada_noDebeModificarHoraActualOriginal', () => {
    // Verifica el efecto secundario: el objeto original no debe alterarse
    const horaActual = new Date(2026, 8, 22, 6, 30, 0);
    const copiaDeReferencia = new Date(horaActual.getTime());

    calcularHoraEstimadaLlegada(40, 10, 1.5, horaActual);

    expect(horaActual).toEqual(copiaDeReferencia);
  });

  it('calcularHoraEstimadaLlegada_conFactorFueraDeRango_debePropagarRangeError', () => {
    // Propagación de RN-04 a través de RN-05
    const horaActual = new Date(2026, 8, 22, 6, 30, 0);
    expect(() => calcularHoraEstimadaLlegada(40, 10, 5.0, horaActual)).toThrow(RangeError);
  });

  it('calcularHoraEstimadaLlegada_conDistanciaNegativa_debePropagarRangeError', () => {
    // Propagación de RN-03 a través de RN-05
    const horaActual = new Date(2026, 8, 22, 6, 30, 0);
    expect(() => calcularHoraEstimadaLlegada(40, -5, 1.5, horaActual)).toThrow(RangeError);
  });
});
