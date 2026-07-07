import { VoiceMessage } from '../application/IVoiceMessage'

export interface ISTTService {
  transcribe: (message: VoiceMessage) => Promise<string>
}
