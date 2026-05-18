import { reportService } from '../reportService';
import { privateApiClient } from '../api';
import * as Sharing from 'expo-sharing';
import { ApiError } from '@/src/errors/ApiError';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockWrite = jest.fn();
const mockFileUri = 'file://mock/document/rapport_test.pdf';

jest.mock('expo-file-system', () => ({
  File: jest.fn().mockImplementation(() => ({
    write: mockWrite,
    uri: mockFileUri,
  })),
  Paths: { document: 'file://mock/document' },
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(),
  shareAsync: jest.fn(),
}));

jest.mock('../api', () => ({
  privateApiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApi   = privateApiClient as jest.Mocked<typeof privateApiClient>;
const mockedShare = Sharing        as jest.Mocked<typeof Sharing>;

// ── Helpers ───────────────────────────────────────────────────────────────────

const makeArrayBuffer = () => new Uint8Array([37, 80, 68, 70]).buffer; // %PDF

const sampleReport = {
  id:          'abc123',
  year:        2026,
  month:       5,
  title:       'Rapport Mai 2026',
  generatedAt: '2026-05-01T12:00:00Z',
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('reportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── generateAndDownload ────────────────────────────────────────────────────
  describe('generateAndDownload', () => {
    it('appelle POST /report/generate avec les bons paramètres', async () => {
      mockedApi.post.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(true);
      mockedShare.shareAsync.mockResolvedValue(undefined);

      await reportService.generateAndDownload(2026, 5);

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/report/generate',
        null,
        expect.objectContaining({
          params: { year: 2026, month: 5 },
          responseType: 'arraybuffer',
        })
      );
    });

    it('écrit le fichier PDF et ouvre le partage quand le partage est disponible', async () => {
      mockedApi.post.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(true);
      mockedShare.shareAsync.mockResolvedValue(undefined);

      await reportService.generateAndDownload(2026, 5);

      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockedShare.shareAsync).toHaveBeenCalledWith(
        mockFileUri,
        expect.objectContaining({ mimeType: 'application/pdf' })
      );
    });

    it("n'appelle pas shareAsync quand le partage n'est pas disponible", async () => {
      mockedApi.post.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(false);

      await reportService.generateAndDownload(2026, 5);

      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockedShare.shareAsync).not.toHaveBeenCalled();
    });

    it('génère un nom de fichier avec le mois paddé sur 2 chiffres', async () => {
      const { File } = require('expo-file-system');
      mockedApi.post.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(false);

      await reportService.generateAndDownload(2026, 3);

      expect(File).toHaveBeenCalledWith(
        expect.anything(),
        'rapport_2026_03.pdf'
      );
    });

    it('lance ApiError si la requête échoue', async () => {
      mockedApi.post.mockRejectedValue(new Error('Network error'));

      await expect(
        reportService.generateAndDownload(2026, 5)
      ).rejects.toMatchObject({
        code:   'REPORT_ERROR',
        status: 500,
      });
    });

    it('lance une instance ApiError', async () => {
      mockedApi.post.mockRejectedValue(new Error('fail'));

      await expect(
        reportService.generateAndDownload(2026, 5)
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ── getHistory ─────────────────────────────────────────────────────────────
  describe('getHistory', () => {
    it('retourne la liste des rapports', async () => {
      mockedApi.get.mockResolvedValue({ data: [sampleReport] });

      const result = await reportService.getHistory();

      expect(result).toEqual([sampleReport]);
    });

    it('utilise les paramètres par défaut page=0 et size=50', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await reportService.getHistory();

      expect(mockedApi.get).toHaveBeenCalledWith(
        '/report/history',
        expect.objectContaining({ params: { page: 0, size: 50 } })
      );
    });

    it('accepte des paramètres personnalisés', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await reportService.getHistory(2, 10);

      expect(mockedApi.get).toHaveBeenCalledWith(
        '/report/history',
        expect.objectContaining({ params: { page: 2, size: 10 } })
      );
    });

    it('retourne une liste vide si aucun rapport', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      const result = await reportService.getHistory();

      expect(result).toEqual([]);
    });

    it('lance ApiError si la requête échoue', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));

      await expect(reportService.getHistory()).rejects.toMatchObject({
        code:   'REPORT_ERROR',
        status: 500,
      });
    });

    it('lance une instance ApiError', async () => {
      mockedApi.get.mockRejectedValue(new Error('fail'));

      await expect(reportService.getHistory()).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ── downloadById ──────────────────────────────────────────────────────────
  describe('downloadById', () => {
    it('appelle GET /report/{id}/download avec le bon id', async () => {
      mockedApi.get.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(true);
      mockedShare.shareAsync.mockResolvedValue(undefined);

      await reportService.downloadById(sampleReport);

      expect(mockedApi.get).toHaveBeenCalledWith(
        `/report/${sampleReport.id}/download`,
        expect.objectContaining({ responseType: 'arraybuffer' })
      );
    });

    it('écrit le fichier et ouvre le partage', async () => {
      mockedApi.get.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(true);
      mockedShare.shareAsync.mockResolvedValue(undefined);

      await reportService.downloadById(sampleReport);

      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockedShare.shareAsync).toHaveBeenCalledWith(
        mockFileUri,
        expect.objectContaining({ mimeType: 'application/pdf' })
      );
    });

    it('génère un nom de fichier correct à partir du rapport', async () => {
      const { File } = require('expo-file-system');
      mockedApi.get.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(false);

      await reportService.downloadById(sampleReport);

      expect(File).toHaveBeenCalledWith(
        expect.anything(),
        `rapport_${sampleReport.year}_0${sampleReport.month}.pdf`
      );
    });

    it('lance ApiError si la requête échoue', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));

      await expect(
        reportService.downloadById(sampleReport)
      ).rejects.toMatchObject({
        code:   'REPORT_ERROR',
        status: 500,
      });
    });

    it('lance une instance ApiError', async () => {
      mockedApi.get.mockRejectedValue(new Error('fail'));

      await expect(
        reportService.downloadById(sampleReport)
      ).rejects.toBeInstanceOf(ApiError);
    });
  });
});
