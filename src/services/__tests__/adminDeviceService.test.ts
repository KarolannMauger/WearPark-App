import { adminDeviceService } from '../adminDeviceService';
import { privateApiClient } from '../api';
import { ApiError } from '../../errors/ApiError';

jest.mock('../api', () => ({
  privateApiClient: {
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockedApi = privateApiClient as jest.Mocked<typeof privateApiClient>;

describe('adminDeviceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDevice', () => {
    it('should create device for user', async () => {
      const mockData = { id: '1' };

      mockedApi.post.mockResolvedValue({ data: mockData });

      const result = await adminDeviceService.createDevice(
        'user1',
        'DEVICE_KEY'
      );

      expect(mockedApi.post).toHaveBeenCalledWith('/admin/devices', {
        userId: 'user1',
        deviceKey: 'DEVICE_KEY',
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
        adminDeviceService.createDevice('user1', 'DEVICE_KEY')
      ).rejects.toMatchObject({
        status: 400,
        message: 'create error',
      });
    });
  });

  describe('updateDevice', () => {
    it('should update device', async () => {
      const mockData = { ok: true };

      mockedApi.patch.mockResolvedValue({ data: mockData });

      const result = await adminDeviceService.updateDevice(
        'device1',
        'NEW_KEY'
      );

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/admin/devices/device1',
        { deviceKey: 'NEW_KEY' }
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
        adminDeviceService.updateDevice('device1', 'NEW_KEY')
      ).rejects.toMatchObject({
        status: 500,
        message: 'update error',
      });
    });
  });

  describe('disableDevice', () => {
    it('should call disable endpoint', async () => {
      mockedApi.patch.mockResolvedValue({});

      await adminDeviceService.disableDevice('device1');

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/admin/devices/device1/disable'
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
        adminDeviceService.disableDevice('device1')
      ).rejects.toMatchObject({
        status: 403,
        message: 'forbidden',
      });
    });
  });
});