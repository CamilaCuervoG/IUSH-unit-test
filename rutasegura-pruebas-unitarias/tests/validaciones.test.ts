import { validarCoordenadas } from '../src/validaciones';

describe('RN-06 validarCoordenadas', () => {
  it('validarCoordenadas_conCoordenadaDeMedellin_debeRetornarTrue', () => {
    // Arrange: Medellín ~ (6.25, -75.56), un valor "del medio" válido
    const resultado = validarCoordenadas(6.25, -75.56);
    expect(resultado).toBe(true);
  });

  // --- Análisis de valores límite para latitud [-90, 90] ---
  it('validarCoordenadas_conLatitudEnLimiteSuperior90_debeRetornarTrue', () => {
    expect(validarCoordenadas(90, 0)).toBe(true);
  });

  it('validarCoordenadas_conLatitudEnLimiteInferiorMenos90_debeRetornarTrue', () => {
    expect(validarCoordenadas(-90, 0)).toBe(true);
  });

  it('validarCoordenadas_conLatitudJustoPorEncimaDe90_debeRetornarFalse', () => {
    expect(validarCoordenadas(90.0001, 0)).toBe(false);
  });

  it('validarCoordenadas_conLatitudJustoPorDebajoDeMenos90_debeRetornarFalse', () => {
    expect(validarCoordenadas(-90.0001, 0)).toBe(false);
  });

  // --- Análisis de valores límite para longitud [-180, 180] ---
  it('validarCoordenadas_conLongitudEnLimiteSuperior180_debeRetornarTrue', () => {
    expect(validarCoordenadas(0, 180)).toBe(true);
  });

  it('validarCoordenadas_conLongitudEnLimiteInferiorMenos180_debeRetornarTrue', () => {
    expect(validarCoordenadas(0, -180)).toBe(true);
  });

  it('validarCoordenadas_conLongitudJustoPorEncimaDe180_debeRetornarFalse', () => {
    expect(validarCoordenadas(0, 180.0001)).toBe(false);
  });

  it('validarCoordenadas_conLongitudJustoPorDebajoDeMenos180_debeRetornarFalse', () => {
    expect(validarCoordenadas(0, -180.0001)).toBe(false);
  });

  // --- Caso de error: NaN ---
  it('validarCoordenadas_conLatitudNaN_debeRetornarFalse', () => {
    expect(validarCoordenadas(NaN, 0)).toBe(false);
  });

  it('validarCoordenadas_conLongitudNaN_debeRetornarFalse', () => {
    expect(validarCoordenadas(0, NaN)).toBe(false);
  });
});
