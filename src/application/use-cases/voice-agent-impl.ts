import { IProcessVoiceInteraction } from '../../domain/use-cases/process-voice-interaction';
import { VoiceMessage, VoiceResponse } from '../../domain/entities/voice-message';
import { IVoiceService } from '../../domain/services/voice-service';
import { ISTTService } from '../../domain/services/stt-service';
import { ILLMService } from '../../domain/services/llm-service';

export class VoiceAgent implements IProcessVoiceInteraction {
  constructor(
    private readonly sttService: ISTTService,
    private readonly llmService: ILLMService,
    private readonly voiceService: IVoiceService
  ) {}

  async execute(message: VoiceMessage): Promise<VoiceResponse> {
    // 1. Transcribe voice to text
    const transcribedText = await this.sttService.transcribe(message);
    console.log(`[VoiceAgent] Transcribed: ${transcribedText}`);

    // 2. Get LLM response
    const llmResponseText = await this.llmService.chat(transcribedText);
    console.log(`[VoiceAgent] LLM Response: ${llmResponseText}`);

    // 3. Convert LLM response back to speech (TTS)
    const voiceResponse = await this.voiceService.generateSpeech(llmResponseText);

    return {
      ...voiceResponse,
      text: llmResponseText, // Including the text response as well
    };
  }
}
