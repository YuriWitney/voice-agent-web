import { ElevenLabsClient } from 'elevenlabs';
import { IVoiceService } from '../../../domain/services/voice-service';
import { VoiceMessage, VoiceResponse } from '../../../domain/entities/voice-message';
import * as fs from 'fs';
import { Readable } from 'stream';

export class ElevenLabsVoiceService implements IVoiceService {
  private readonly client: ElevenLabsClient;

  constructor(apiKey: string) {
    this.client = new ElevenLabsClient({ apiKey });
  }

  async processSpeechToSpeech(message: VoiceMessage): Promise<VoiceResponse> {
    // ElevenLabs SDK expects a Readable stream or Buffer for speech-to-speech
    const audioStream = Readable.from(message.audio);
    
    // Using a default voice ID, this should be configurable
    const voiceId = 'pMs7msYpA7CfSthw3Z43'; 

    const response = await this.client.speechToSpeech.convert(voiceId, {
      audio: audioStream,
      model_id: 'eleven_english_sts_v2', // or appropriate model
    });

    // The response is usually a stream, we need to convert it to a Buffer
    const chunks: any[] = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }
    
    return {
      audio: Buffer.concat(chunks),
    };
  }

  async generateSpeech(text: string): Promise<VoiceResponse> {
    const voiceId = 'pMs7msYpA7CfSthw3Z43';
    
    const response = await this.client.generate({
      voice: voiceId,
      text,
      model_id: 'eleven_multilingual_v2',
    });

    const chunks: any[] = [];
    for await (const chunk of response) {
      chunks.push(chunk);
    }

    return {
      audio: Buffer.concat(chunks),
      text,
    };
  }
}
