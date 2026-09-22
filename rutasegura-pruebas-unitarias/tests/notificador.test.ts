import { NotificadorAcudientes, ServicioMensajeria, Acudiente } from '../src/notificador';

// TODO: escribir las pruebas de RN-10 a RN-13 usando un MOCK del servicio de mensajería.
// Pista para crear el mock:
//
//   const mensajeria: jest.Mocked<ServicioMensajeria> = {
//     enviarSMS: jest.fn().mockResolvedValue(true),
//   };
//   const notificador = new NotificadorAcudientes(mensajeria);
//
// Matchers útiles: toHaveBeenCalledTimes, toHaveBeenCalledWith, not.toHaveBeenCalled
// Para simular un fallo: mensajeria.enviarSMS.mockRejectedValueOnce(new Error('Sin señal'))

describe('RN-10 notificarProximidad - umbral de minutos', () => {
  it.todo('notificarProximidad_conBusAMasDeDiezMinutos_noDebeEnviarSMS');
});

describe('RN-11 notificarProximidad - preferencias del acudiente', () => {
  it.todo('notificarProximidad_conAcudienteConNotificacionesDesactivadas_noDebeEnviarleSMS');
});

describe('RN-12 notificarProximidad - contenido del mensaje', () => {
  it.todo('notificarProximidad_debeEnviarMensajeConPlacaYMinutos');
});

describe('RN-13 notificarProximidad - tolerancia a fallos', () => {
  it.todo('notificarProximidad_conUnEnvioFallido_debeContinuarYContarSoloExitosos');
});
