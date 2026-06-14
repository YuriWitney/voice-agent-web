import { VoiceMessage, VoiceResponse } from '../entities/voice-message';

export interface IProcessVoiceInteraction {
  execute(message: VoiceMessage): Promise<VoiceResponse>;
}
