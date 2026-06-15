import fastify from 'fastify'
import multipart from '@fastify/multipart'
import { makeVoiceController } from '../factories/voice-factory'

const app = fastify({ logger: true })

app.register(multipart)

app.post('/voice-interaction', async (request, reply) => {
  const controller = makeVoiceController()
  return await controller.handle(request, reply)
})

export { app }
