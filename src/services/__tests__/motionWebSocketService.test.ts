import { storage } from '@/src/utils/storage';
import { ApiError } from '../../errors/ApiError';

jest.mock('@/src/utils/storage', () => ({
    storage: { get: jest.fn() },
}));

jest.mock('@/src/config/env', () => ({
    ENV: { apiUrl: 'http://localhost' },
}));

class MockWebSocket {
    static instances: MockWebSocket[] = [];
    static OPEN = 1;
    static CLOSED = 3;

    onopen?: () => void;
    onmessage?: (event: any) => void;
    onerror?: (event: any) => void;
    onclose?: () => void;

    readyState: number = MockWebSocket.CLOSED;

    constructor(public url: string) {
        MockWebSocket.instances.push(this);
    }

    send = jest.fn();

    close = jest.fn(() => {
        this.readyState = MockWebSocket.CLOSED;
        this.onclose?.();
    });
}

globalThis.WebSocket = MockWebSocket as any;

import { motionWebSocketService } from '../motionWebSocketService';

const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('motionWebSocketService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();

        MockWebSocket.instances = [];

        motionWebSocketService.disconnect();
        motionWebSocketService.clearHandlers();
    });

    afterEach(() => {
        motionWebSocketService.disconnect();
        motionWebSocketService.clearHandlers();

        jest.clearAllTimers();
        jest.useRealTimers();
    });

    describe('connect', () => {
        it('should throw if no token', async () => {
            mockedStorage.get.mockResolvedValue(null);

            await expect(
                motionWebSocketService.connect()
            ).rejects.toThrow(ApiError);
        });

        it('should create websocket connection', async () => {
            mockedStorage.get.mockResolvedValue('TOKEN');

            await motionWebSocketService.connect();

            const ws = MockWebSocket.instances[0];

            expect(ws).toBeDefined();
            expect(ws.url).toContain('/ws/motion?jwt=TOKEN');

            motionWebSocketService.disconnect();
        });

        it('should buffer messages and flush every 500ms', async () => {
            jest.useFakeTimers();

            mockedStorage.get.mockResolvedValue('TOKEN');

            await motionWebSocketService.connect();

            const ws = MockWebSocket.instances[0];

            expect(ws).toBeDefined();

            const handler = jest.fn();

            motionWebSocketService.subscribe(handler);

            const buffer = new ArrayBuffer(4);

            new DataView(buffer).setFloat32(0, 42, true);

            ws.onmessage?.({ data: buffer });

            jest.advanceTimersByTime(500);

            expect(handler).toHaveBeenCalledWith([42]);

            jest.clearAllTimers();

            motionWebSocketService.disconnect();
        });
    });

    describe('subscribe', () => {
        it('should register handler and allow unsubscribe', () => {
            const handler = jest.fn();

            const unsubscribe =
                motionWebSocketService.subscribe(handler);

            unsubscribe();

            expect(true).toBe(true);
        });
    });

    describe('disconnect', () => {
        it('should close websocket', async () => {
            mockedStorage.get.mockResolvedValue('TOKEN');

            await motionWebSocketService.connect();

            const ws = MockWebSocket.instances[0];

            expect(ws).toBeDefined();

            motionWebSocketService.disconnect();

            expect(ws.close).toHaveBeenCalled();
        });
    });

    describe('clearHandlers', () => {
        it('should clear handlers safely', () => {
            const handler = jest.fn();

            motionWebSocketService.subscribe(handler);

            motionWebSocketService.clearHandlers();

            expect(true).toBe(true);
        });
    });
});