import { ElevenLabsVoiceService } from '../../infra/external-services/elevenlabs/elevenlabs-voice-service'
import { GroqSTTService } from '../../infra/external-services/groq/groq-stt-service'
import { GroqLLMService } from '../../infra/external-services/groq/groq-llm-service'
import { VoiceAgent } from '../../application/features/voice-agent-impl'
import { VoiceController } from '../../presentation/controllers/voice-controller'

export const makeVoiceController = (): VoiceController => {
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY ?? ''
  const groqApiKey = process.env.GROQ_API_KEY ?? ''

  const voiceService = new ElevenLabsVoiceService(elevenLabsApiKey)
  const sttService = new GroqSTTService(groqApiKey)
  const llmService = new GroqLLMService(groqApiKey)

  const voiceAgent = new VoiceAgent(sttService, llmService, voiceService)

  return new VoiceController(voiceAgent)
}
