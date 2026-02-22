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
  /**
   * Récupérer les données d'une journée spécifique
   */
  getDayView: async (date: string): Promise<MotionDayData> => {
    console.log('motionService.getDayView called for:', date);
    
    try {
      const response = await privateApiClient.get<DayViewResponse>(
        `/motion/view/day`,
        { params: { date } }
      );
      
      console.log('Day view received:', response.data.date);
      
      return {
        date: new Date(response.data.date),
        avgIntensity: response.data.avgIntensity,
        avgDuration: response.data.avgDurationMs / 1000, // Convertir ms → secondes
        episodeCount: response.data.nbEpisode,
        lastEpisode: response.data.lastEpisode ? new Date(response.data.lastEpisode) : null,
        graphData: response.data.graph.data,
        graphStart: new Date(response.data.graph.start),
        graphEnd: new Date(response.data.graph.end),
        graphMax: response.data.graph.max,
        graphMin: response.data.graph.min,
      };
    } catch (error: any) {
      console.error('Motion getDayView Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  /**
   * Récupérer les données d'un mois (pour le calendrier)
   */
  getMonthView: async (year: number, month: number): Promise<MotionMonthData> => {
    console.log('motionService.getMonthView called for:', { year, month });
    
    try {
      const response = await privateApiClient.get<MonthViewResponse>(
        `/motion/view/month`,
        { params: { year, month } }
      );
      
      console.log('Month view received:', response.data.days.length, 'days');
      
      return {
        year: response.data.year,
        month: response.data.month,
        episodes: response.data.days.map(day => ({
          date: day.date,
          count: day.nbEpisode,
        })),
      };
    } catch (error: any) {
      console.error('Motion getMonthView Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  /**
   * Récupérer les données du jour actuel (pour HomeScreen)
   */
  getTodayView: async (): Promise<MotionDayData> => {
    const today = new Date().toISOString().split('T')[0];
    return motionService.getDayView(today);
  },
};