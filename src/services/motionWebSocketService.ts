import * as SecureStore from 'expo-secure-store';
import { ApiError } from '../errors/ApiError';
import { ENV } from '@/src/config/env';

const wsUrl = ENV.apiUrl
  .replace('http://', 'ws://')
  .replace('https://', 'wss://')
  .replace(/\/$/, '');

type MessageHandler = (intensity: number) => void;

class MotionWebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const token = await SecureStore.getItemAsync('userToken');
    if (!token) throw new ApiError(401, 'AUTH_ERROR', 'Token manquant.');

    this.ws = new WebSocket(`${wsUrl}/ws/motion?jwt=${token}`);

    this.ws.onopen = () => console.log('WS connected');

    this.ws.onmessage = async (event) => {

      const blob: Blob = event.data;
      const arrayBuffer = await blob.arrayBuffer();

      const view = new DataView(arrayBuffer);
      const value = view.getFloat32(0, true);

      this.handlers.forEach(handler => handler(value));
    };

    this.ws.onerror = (error) => console.error('WS error', error);
    this.ws.onclose = () => console.log('WS disconnected');
  }

  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}

export const motionWebSocketService = new MotionWebSocketService();