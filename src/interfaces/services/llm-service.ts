export interface ILLMService {
  chat: (text: string) => Promise<string>
}
