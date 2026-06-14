import { VoiceMessage } from '../entities/voice-message';

export interface ISTTService {
  transcribe(message: VoiceMessage): Promise<string>;
}
