import { privateApiClient } from './api';
import { ApiError } from '../errors/ApiError';

export const deviceService = {
  getDevices: async () => {
    try {
      const response = await privateApiClient.get('/devices');
      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.status ?? 0,
        "",
        error.response?.data?.message || "Error fetching devices"
      );
    }
  },
  createDevice: async (deviceKey: string) => {
    try {
      const response = await privateApiClient.post('/devices', {
        deviceKey,
      });

      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.status ?? 0,
        "",
        error.response?.data?.message || "Error creating device"
      );
    }
  },

  updateDevice: async (deviceId: string, deviceKey: string) => {
    try {
      const response = await privateApiClient.patch(
        `/devices/${deviceId}`,
        { deviceKey }
      );

      return response.data;
    } catch (error: any) {
      throw new ApiError(
        error.response?.status ?? 0,
        "",
        error.response?.data?.message || "Error updating device"
      );
    }
  },
  disableDevice: async (deviceId: string) => {
    try {
      await privateApiClient.patch(
        `/devices/${deviceId}/disable`
      );
    } catch (error: any) {
      throw new ApiError(
        error.response?.status ?? 0,
        "",
        error.response?.data?.message || "Error disabling device"
      );
    }
  },
};