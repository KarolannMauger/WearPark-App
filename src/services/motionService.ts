import { ApiError } from '../errors/ApiError';
import { privateApiClient } from './api';
import { base64ToFloatArray } from '@/src/utils/base64';
import { MotionDayData, MotionMonthData } from '@/src/types/motion';

const sanitize = (value: any): number | null => {
  const n = Number(value);
  return isNaN(n) ? null : n;
};

export const motionService = {

  getDayView: async (date: string): Promise<MotionDayData> => {
    try {
      const response = await privateApiClient.get('/motion/view/day', { params: { date } });
      const raw = response.data;
      return {
        ...raw,
        meanAmplitude: sanitize(raw.meanAmplitude),
        peakAmplitude: sanitize(raw.peakAmplitude),
        variance: sanitize(raw.variance),
        coverage: sanitize(raw.coverage),
        graph: {
          ...raw.graph,
          max: sanitize(raw.graph.max),
          min: sanitize(raw.graph.min),
          data: base64ToFloatArray(raw.graph.data).filter(v => !isNaN(v)),
        },
      };
    } catch (error) {
      throw new ApiError(500, 'MOTION_ERROR', 'Erreur lors du chargement des données journalières.');
    }
  },

  getTodayView: async (): Promise<MotionDayData> => {
    return motionService.getDayView(new Date().toISOString());
  },

  getMonthView: async (date: string): Promise<MotionMonthData> => {
    try {
      const response = await privateApiClient.get('/motion/view/month', { params: { date } });
      return response.data;
    } catch (error) {
      throw new ApiError(500, 'MOTION_ERROR', 'Erreur lors du chargement des données mensuelles.');
    }
  },
};