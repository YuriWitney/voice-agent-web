import { IProcessVoiceInteraction } from '../../interfaces/application/IProcess-Voice-Interaction'
import { VoiceMessage, VoiceResponse } from '../../interfaces/application/IVoiceMessage'
import { IVoiceService } from '../../interfaces/services/voice-service'

export class ProcessVoiceInteraction implements IProcessVoiceInteraction {
  constructor (private readonly voiceService: IVoiceService) {}

  async execute (message: VoiceMessage): Promise<VoiceResponse> {
    // Here you could add logic like logging, validation,
    // or coordinating between multiple services (e.g. LLM then TTS)
    // For now, we delegate to the voice service (ElevenLabs Speech-to-Speech)
    return await this.voiceService.processSpeechToSpeech(message)
  }
}
