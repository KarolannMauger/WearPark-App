import { reportService } from '../reportService';
import { privateApiClient } from '../api';
import * as Sharing from 'expo-sharing';
import { ApiError } from '@/src/errors/ApiError';

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

const makeArrayBuffer = () => new Uint8Array([37, 80, 68, 70]).buffer; // %PDF

const sampleReport = {
  id:          'abc123',
  year:        2026,
  month:       5,
  title:       'Rapport Mai 2026',
  generatedAt: '2026-05-01T12:00:00Z',
};

describe('reportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAndDownload', () => {
    it('call POST /report/generate with the correct parameters', async () => {
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

    it('should write the PDF file and open the share when share is available', async () => {
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

    it("should not call shareAsync when sharing is not available", async () => {
      mockedApi.post.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(false);

      await reportService.generateAndDownload(2026, 5);

      expect(mockWrite).toHaveBeenCalledTimes(1);
      expect(mockedShare.shareAsync).not.toHaveBeenCalled();
    });

    it('should generate a filename with the month padded to 2 digits', async () => {
      const { File } = require('expo-file-system');
      mockedApi.post.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(false);

      await reportService.generateAndDownload(2026, 3);

      expect(File).toHaveBeenCalledWith(
        expect.anything(),
        'rapport_2026_03.pdf'
      );
    });

    it('should throw ApiError if the request fails', async () => {
      mockedApi.post.mockRejectedValue(new Error('Network error'));

      await expect(
        reportService.generateAndDownload(2026, 5)
      ).rejects.toMatchObject({
        code:   'REPORT_ERROR',
        status: 500,
      });
    });

    it('should throw an ApiError instance', async () => {
      mockedApi.post.mockRejectedValue(new Error('fail'));

      await expect(
        reportService.generateAndDownload(2026, 5)
      ).rejects.toBeInstanceOf(ApiError);
    });
  });

  
  describe('getHistory', () => {
    it('should return the list of reports', async () => {
      mockedApi.get.mockResolvedValue({ data: [sampleReport] });

      const result = await reportService.getHistory();

      expect(result).toEqual([sampleReport]);
    });

    it('should use the default parameters page=0 and size=50', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await reportService.getHistory();

      expect(mockedApi.get).toHaveBeenCalledWith(
        '/report/history',
        expect.objectContaining({ params: { page: 0, size: 50 } })
      );
    });

    it('should accept custom parameters', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      await reportService.getHistory(2, 10);

      expect(mockedApi.get).toHaveBeenCalledWith(
        '/report/history',
        expect.objectContaining({ params: { page: 2, size: 10 } })
      );
    });

    it('should return an empty list if no reports are available', async () => {
      mockedApi.get.mockResolvedValue({ data: [] });

      const result = await reportService.getHistory();

      expect(result).toEqual([]);
    });

    it('should throw ApiError if the request fails', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));

      await expect(reportService.getHistory()).rejects.toMatchObject({
        code:   'REPORT_ERROR',
        status: 500,
      });
    });

    it('should throw an ApiError instance', async () => {
      mockedApi.get.mockRejectedValue(new Error('fail'));

      await expect(reportService.getHistory()).rejects.toBeInstanceOf(ApiError);
    });
  });

  describe('downloadById', () => {
    it('should call GET /report/{id}/download with the correct id', async () => {
      mockedApi.get.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(true);
      mockedShare.shareAsync.mockResolvedValue(undefined);

      await reportService.downloadById(sampleReport);

      expect(mockedApi.get).toHaveBeenCalledWith(
        `/report/${sampleReport.id}/download`,
        expect.objectContaining({ responseType: 'arraybuffer' })
      );
    });

    it('should write the file and open the share', async () => {
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

    it('should generate a correct filename from the report', async () => {
      const { File } = require('expo-file-system');
      mockedApi.get.mockResolvedValue({ data: makeArrayBuffer() });
      mockedShare.isAvailableAsync.mockResolvedValue(false);

      await reportService.downloadById(sampleReport);

      expect(File).toHaveBeenCalledWith(
        expect.anything(),
        `rapport_${sampleReport.year}_0${sampleReport.month}.pdf`
      );
    });

    it('should throw ApiError if the request fails', async () => {
      mockedApi.get.mockRejectedValue(new Error('Network error'));

      await expect(
        reportService.downloadById(sampleReport)
      ).rejects.toMatchObject({
        code:   'REPORT_ERROR',
        status: 500,
      });
    });

    it('should throw an ApiError instance', async () => {
      mockedApi.get.mockRejectedValue(new Error('fail'));

      await expect(
        reportService.downloadById(sampleReport)
      ).rejects.toBeInstanceOf(ApiError);
    });
  });
});
