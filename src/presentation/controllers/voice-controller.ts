/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { FastifyRequest, FastifyReply } from 'fastify'
import '@fastify/multipart'
import { IProcessVoiceInteraction } from '../../domain/use-cases/process-voice-interaction'
import { logger } from '../../infrastructure/logger/logger'

export class VoiceController {
  constructor (private readonly processVoiceInteraction: IProcessVoiceInteraction) {}

  async handle (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const contentType = request.headers['content-type'] ?? ''
      logger.info('[VoiceController] --- New Request ---')
      logger.info(`[VoiceController] Content-Type: ${contentType}`)

      const isMultipart = typeof request.isMultipart === 'function' ? request.isMultipart() : (request as any).isMultipart === true
      logger.info(`[VoiceController] isMultipart: ${String(isMultipart)}`)

      let audioBuffer: Buffer
      let mimeType: string
      let filename = 'audio-upload'

      // Check if it's multipart
      if (isMultipart || contentType.includes('multipart/form-data')) {
        logger.info('[VoiceController] Handling as Multipart...')

        const data = await request.file()

        if (data == null) {
          logger.info('[VoiceController] request.file() returned null. Possible causes: wrong field name, missing boundary, or parser issue.')
          logger.info({ headers: request.headers }, '[VoiceController] Headers')
          return await reply.status(400).send({
            error: 'No file found. Ensure you are sending a form-data request with the audio file in the "audio" field.'
          })
        }

        logger.info(`[VoiceController] File found! Field: ${data.fieldname}, Filename: ${data.filename}, MimeType: ${data.mimetype}`)

        if (data.fieldname !== 'audio') {
          logger.warn(`[VoiceController] Warning: Received field "${data.fieldname}" but was expecting "audio"`)
        }

        audioBuffer = await data.toBuffer()
        mimeType = data.mimetype
        filename = data.filename
      } else {
        // Fallback to JSON base64
        logger.info('[VoiceController] Handling as JSON...')
        const body = request.body as Record<string, any>

        if (typeof body?.audio === 'string') {
          logger.info('[VoiceController] Found audio string in JSON body')
          audioBuffer = Buffer.from(body.audio, 'base64')
          mimeType = typeof body.mimeType === 'string' ? body.mimeType : 'audio/mpeg'
        } else {
          logger.info('[VoiceController] JSON body missing "audio" field or not a string.')
          return await reply.status(400).send({
            error: 'Invalid request. Send a multipart/form-data with an audio file (field "audio") or a JSON with "audio" (base64 string).'
          })
        }
      }

      // Explicit conversion to base64 for logging
      const audioBase64 = audioBuffer.toString('base64')
      logger.info(`[VoiceController] Processing audio: ${filename}, mimeType: ${mimeType}, length: ${audioBase64.length}`)

      const response = await this.processVoiceInteraction.execute({
        audio: audioBuffer,
        mimeType
      })

      const outputFormat = mimeType.includes('ogg') ? 'ogg' : 'mp3'

      logger.info(`[VoiceController] Sending response in ${outputFormat} format`)

      return await reply.status(200).send({
        audio: response.audio.toString('base64'),
        text: response.text,
        format: outputFormat,
        contentType
      })
    } catch (error: any) {
      logger.error(error, '[VoiceController] Error')
      return await reply.status(500).send({ error: error.message })
    }
  }
}
