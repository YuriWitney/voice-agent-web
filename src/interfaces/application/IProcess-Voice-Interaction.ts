import { VoiceMessage, VoiceResponse } from './IVoiceMessage'

export interface IProcessVoiceInteraction {
  execute: (message: VoiceMessage) => Promise<VoiceResponse>
}
