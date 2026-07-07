import { VoiceMessage, VoiceResponse } from '../application/IVoiceMessage'

export interface IVoiceService {
  processSpeechToSpeech: (message: VoiceMessage) => Promise<VoiceResponse>
  generateSpeech: (text: string, format?: 'mp3' | 'ogg') => Promise<VoiceResponse>
}
