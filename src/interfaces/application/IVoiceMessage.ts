export interface VoiceMessage {
  audio: Buffer
  mimeType: string
}

export interface VoiceResponse {
  audio: Buffer
  text?: string
}
