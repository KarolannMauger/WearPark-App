import { ApiError } from "../errors/ApiError";
import { privateApiClient } from "./api";
import { User } from "@/src/types/user";
import { formatDateForAPI } from "@/src/utils/date";

function handleUserServiceError(
  error: unknown,
  defaultMessage: string = "Une erreur est survenue"
): never {
  const status = (error as any)?.response?.status;
  const backendMessage = (error as any)?.response?.data?.message;
  const backendCode = (error as any)?.response?.data?.code || "SERVER_ERROR";

  if (status && backendMessage) {
    throw new ApiError(status, backendCode, backendMessage);
  }

  switch (status) {
    case 400:
      throw new ApiError(400, "BAD_REQUEST", "Données invalides.");
    case 401:
      throw new ApiError(401, "UNAUTHORIZED", "Session expirée. Veuillez vous reconnecter.");
    case 409:
      throw new ApiError(409, "CONFLICT", "Conflit détecté sur les données.");
    case 429:
      throw new ApiError(429, "TOO_MANY_REQUESTS", "Trop de requêtes. Veuillez patienter.");
    default:
      if (status && status >= 500) {
        throw new ApiError(500, "INTERNAL_ERROR", "Erreur serveur. Réessayez plus tard.");
      }
      throw new ApiError(status ?? 0, "UNKNOWN_ERROR", backendMessage || defaultMessage);
  }
}

export const userService = {
  getProfile: async (): Promise<User> => {
    try {
      const response = await privateApiClient.get<User>("/user");
      return response.data;
    } catch (error) {
      handleUserServiceError(error, "Impossible de récupérer le profil.");
    }
  },

  updateProfile: async (data: Partial<User>): Promise<void> => {
    try {
      const safePayload: Partial<User> = { ...data };

      safePayload.preferences = safePayload.preferences || { monthlyReportEmail: false, reportRecipients: [] };

      safePayload.dateOfBirth = safePayload.dateOfBirth ? formatDateForAPI(safePayload.dateOfBirth) || undefined : undefined;

      if (!safePayload.hasDiagnosis || !safePayload.diagnosis) {
        delete safePayload.diagnosis;
      }

      await privateApiClient.post("/user", safePayload);
    } catch (error) {
      handleUserServiceError(error, "Erreur lors de la mise à jour du profil.");
    }
  },
};