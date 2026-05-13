import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { privateApiClient } from './api';
import { ApiError } from '../errors/ApiError';
import { Report } from '../types/report';

/**
 * Save PDF bytes (ArrayBuffer from axios) to the document directory,
 * then open the system share sheet so the user can view / save the file.
 */
const savePdfAndShare = async (
  data: ArrayBuffer,
  filename: string
): Promise<void> => {
  const bytes = new Uint8Array(data);
  const file = new File(Paths.document, filename);
  file.write(bytes);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
      dialogTitle: 'Ouvrir le rapport',
    });
  }
};

export const reportService = {

  /**
   * Generate (or re-generate) the PDF for a given month, then open it
   * via the native share sheet so the user can view / save it.
   */
  generateAndDownload: async (year: number, month: number): Promise<void> => {
    try {
      const response = await privateApiClient.post(
        '/report/generate',
        null,
        {
          params: { year, month },
          responseType: 'arraybuffer',
          timeout: 30_000, // PDF generation can take a moment
        }
      );

      const filename = `rapport_${year}_${String(month).padStart(2, '0')}.pdf`;
      await savePdfAndShare(response.data as ArrayBuffer, filename);
    } catch {
      throw new ApiError(500, 'REPORT_ERROR', 'Impossible de générer le rapport PDF.');
    }
  },

  getHistory: async (page = 0, size = 50): Promise<Report[]> => {
    try {
      const response = await privateApiClient.get('/report/history', {
        params: { page, size },
      });
      return response.data as Report[];
    } catch {
      throw new ApiError(500, 'REPORT_ERROR', "Impossible de charger l'historique des rapports.");
    }
  },

  downloadById: async (report: Report): Promise<void> => {
    try {
      const response = await privateApiClient.get(
        `/report/${report.id}/download`,
        {
          responseType: 'arraybuffer',
          timeout: 30_000,
        }
      );

      const filename = `rapport_${report.year}_${String(report.month).padStart(2, '0')}.pdf`;
      await savePdfAndShare(response.data as ArrayBuffer, filename);
    } catch {
      throw new ApiError(500, 'REPORT_ERROR', 'Impossible de télécharger le rapport.');
    }
  },
};
