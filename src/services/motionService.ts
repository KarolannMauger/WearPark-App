import { ApiError } from '../errors/ApiError';
import { privateApiClient } from './api';

export interface DayViewResponse {
  date: string;
  avgIntensity: number;
  avgDurationMs: number;
  nbEpisode: number;
  lastEpisode: string;
  graph: {
    start: string;
    end: string;
    max: number;
    min: number;
    data: number[];
  };
}

export interface MonthViewResponse {
  year: number;
  month: number;
  days: Array<{
    date: string;
    nbEpisode: number;
  }>;
}

// ========== app types ==========

export interface MotionDayData {
  date: Date;
  avgIntensity: number;
  avgDuration: number; // en secondes
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

// ========== SERVICE ==========

export const motionService = {
  getDayView: async (date: string): Promise<MotionDayData> => {
    try {
      const response = await privateApiClient.get<DayViewResponse>(
        `/motion/view/day`,
        { params: { date } }
      );

      return {
        date: new Date(response.data.date),
        avgIntensity: response.data.avgIntensity,
        avgDuration: response.data.avgDurationMs / 1000,
        episodeCount: response.data.nbEpisode,
        lastEpisode: response.data.lastEpisode
          ? new Date(response.data.lastEpisode)
          : null,
        graphData: response.data.graph.data,
        graphStart: new Date(response.data.graph.start),
        graphEnd: new Date(response.data.graph.end),
        graphMax: response.data.graph.max,
        graphMin: response.data.graph.min,
      };
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 401) {
        throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
      }

      if (status === 404) {
        throw new ApiError(404, "Aucune donnée trouvée pour cette date.");
      }

      if (status === 429) {
        throw new ApiError(429, "Trop de requêtes. Veuillez réessayer plus tard.");
      }

      if (status >= 500) {
        throw new ApiError(500, "Erreur serveur. Réessayez plus tard.");
      }

      throw new ApiError(
        status ?? 0,
        error.response?.data?.message || "Erreur lors du chargement des données."
      );
    }
  },

  getMonthView: async (
    year: number,
    month: number
  ): Promise<MotionMonthData> => {
    try {
      const response = await privateApiClient.get<MonthViewResponse>(
        `/motion/view/month`,
        { params: { year, month } }
      );

      return {
        year: response.data.year,
        month: response.data.month,
        episodes: response.data.days.map((day) => ({
          date: day.date,
          count: day.nbEpisode,
        })),
      };
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 401) {
        throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
      }

      if (status === 429) {
        throw new ApiError(429, "Trop de requêtes. Veuillez réessayer plus tard.");
      }

      if (status >= 500) {
        throw new ApiError(500, "Erreur serveur. Réessayez plus tard.");
      }

      throw new ApiError(
        status ?? 0,
        error.response?.data?.message || "Erreur lors du chargement du calendrier."
      );
    }
  },

  getTodayView: async (): Promise<MotionDayData> => {
    const today = new Date().toISOString().split('T')[0];
    return motionService.getDayView(today);
  },
};