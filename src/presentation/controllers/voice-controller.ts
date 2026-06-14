import { FastifyRequest, FastifyReply } from 'fastify';
import { IProcessVoiceInteraction } from '../../domain/use-cases/process-voice-interaction';

export class VoiceController {
  constructor(private readonly processVoiceInteraction: IProcessVoiceInteraction) {}

  async handle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { audio, mimeType } = request.body as any;

      if (!audio) {
        return reply.status(400).send({ error: 'Audio is required' });
      }

      const response = await this.processVoiceInteraction.execute({
        audio: Buffer.from(audio, 'base64'),
        mimeType: mimeType || 'audio/mpeg',
      });

      return reply.status(200).send({
        audio: response.audio.toString('base64'),
        text: response.text,
      });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  }
}
