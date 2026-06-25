/* eslint-disable @typescript-eslint/no-floating-promises */
import fastify from 'fastify'
import multipart from '@fastify/multipart'
import { makeVoiceController } from '../factories/voice-factory'
import { logger } from '../../infrastructure/logger/logger'

const app = fastify({ loggerInstance: logger })

app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
})

app.post('/voice-interaction', async (request, reply) => {
  const controller = makeVoiceController()
  return await controller.handle(request, reply)
})

export { app }
