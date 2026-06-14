import fastify from 'fastify';
import { makeVoiceController } from '../factories/voice-factory';

const app = fastify({ logger: true });

app.post('/voice-interaction', async (request, reply) => {
  const controller = makeVoiceController();
  return await controller.handle(request, reply);
});

export { app };
