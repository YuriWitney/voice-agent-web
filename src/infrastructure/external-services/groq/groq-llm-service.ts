import Groq from 'groq-sdk'
import { ILLMService } from '../../../domain/services/llm-service'

export class GroqLLMService implements ILLMService {
  private readonly client: Groq

  constructor (apiKey: string) {
    this.client = new Groq({ apiKey })
  }

  async chat (text: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Você é um assistente de voz prestativo. Mantenha suas respostas concisas e conversacionais.' },
        { role: 'user', content: text }
      ]
    })

    return response.choices[0].message.content || ''
  }
}
