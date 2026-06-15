import { FastifyRequest, FastifyReply } from 'fastify'
import { IProcessVoiceInteraction } from '../../domain/use-cases/process-voice-interaction'

export class VoiceController {
  constructor (private readonly processVoiceInteraction: IProcessVoiceInteraction) {}

  async handle (request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await request.file()

      if (!data) {
        return await reply.status(400).send({ error: 'Audio file is required' })
      }

      const audioBuffer = await data.toBuffer()
      
      // Explicit conversion to base64 as requested, though we'll use the buffer internally
      const audioBase64 = audioBuffer.toString('base64')
      console.log(`[VoiceController] Received file: ${data.filename}, converted to base64 (length: ${audioBase64.length})`)

      const response = await this.processVoiceInteraction.execute({
        audio: audioBuffer,
        mimeType: data.mimetype
      })

      const outputFormat = data.mimetype.includes('ogg') ? 'ogg' : 'mp3'
      const contentType = outputFormat === 'ogg' ? 'audio/ogg' : 'audio/mpeg'

      console.log(`[VoiceController] Sending response in ${outputFormat} format`)

      return await reply.status(200).send({
        audio: response.audio.toString('base64'),
        text: response.text,
        format: outputFormat,
        contentType
      })
    } catch (error: any) {
      console.error('[VoiceController] Error:', error)
      return await reply.status(500).send({ error: error.message })
    }
  }
}
