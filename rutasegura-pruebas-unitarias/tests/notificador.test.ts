import { NotificadorAcudientes, ServicioMensajeria, Acudiente } from '../src/notificador';

describe('NotificadorAcudientes.notificarProximidad', () => {
  let mensajeria: jest.Mocked<ServicioMensajeria>;
  let notificador: NotificadorAcudientes;

  beforeEach(() => {
    mensajeria = { enviarSMS: jest.fn().mockResolvedValue(true) };
    notificador = new NotificadorAcudientes(mensajeria);
  });

  const acudienteActivo = (nombre: string, telefono: string): Acudiente => ({
    nombre,
    telefono,
    notificacionesActivas: true,
  });

  const acudienteInactivo = (nombre: string, telefono: string): Acudiente => ({
    nombre,
    telefono,
    notificacionesActivas: false,
  });

  describe('RN-10 notificarProximidad - umbral de minutos', () => {
    it('notificarProximidad_conBusAMasDeDiezMinutos_noDebeEnviarSMS', async () => {
      const acudientes = [acudienteActivo('Ana', '3001111111')];

      const resultado = await notificador.notificarProximidad('WPX482', 11, acudientes);

      expect(resultado).toBe(0);
      expect(mensajeria.enviarSMS).not.toHaveBeenCalled();
    });

    it('notificarProximidad_conMinutosNull_noDebeEnviarSMS', async () => {
      const acudientes = [acudienteActivo('Ana', '3001111111')];

      const resultado = await notificador.notificarProximidad('WPX482', null, acudientes);

      expect(resultado).toBe(0);
      expect(mensajeria.enviarSMS).not.toHaveBeenCalled();
    });

    it('notificarProximidad_conExactamenteDiezMinutos_debeEnviarSMS', async () => {
      // Límite: 10 incluido según RN-10 ("menor o igual a 10")
      const acudientes = [acudienteActivo('Ana', '3001111111')];

      const resultado = await notificador.notificarProximidad('WPX482', 10, acudientes);

      expect(resultado).toBe(1);
    });
  });

  describe('RN-11 notificarProximidad - preferencias del acudiente', () => {
    it('notificarProximidad_conAcudienteConNotificacionesDesactivadas_noDebeEnviarleSMS', async () => {
      const acudientes = [acudienteInactivo('Beto', '3002222222')];

      const resultado = await notificador.notificarProximidad('WPX482', 5, acudientes);

      expect(resultado).toBe(0);
      expect(mensajeria.enviarSMS).not.toHaveBeenCalled();
    });

    it('notificarProximidad_conMezclaDeAcudientes_soloDebeEnviarleAlosActivos', async () => {
      const acudientes = [
        acudienteActivo('Ana', '3001111111'),
        acudienteInactivo('Beto', '3002222222'),
      ];

      const resultado = await notificador.notificarProximidad('WPX482', 5, acudientes);

      expect(resultado).toBe(1);
      expect(mensajeria.enviarSMS).toHaveBeenCalledTimes(1);
      expect(mensajeria.enviarSMS).toHaveBeenCalledWith('3001111111', expect.any(String));
    });
  });

  describe('RN-12 notificarProximidad - contenido del mensaje', () => {
    it('notificarProximidad_debeEnviarMensajeConPlacaYMinutos', async () => {
      const acudientes = [acudienteActivo('Ana', '3001111111')];

      await notificador.notificarProximidad('WPX482', 7, acudientes);

      expect(mensajeria.enviarSMS).toHaveBeenCalledWith(
        '3001111111',
        'RutaSegura: el bus WPX482 llegará en aproximadamente 7 minutos.'
      );
    });
  });

  describe('RN-13 notificarProximidad - tolerancia a fallos', () => {
    it('notificarProximidad_conUnEnvioFallido_debeContinuarYContarSoloExitosos', async () => {
      const acudientes = [
        acudienteActivo('Ana', '3001111111'),
        acudienteActivo('Beto', '3002222222'),
      ];
      mensajeria.enviarSMS
        .mockRejectedValueOnce(new Error('Sin señal'))
        .mockResolvedValueOnce(true);

      const resultado = await notificador.notificarProximidad('WPX482', 5, acudientes);

      expect(resultado).toBe(1);
      expect(mensajeria.enviarSMS).toHaveBeenCalledTimes(2);
    });

    it('notificarProximidad_conServicioRetornandoFalse_noDebeContarloComoExitoso', async () => {
      const acudientes = [acudienteActivo('Ana', '3001111111')];
      mensajeria.enviarSMS.mockResolvedValueOnce(false);

      const resultado = await notificador.notificarProximidad('WPX482', 5, acudientes);

      expect(resultado).toBe(0);
    });
  });
});
