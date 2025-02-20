import { Config } from '@cmmv/core';

import { AbstractChat } from './chat.abstract';

export class Chat {
  static async loadLLM(): Promise<AbstractChat> {
    const provider = Config.get<string>('ai.llm.provider', 'faiss');

    switch (provider) {
      case 'google':
        const { GoogleChat } = await import('./google.chat');
        const googleChat = new GoogleChat();
        await googleChat.initialize();
        return googleChat;
      default:
        return null;
    }
  }
}
