import { privateApiClient } from './api';
import { UserProfileData } from '@/src/components/UserProfileForm';

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dateOfBirth?: string;
  hasDiagnostic?: boolean;
  disease?: string;
  preferences?: {
    monthlyReportEmail: boolean;
    reportRecipients: string[];
  };
  device?: {
    id: string;
    deviceKey: string;
    lastSync: string;
    lastDeviceDataDate: string;
  };
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await privateApiClient.get<User>('/users/profile');

    return response.data;
  },

  updateProfile: async (data: Partial<UserProfileData>): Promise<User> => {
    const response = await privateApiClient.put<User>('/users/profile', data);

    return response.data;
  },
};