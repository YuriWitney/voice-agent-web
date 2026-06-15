import OpenAI, { toFile } from 'openai'
import { ISTTService } from '../../../domain/services/stt-service'
import { VoiceMessage } from '../../../domain/entities/voice-message'

export class OpenAISTTService implements ISTTService {
  private readonly client: OpenAI

  constructor (apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async transcribe (message: VoiceMessage): Promise<string> {
    // OpenAI whisper expects a file-like object
    const file = await toFile(message.audio, 'audio.mp3', { type: message.mimeType })

    const response = await this.client.audio.transcriptions.create({
      file,
      model: 'whisper-1'
    })

    return response.text
  }
}
