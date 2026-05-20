import { storage } from "@/src/utils/storage";
import { ApiError } from '../errors/ApiError';
import { ENV } from '@/src/config/env';

const wsUrl = ENV.apiUrl
  .replace('http://', 'ws://')
  .replace('https://', 'wss://')
  .replace(/\/$/, '');

type MessageHandler = (intensities: number[]) => void;

class MotionWebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private pendingPoints: number[] = [];
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private pointCount = 0;

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const token = await storage.get('userToken');
    if (!token) throw new ApiError(401, 'AUTH_ERROR', 'Token manquant.');

    this.ws = new WebSocket(`${wsUrl}/ws/motion?jwt=${token}`);

    this.flushTimer = setInterval(() => {
      if (this.pendingPoints.length === 0) return;
      const points = [...this.pendingPoints];
      this.pendingPoints = [];
      this.handlers.forEach(handler => handler(points));
    }, 500);

    this.ws.onmessage = (event) => {
      const arrayBuffer = event.data as ArrayBuffer;
      const view = new DataView(arrayBuffer);
      const value = view.getFloat32(0, true);
      this.pendingPoints.push(value);
    };
  }

  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }

  clearHandlers(): void {
    this.handlers.clear();
  }
}

export const motionWebSocketService = new MotionWebSocketService();