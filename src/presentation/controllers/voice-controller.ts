/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { FastifyRequest, FastifyReply } from 'fastify'
import '@fastify/multipart'
import { IProcessVoiceInteraction } from '../../domain/use-cases/process-voice-interaction'

export class VoiceController {
  constructor (private readonly processVoiceInteraction: IProcessVoiceInteraction) {}

  async handle (request: FastifyRequest, reply: FastifyReply): Promise<FastifyReply> {
    try {
      const contentType = request.headers['content-type'] ?? ''
      console.log('[VoiceController] --- New Request ---')
      console.log(`[VoiceController] Content-Type: ${contentType}`)

      const isMultipart = typeof request.isMultipart === 'function' ? request.isMultipart() : (request as any).isMultipart === true
      console.log(`[VoiceController] isMultipart: ${String(isMultipart)}`)

      let audioBuffer: Buffer
      let mimeType: string
      let filename = 'audio-upload'

      // Check if it's multipart
      if (isMultipart || contentType.includes('multipart/form-data')) {
        console.log('[VoiceController] Handling as Multipart...')

        const data = await request.file()

        if (data == null) {
          console.log('[VoiceController] request.file() returned null. Possible causes: wrong field name, missing boundary, or parser issue.')
          console.log('[VoiceController] Headers:', JSON.stringify(request.headers, null, 2))
          return await reply.status(400).send({
            error: 'No file found. Ensure you are sending a form-data request with the audio file in the "audio" field.'
          })
        }

        console.log(`[VoiceController] File found! Field: ${data.fieldname}, Filename: ${data.filename}, MimeType: ${data.mimetype}`)

        if (data.fieldname !== 'audio') {
          console.warn(`[VoiceController] Warning: Received field "${data.fieldname}" but was expecting "audio"`)
        }

        audioBuffer = await data.toBuffer()
        mimeType = data.mimetype
        filename = data.filename
      } else {
        // Fallback to JSON base64
        console.log('[VoiceController] Handling as JSON...')
        const body = request.body as Record<string, any>

        if (typeof body?.audio === 'string') {
          console.log('[VoiceController] Found audio string in JSON body')
          audioBuffer = Buffer.from(body.audio, 'base64')
          mimeType = typeof body.mimeType === 'string' ? body.mimeType : 'audio/mpeg'
        } else {
          console.log('[VoiceController] JSON body missing "audio" field or not a string.')
          return await reply.status(400).send({
            error: 'Invalid request. Send a multipart/form-data with an audio file (field "audio") or a JSON with "audio" (base64 string).'
          })
        }
      }

      // Explicit conversion to base64 for logging
      const audioBase64 = audioBuffer.toString('base64')
      console.log(`[VoiceController] Processing audio: ${filename}, mimeType: ${mimeType}, length: ${audioBase64.length}`)

      const response = await this.processVoiceInteraction.execute({
        audio: audioBuffer,
        mimeType
      })

      const outputFormat = mimeType.includes('ogg') ? 'ogg' : 'mp3'

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
