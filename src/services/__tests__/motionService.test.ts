import { motionService } from '../motionService';
import { base64ToFloatArray } from '../../utils/base64';
import { ApiError } from '../../errors/ApiError';
import { privateApiClient } from '../api';
import { MotionDayData, MotionMonthData } from '../../types/motion';

jest.mock('../api');

const mockGet = privateApiClient.get as jest.Mock;

const floatsToBase64 = (values: number[]): string => {
  const floats = new Float32Array(values);
  let binary = '';
  new Uint8Array(floats.buffer).forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const makeRawDayResponse = (overrides: Record<string, any> = {}) => ({
  start: '2026-05-10T00:00:00Z',
  end: '2026-05-11T00:00:00Z',
  coverage: 0.75,
  meanAmplitude: 1.5,
  peakAmplitude: 3.2,
  variance: 0.42,
  graph: {
    start: '2026-05-10T00:00:00Z',
    end: '2026-05-11T00:00:00Z',
    max: 3.2,
    min: 0.1,
    data: floatsToBase64([0.1, 0.2, 0.3]),
  },
  ...overrides,
});

beforeEach(() => jest.clearAllMocks());

describe('base64ToFloatArray', () => {

  it('should convert base64 to float array', () => {
    const base64 = floatsToBase64([1.5, -2.25]);
    const result = base64ToFloatArray(base64);

    expect(result.length).toBe(2);
    expect(result[0]).toBeCloseTo(1.5);
    expect(result[1]).toBeCloseTo(-2.25);
  });
});

describe('motionService.getDayView', () => {

  it('should parse API response correctly', async () => {
    mockGet.mockResolvedValue({ data: makeRawDayResponse() });

    const result = await motionService.getDayView('2026-05-10T00:00:00.000Z');

    expect(result.start).toBe('2026-05-10T00:00:00Z');
    expect(result.end).toBe('2026-05-11T00:00:00Z');
    expect(result.meanAmplitude).toBeCloseTo(1.5);
    expect(result.peakAmplitude).toBeCloseTo(3.2);
    expect(result.variance).toBeCloseTo(0.42);
    expect(result.coverage).toBeCloseTo(0.75);
    expect(result.graph.max).toBeCloseTo(3.2);
    expect(result.graph.min).toBeCloseTo(0.1);
    expect(result.graph.data.length).toBe(3);
    expect(result.graph.data[0]).toBeCloseTo(0.1);
  });

  it('should sanitize "NaN" strings to null', async () => {
    mockGet.mockResolvedValue({
      data: makeRawDayResponse({
        peakAmplitude: 'NaN',
        graph: {
          start: '2026-05-10T00:00:00Z',
          end: '2026-05-11T00:00:00Z',
          max: 'NaN',
          min: 'NaN',
          data: floatsToBase64([1.0]),
        },
      }),
    });

    const result = await motionService.getDayView('2026-05-10T00:00:00.000Z');

    expect(result.peakAmplitude).toBeNull();
    expect(result.graph.max).toBeNull();
    expect(result.graph.min).toBeNull();
  });

  it('should filter NaN floats from graph data', async () => {
    // Float NaN encodé en base64
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    view.setFloat32(0, 1.0, true);
    view.setFloat32(4, NaN, true);
    let binary = '';
    new Uint8Array(buf).forEach(b => (binary += String.fromCharCode(b)));
    const base64WithNaN = btoa(binary);

    mockGet.mockResolvedValue({
      data: makeRawDayResponse({
        graph: { ...makeRawDayResponse().graph, data: base64WithNaN },
      }),
    });

    const result = await motionService.getDayView('2026-05-10T00:00:00.000Z');

    expect(result.graph.data.every(v => !isNaN(v))).toBe(true);
    expect(result.graph.data.length).toBe(1);
  });

  it('should throw ApiError on network failure', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    await expect(motionService.getDayView('2026-05-10T00:00:00.000Z'))
      .rejects.toBeInstanceOf(ApiError);
  });
});

describe('motionService.getTodayView', () => {

  it('should call getDayView with current ISO date', async () => {
    const spy = jest.spyOn(motionService, 'getDayView').mockResolvedValue({
      start: '',
      end: '',
      coverage: null,
      meanAmplitude: null,
      peakAmplitude: null,
      variance: null,
      graph: { start: '', end: '', max: null, min: null, data: [] },
    } as unknown as MotionDayData);

    await motionService.getTodayView();

    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    );

    spy.mockRestore();
  });
});

describe('motionService.getMonthView', () => {

  it('should return month data as-is', async () => {
    const mockMonth: MotionMonthData = {
      start: '2026-05-01T00:00:00Z',
      end: '2026-05-31T00:00:00Z',
      coverage: 0.6,
      meanAmplitude: 1.2,
      days: [
        {
          start: '2026-05-10T00:00:00Z',
          end: '2026-05-11T00:00:00Z',
          coverage: 0.8,
          meanAmplitude: 1.5,
          deltaMeanAmplitude: 0.3,
        },
      ],
    };

    mockGet.mockResolvedValue({ data: mockMonth });

    const result = await motionService.getMonthView('2026-05-01T00:00:00.000Z');

    expect(result.start).toBe('2026-05-01T00:00:00Z');
    expect(result.days.length).toBe(1);
    expect(result.days[0].meanAmplitude).toBe(1.5);
    expect(result.days[0].deltaMeanAmplitude).toBe(0.3);
  });

  it('should handle day with null deltaMeanAmplitude', async () => {
    const mockMonth: MotionMonthData = {
      start: '2026-05-01T00:00:00Z',
      end: '2026-05-31T00:00:00Z',
      coverage: null,
      meanAmplitude: null,
      days: [
        {
          start: '2026-05-10T00:00:00Z',
          end: '2026-05-11T00:00:00Z',
          coverage: null,
          meanAmplitude: null,
          deltaMeanAmplitude: null,
        },
      ],
    };

    mockGet.mockResolvedValue({ data: mockMonth });

    const result = await motionService.getMonthView('2026-05-01T00:00:00.000Z');

    expect(result.days[0].deltaMeanAmplitude).toBeNull();
  });

  it('should throw ApiError on network failure', async () => {
    mockGet.mockRejectedValue(new Error('Network error'));

    await expect(motionService.getMonthView('2026-05-01T00:00:00.000Z'))
      .rejects.toBeInstanceOf(ApiError);
  });
});