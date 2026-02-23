import { ApiError } from '../errors/ApiError';
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
    try {
      const response = await privateApiClient.get<User>('/users/profile');
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 401) {
        throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
      }

      if (status >= 500) {
        throw new ApiError(500, "Erreur serveur. Réessayez plus tard.");
      }

      throw new ApiError(
        status ?? 0,
        error.response?.data?.message ||
          "Impossible de récupérer le profil."
      );
    }
  },

  updateProfile: async (
    data: Partial<UserProfileData>
  ): Promise<User> => {
    try {
      const response = await privateApiClient.put<User>(
        '/users/profile',
        data
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 400) {
        throw new ApiError(400, "Données invalides.");
      }

      if (status === 401) {
        throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.");
      }

      if (status === 409) {
        throw new ApiError(409, "Conflit détecté sur les données.");
      }

      if (status === 429) {
        throw new ApiError(429, "Trop de requêtes. Veuillez patienter.");
      }

      if (status >= 500) {
        throw new ApiError(500, "Erreur serveur. Réessayez plus tard.");
      }

      throw new ApiError(
        status ?? 0,
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du profil."
      );
    }
  },
};