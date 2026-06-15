import { VoiceMessage, VoiceResponse } from '../entities/voice-message'

export interface IVoiceService {
  processSpeechToSpeech: (message: VoiceMessage) => Promise<VoiceResponse>
  generateSpeech: (text: string) => Promise<VoiceResponse>
}
