import { IProcessVoiceInteraction } from '../../interfaces/application/IProcess-Voice-Interaction'
import { VoiceMessage, VoiceResponse } from '../../interfaces/application/IVoiceMessage'
import { IVoiceService } from '../../interfaces/services/voice-service'
import { ISTTService } from '../../interfaces/services/stt-service'
import { ILLMService } from '../../interfaces/services/llm-service'
import { logger } from '../../infra/logger/logger'

export class VoiceAgent implements IProcessVoiceInteraction {
  constructor (
    private readonly sttService: ISTTService,
    private readonly llmService: ILLMService,
    private readonly voiceService: IVoiceService
  ) {}

  async execute (message: VoiceMessage): Promise<VoiceResponse> {
    // 1. Transcribe voice to text
    const transcribedText = await this.sttService.transcribe(message)
    logger.info(`[VoiceAgent] Transcribed: ${transcribedText}`)

    // 2. Get LLM response
    const llmResponseText = await this.llmService.chat(transcribedText)
    logger.info(`[VoiceAgent] LLM Response: ${llmResponseText}`)

    // 3. Convert LLM response back to speech (TTS)
    const format = message.mimeType.includes('ogg') ? 'ogg' : 'mp3'
    const voiceResponse = await this.voiceService.generateSpeech(llmResponseText, format)

    return {
      ...voiceResponse,
      text: llmResponseText // Including the text response as well
    }
  }
}
