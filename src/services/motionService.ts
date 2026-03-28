import { ApiError } from '../errors/ApiError';
import { privateApiClient } from './api';
import { base64ToFloatArray } from '@/src/utils/base64';

export interface MotionDayData {
  date: Date;
  avgIntensity: number;
  avgDuration: number;
  episodeCount: number;
  lastEpisode: Date | null;
  graphData: number[];
  graphStart: Date;
  graphEnd: Date;
  graphMax: number;
  graphMin: number;
}

export interface MotionMonthData {
  year: number;
  month: number;
  episodes: Array<{
    date: string;
    count: number;
  }>;
}

export const motionService = {
  getDayView: async (date: string): Promise<MotionDayData> => {
    try {
      const response = await privateApiClient.get(`/motion/view/day`, { params: { date } });

      const decodedGraphData = base64ToFloatArray(response.data.graph.data);

      return {
        date: new Date(response.data.date),
        avgIntensity: response.data.avgIntensity,
        avgDuration: response.data.avgDurationMs / 1000,
        episodeCount: response.data.nbEpisode,
        lastEpisode: response.data.lastEpisode ? new Date(response.data.lastEpisode) : null,
        graphData: decodedGraphData,
        graphStart: new Date(response.data.graph.start),
        graphEnd: new Date(response.data.graph.end),
        graphMax: isFinite(response.data.graph.max) ? response.data.graph.max : 0,
        graphMin: isFinite(response.data.graph.min) ? response.data.graph.min : 0,
      };
    } catch (error) {
      throw new ApiError(500, 'MOTION_ERROR', 'Erreur lors du chargement des données journalières.');
    }
  },

  getTodayView: async (): Promise<MotionDayData> => {
    const today = new Date().toISOString();
    return motionService.getDayView(today);
  },

  getMonthView: async (year: number, month: number): Promise<MotionMonthData> => {
    try {
      const response = await privateApiClient.get(`/motion/view/month`, { params: { year, month } });
      const data = response.data;
      return {
        year: data.year,
        month: data.month,
        episodes: data.episodes.map((e: any) => ({
          date: e.date,
          count: e.count,
        })),
      };
    } catch (error) {
      throw new ApiError(500, 'MOTION_ERROR', 'Erreur lors du chargement des données mensuelles.');
    }
  },
};