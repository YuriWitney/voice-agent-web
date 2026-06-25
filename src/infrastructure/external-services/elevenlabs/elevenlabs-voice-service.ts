import { ElevenLabsClient } from 'elevenlabs'
import { IVoiceService } from '../../../domain/services/voice-service'
import {
  VoiceMessage,
  VoiceResponse
} from '../../../domain/entities/voice-message'
import { Readable } from 'stream'
import { logger } from '../../logger/logger'

export class ElevenLabsVoiceService implements IVoiceService {
  private readonly client: ElevenLabsClient

  constructor (apiKey: string) {
    this.client = new ElevenLabsClient({ apiKey })
  }

  async processSpeechToSpeech (message: VoiceMessage): Promise<VoiceResponse> {
    // ElevenLabs SDK expects a Readable stream or Buffer for speech-to-speech
    const audioStream = Readable.from(message.audio)

    // Using a default voice ID, this should be configurable
    const voiceId = 'pMs7msYpA7CfSthw3Z43'

    const response = await this.client.speechToSpeech.convert(voiceId, {
      audio: audioStream as any,
      model_id: 'eleven_english_sts_v2' // or appropriate model
    })

    // The response is usually a stream, we need to convert it to a Buffer
    const chunks: any[] = []
    for await (const chunk of response) {
      chunks.push(chunk)
    }

    return {
      audio: Buffer.concat(chunks)
    }
  }

  async generateSpeech (text: string, format: 'mp3' | 'ogg' = 'mp3'): Promise<VoiceResponse> {
    const voiceId = '21m00Tcm4TlvDq8ikWAM' // Voz "Rachel" (padrão e estável)
    const modelId = 'eleven_turbo_v2_5' // Modelo mais rápido e compatível

    try {
      const outputFormat = format === 'ogg' ? 'ogg_44100_128' : 'mp3_44100_128'
      logger.info(`[ElevenLabs] Attempting format: ${outputFormat} with model: ${modelId}`)

      const response = await this.client.generate({
        voice: voiceId,
        text,
        model_id: modelId,
        output_format: outputFormat as any
      })

      return await this.processStreamResponse(response, text)
    } catch (error: any) {
      if (error.statusCode === 403 && format === 'ogg') {
        logger.warn('[ElevenLabs] OGG format restricted by plan. Falling back to MP3...')
        const response = await this.client.generate({
          voice: voiceId,
          text,
          model_id: modelId,
          output_format: 'mp3_44100_128'
        })
        return await this.processStreamResponse(response, text)
      }
      logger.error(error, '[ElevenLabs] Error in generateSpeech')
      throw error
    }
  }

  private async processStreamResponse (response: any, text: string): Promise<VoiceResponse> {
    const chunks: any[] = []
    if (Symbol.asyncIterator in Object(response)) {
      for await (const chunk of response) {
        chunks.push(chunk)
      }
    } else {
      chunks.push(response)
    }

    const audioBuffer = Buffer.concat(chunks.map(chunk =>
      Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    ))

    return {
      audio: audioBuffer,
      text
    }
  }
}
