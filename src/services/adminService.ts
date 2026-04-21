import { privateApiClient } from './api';
import { ApiError } from '../errors/ApiError';
import { UserSummary, AdminUsersResponse } from '../types/user';

export const adminService = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AdminUsersResponse> => {
    try {
      const response = await privateApiClient.get<AdminUsersResponse>('/admin/users', {
        params: {
          page: params?.page ?? 0,
          size: params?.limit ?? 20,
          search: params?.search,
        },
      });

      return response.data;
    } catch (error: any) {
      const status = error.response?.status;

      if (status === 403) {
        throw new ApiError(403, "", "Accès refusé. Vous n'êtes pas administrateur.");
      }

      if (status === 401) {
        throw new ApiError(401, "", "Session expirée. Veuillez vous reconnecter.");
      }

      throw new ApiError(
        status ?? 0,
        "",
        error.response?.data?.message || "Erreur lors du chargement des utilisateurs."
      );
    }
  },

  getUserById: async (id: string) => {
    const response = await privateApiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    try {
      await privateApiClient.delete(`/admin/users/${userId}`);
    } catch (error: any) {
      throw new ApiError(
        error.response?.status ?? 0,
        "",
        error.response?.data?.message || "Erreur lors de la suppression."
      );
    }
  },

  updateUserRole: async (userId: string, role: 'user' | 'admin'): Promise<void> => {
    try {
      await privateApiClient.patch(`/admin/users/${userId}/role`, { role });
    } catch (error: any) {
      throw new ApiError(
        error.response?.status ?? 0,
        "",
        error.response?.data?.message || "Erreur lors de la modification du rôle."
      );
    }
  },
};