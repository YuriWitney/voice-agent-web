import Groq, { toFile } from 'groq-sdk'
import { ISTTService } from '../../../domain/services/stt-service'
import { VoiceMessage } from '../../../domain/entities/voice-message'

export class GroqSTTService implements ISTTService {
  private readonly client: Groq

  constructor (apiKey: string) {
    this.client = new Groq({ apiKey })
  }

  async transcribe (message: VoiceMessage): Promise<string> {
    // Groq expects a File-like object with a filename and mimetype
    // We use the 'toFile' helper from the SDK to convert the Buffer
    const extension = message.mimeType.split('/')[1] ?? 'mp3'
    const filename = `audio.${extension === 'ogg' || extension === 'opus' ? 'ogg' : 'mp3'}`

    const file = await toFile(message.audio, filename, { type: message.mimeType })

    const response = await this.client.audio.transcriptions.create({
      file,
      model: 'whisper-large-v3-turbo',
      language: 'pt'
    })

    return response.text
  }
}
