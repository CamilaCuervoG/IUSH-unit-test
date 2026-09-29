import { esPlacaValida } from '../src/validaciones';

/**
 * PRUEBA DE EJEMPLO — patrón Arrange / Act / Assert (AAA).
 * Úsenla como guía para escribir las demás. Pueden ampliar este archivo con más casos de RN-07.
 */
describe('RN-07 esPlacaValida', () => {
  it('esPlacaValida_conFormatoEstandar_debeRetornarTrue', () => {
    // Arrange: preparar los datos de entrada
    const placa = 'WPX482';

    // Act: ejecutar la unidad bajo prueba
    const resultado = esPlacaValida(placa);

    // Assert: verificar el resultado contra la especificación
    expect(resultado).toBe(true);
  });

  it('esPlacaValida_conGuionOpcional_debeRetornarTrue', () => {
    expect(esPlacaValida('WPX-482')).toBe(true);
  });

  it('esPlacaValida_conMinusculas_debeRetornarTrue', () => {
    expect(esPlacaValida('wpx482')).toBe(true);
  });

  it('esPlacaValida_conEspaciosAlInicioYFinal_debeRetornarTrue', () => {
    expect(esPlacaValida('  WPX482  ')).toBe(true);
  });

  it('esPlacaValida_conMenosDeTresLetras_debeRetornarFalse', () => {
    expect(esPlacaValida('WP482')).toBe(false);
  });

  it('esPlacaValida_conMenosDeTresDigitos_debeRetornarFalse', () => {
    expect(esPlacaValida('WPX48')).toBe(false);
  });

  it('esPlacaValida_conCaracteresInvalidos_debeRetornarFalse', () => {
    expect(esPlacaValida('WP#482')).toBe(false);
  });

  it('esPlacaValida_conCadenaVacia_debeRetornarFalse', () => {
    expect(esPlacaValida('')).toBe(false);
  });
});
