# Voice Agent Web Backend

Este é o backend de um agente de IA speech-to-speech seguindo os princípios de **Clean Architecture** e **Clean Code**.

## Estrutura do Projeto

- `src/domain`: Contém as regras de negócio core.
  - `entities`: Objetos de domínio (ex: VoiceMessage).
  - `use-cases`: Definições das interfaces dos casos de uso.
  - `services`: Definições de interfaces para serviços externos (ElevenLabs).
- `src/application`: Implementações dos casos de uso.
  - `use-cases`: Lógica de orquestração dos serviços.
- `src/infrastructure`: Detalhes de implementação e frameworks.
  - `external-services`: Integrações com APIs de terceiros (ElevenLabs SDK).
- `src/presentation`: Adaptadores para entrada de dados.
  - `controllers`: Lógica de controle das rotas HTTP/WS.
- `src/main`: Composição da aplicação.
  - `config`: Configurações do servidor e frameworks.
  - `factories`: Injeção de dependência e instanciamento das classes.

## Tecnologias

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fastify](https://www.fastify.io/)
- [ElevenLabs SDK](https://github.com/elevenlabs/elevenlabs-js) (Voz)
- [Groq SDK](https://github.com/groq-ic/groq-typescript) (STT e LLM - Alta Performance)
- [Zod](https://zod.dev/)

## Fluxo do Agente

1. **STT (Speech-to-Text)**: O áudio recebido é transcrito em milissegundos usando o Whisper da Groq.
2. **LLM (Large Language Model)**: O texto transcrito é processado por modelos como Llama 3 via Groq para latência ultra-baixa.
3. **TTS (Text-to-Speech)**: A resposta é convertida em áudio de alta qualidade via ElevenLabs.
4. **Resposta**: O sistema retorna o áudio final e o texto da resposta.

## Como rodar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Copie o `.env.example` para `.env` e preencha suas API Keys da ElevenLabs e Groq.
4. Rode em modo de desenvolvimento: `npm run dev`

## API Endpoints

- `POST /voice-interaction`: Processa uma interação de voz e retorna a resposta do agente.
  - **Opção 1 (Multipart)**: Envie um `multipart/form-data` com um arquivo de áudio no campo `audio`.
  - **Opção 2 (JSON)**: Envie um `application/json` com o áudio em base64:
    ```json
    {
      "audio": "base64_string...",
      "mimeType": "audio/mpeg"
    }
    ```
  - **Resposta**: Retorna um JSON contendo o áudio da resposta em base64, o texto transcrito/gerado e informações de formato.
