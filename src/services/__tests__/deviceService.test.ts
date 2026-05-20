import { deviceService } from '../deviceService';
import { privateApiClient } from '../api';
import { ApiError } from '../../errors/ApiError';

jest.mock('../api', () => ({
  privateApiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockedApi = privateApiClient as jest.Mocked<typeof privateApiClient>;

describe('deviceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDevices', () => {
    it('should return devices', async () => {
      const mockData = [{ id: '1' }];

      mockedApi.get.mockResolvedValue({ data: mockData });

      const result = await deviceService.getDevices();

      expect(mockedApi.get).toHaveBeenCalledWith('/devices');
      expect(result).toEqual(mockData);
    });

    it('should throw ApiError on failure', async () => {
      mockedApi.get.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'fail' },
        },
      });

      await expect(deviceService.getDevices()).rejects.toMatchObject({
        status: 500,
        message: 'fail',
      });
    });
  });

  // ======================
  // createDevice
  // ======================
  describe('createDevice', () => {
    it('should create device', async () => {
      const mockData = { id: '1' };

      mockedApi.post.mockResolvedValue({ data: mockData });

      const result = await deviceService.createDevice('ABC123');

      expect(mockedApi.post).toHaveBeenCalledWith('/devices', {
        deviceKey: 'ABC123',
      });

      expect(result).toEqual(mockData);
    });

    it('should throw ApiError on failure', async () => {
      mockedApi.post.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'create error' },
        },
      });

      await expect(
        deviceService.createDevice('ABC123')
      ).rejects.toMatchObject({
        status: 400,
        message: 'create error',
      });
    });
  });

  describe('updateDevice', () => {
    it('should update device', async () => {
      const mockData = { id: '1' };

      mockedApi.patch.mockResolvedValue({ data: mockData });

      const result = await deviceService.updateDevice('1', 'NEWKEY');

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/devices/1',
        { deviceKey: 'NEWKEY' }
      );

      expect(result).toEqual(mockData);
    });

    it('should throw ApiError on failure', async () => {
      mockedApi.patch.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'update error' },
        },
      });

      await expect(
        deviceService.updateDevice('1', 'NEWKEY')
      ).rejects.toMatchObject({
        status: 500,
        message: 'update error',
      });
    });
  });

  describe('disableDevice', () => {
    it('should call disable endpoint', async () => {
      mockedApi.patch.mockResolvedValue({});

      await deviceService.disableDevice('1');

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/devices/1/disable'
      );
    });

    it('should throw ApiError on failure', async () => {
      mockedApi.patch.mockRejectedValue({
        response: {
          status: 403,
          data: { message: 'forbidden' },
        },
      });

      await expect(
        deviceService.disableDevice('1')
      ).rejects.toMatchObject({
        status: 403,
        message: 'forbidden',
      });
    });
  });
});