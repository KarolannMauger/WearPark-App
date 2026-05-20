import { privateApiClient } from './api';
import { ApiError } from '../errors/ApiError';

export const adminDeviceService = {
  createDevice: async (userId: string, deviceKey: string) => {
    try {
      const response = await privateApiClient.post('/admin/devices', {
        userId,
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
        `/admin/devices/${deviceId}`,
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
        `/admin/devices/${deviceId}/disable`
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