import { VoiceMessage, VoiceResponse } from './IVoiceTypes'

export interface IProcessVoiceInteraction {
  execute: (message: VoiceMessage) => Promise<VoiceResponse>
}
