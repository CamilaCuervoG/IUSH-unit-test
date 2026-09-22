import { calcularMinutosEstimados, calcularHoraEstimadaLlegada } from '../src/eta';

// TODO: escribir las pruebas de RN-01 a RN-05.
// Recuerden: caso feliz + valores límite + casos de error. Un describe por regla.

describe('RN-01 calcularMinutosEstimados - fórmula', () => {
  it.todo('calcularMinutosEstimados_conDatosNormales_debeCalcularSegunFormula');
});

describe('RN-02 calcularMinutosEstimados - bus detenido / en paradero', () => {
  it.todo('calcularMinutosEstimados_conVelocidadCero_debeRetornarNull');
});

describe('RN-03 calcularMinutosEstimados - datos negativos', () => {
  it.todo('calcularMinutosEstimados_conDistanciaNegativa_debeLanzarRangeError');
});

describe('RN-04 calcularMinutosEstimados - rango del factor de tráfico', () => {
  it.todo('calcularMinutosEstimados_conFactorEnLimiteSuperior_debeCalcular');
});

describe('RN-05 calcularHoraEstimadaLlegada', () => {
  it.todo('calcularHoraEstimadaLlegada_conDatosNormales_debeSumarMinutosAHoraActual');
});
