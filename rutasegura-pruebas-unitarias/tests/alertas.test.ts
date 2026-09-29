import { determinarNivelAlerta, calcularPorcentajeOcupacion } from '../src/alertas';

describe('RN-08 determinarNivelAlerta', () => {
  // --- Un valor representativo de cada partición de equivalencia ---
  it('determinarNivelAlerta_conRetrasoDeTresMinutos_debeRetornarNinguna', () => {
    expect(determinarNivelAlerta(3)).toBe('NINGUNA');
  });

  it('determinarNivelAlerta_conRetrasoDeDiezMinutos_debeRetornarLeve', () => {
    expect(determinarNivelAlerta(10)).toBe('LEVE');
  });

  it('determinarNivelAlerta_conRetrasoDeVeinteMinutos_debeRetornarGrave', () => {
    expect(determinarNivelAlerta(20)).toBe('GRAVE');
  });

  // --- Valores límite en cada frontera ---
  it('determinarNivelAlerta_conRetrasoDeCeroMinutos_debeRetornarNinguna', () => {
    expect(determinarNivelAlerta(0)).toBe('NINGUNA');
  });

  it('determinarNivelAlerta_conRetrasoDeCincoMinutos_debeRetornarNinguna', () => {
    // Límite: 5 incluido en NINGUNA según el README
    expect(determinarNivelAlerta(5)).toBe('NINGUNA');
  });

  it('determinarNivelAlerta_conRetrasoDeSeisMinutos_debeRetornarLeve', () => {
    // Límite: justo por encima de 5 -> LEVE
    expect(determinarNivelAlerta(6)).toBe('LEVE');
  });

  it('determinarNivelAlerta_conRetrasoDeQuinceMinutos_debeRetornarLeve', () => {
    // Límite: 15 incluido en LEVE según el README ("más de 5 y hasta 15 incluido")
    expect(determinarNivelAlerta(15)).toBe('LEVE');
  });

  it('determinarNivelAlerta_conRetrasoDeDieciseisMinutos_debeRetornarGrave', () => {
    // Límite: justo por encima de 15 -> GRAVE
    expect(determinarNivelAlerta(16)).toBe('GRAVE');
  });

  // --- Caso de error ---
  it('determinarNivelAlerta_conRetrasoNegativo_debeLanzarRangeError', () => {
    expect(() => determinarNivelAlerta(-1)).toThrow(RangeError);
  });
});

describe('RN-09 calcularPorcentajeOcupacion', () => {
  it('calcularPorcentajeOcupacion_conBusMedioLleno_debeRetornar50', () => {
    expect(calcularPorcentajeOcupacion(20, 40)).toBe(50);
  });

  it('calcularPorcentajeOcupacion_conRedondeoAUnDecimal_debeRedondearCorrectamente', () => {
    // 17/30 * 100 = 56.666... -> 56.7
    expect(calcularPorcentajeOcupacion(17, 30)).toBe(56.7);
  });

  it('calcularPorcentajeOcupacion_conBusVacio_debeRetornarCero', () => {
    // Límite: 0 estudiantes es válido (no es negativo)
    expect(calcularPorcentajeOcupacion(0, 40)).toBe(0);
  });

  it('calcularPorcentajeOcupacion_conSobrecupo_debeSuperarCien', () => {
    // La regla permite superar 100% para que la coordinación lo vea
    expect(calcularPorcentajeOcupacion(45, 40)).toBe(112.5);
  });

  it('calcularPorcentajeOcupacion_conCapacidadCero_debeLanzarRangeError', () => {
    expect(() => calcularPorcentajeOcupacion(10, 0)).toThrow(RangeError);
  });

  it('calcularPorcentajeOcupacion_conCapacidadNegativa_debeLanzarRangeError', () => {
    expect(() => calcularPorcentajeOcupacion(10, -5)).toThrow(RangeError);
  });

  it('calcularPorcentajeOcupacion_conEstudiantesNegativos_debeLanzarRangeError', () => {
    expect(() => calcularPorcentajeOcupacion(-1, 40)).toThrow(RangeError);
  });
});
