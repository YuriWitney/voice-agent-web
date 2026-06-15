import OpenAI from 'openai'
import { ILLMService } from '../../../domain/services/llm-service'

export class OpenAILLMService implements ILLMService {
  private readonly client: OpenAI

  constructor (apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async chat (text: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful voice assistant. Keep your answers concise and conversational.' },
        { role: 'user', content: text }
      ]
    })

    return response.choices[0].message.content || ''
  }
}
