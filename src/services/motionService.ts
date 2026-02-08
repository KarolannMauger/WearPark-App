import { privateApiClient } from './api';
import { base64ToFloatArray } from '@/src/utils/base64';

export interface MotionDataRaw {
  id: string;
  start: string;
  end: string;
  data: {
    ax: string;
    ay: string;
    az: string;
    gx: string;
    gy: string;
    gz: string;
  };
}

export interface MotionDataDecoded {
  id: string;
  start: Date;
  end: Date;
  data: {
    ax: number[];
    ay: number[];
    az: number[];
    gx: number[];
    gy: number[];
    gz: number[];
  };
}

export type MotionDataListResponse = MotionDataRaw[];

export const motionService = {
  getLatest: async (): Promise<MotionDataDecoded> => {
    const response = await privateApiClient.get<MotionDataRaw>('/motion/data/latest');
    
    return decodeMotionData(response.data);
  },

  getAll: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<MotionDataDecoded[]> => {
    
    try {
      const response = await privateApiClient.get<MotionDataListResponse>('/motion/data', {
        params: {
          start: params?.startDate,
          end: params?.endDate,
        },
      });
      
      if (!Array.isArray(response.data)) {
        return [];
      }
      
      return response.data.map(decodeMotionData);
    } catch (error: any) {
      console.error('❌ Motion API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }
};

function decodeMotionData(raw: MotionDataRaw): MotionDataDecoded {
  return {
    id: raw.id,
    start: new Date(raw.start),
    end: new Date(raw.end),
    data: {
      ax: base64ToFloatArray(raw.data.ax),
      ay: base64ToFloatArray(raw.data.ay),
      az: base64ToFloatArray(raw.data.az),
      gx: base64ToFloatArray(raw.data.gx),
      gy: base64ToFloatArray(raw.data.gy),
      gz: base64ToFloatArray(raw.data.gz),
    },
  };
}