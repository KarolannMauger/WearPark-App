import { adminService } from '../adminService';
import { privateApiClient } from '../api';
import { ApiError } from '../../errors/ApiError';

jest.mock('../api', () => ({
  privateApiClient: {
    get: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

const mockedApi = privateApiClient as jest.Mocked<typeof privateApiClient>;

describe('adminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should fetch users with default params', async () => {
      const mockData = { content: [], totalElements: 0 };

      mockedApi.get.mockResolvedValue({ data: mockData });

      const result = await adminService.getUsers();

      expect(mockedApi.get).toHaveBeenCalledWith('/admin/users', {
        params: { page: 0, size: 20, search: undefined },
      });

      expect(result).toEqual(mockData);
    });

    it('should pass custom params', async () => {
      mockedApi.get.mockResolvedValue({ data: {} });

      await adminService.getUsers({ page: 2, limit: 10, search: 'john' });

      expect(mockedApi.get).toHaveBeenCalledWith('/admin/users', {
        params: { page: 2, size: 10, search: 'john' },
      });
    });

    it('should throw 403 ApiError', async () => {
      mockedApi.get.mockRejectedValue({
        response: { status: 403 },
      });

      await expect(adminService.getUsers()).rejects.toThrow(ApiError);
      await expect(adminService.getUsers()).rejects.toMatchObject({
        status: 403,
      });
    });

    it('should throw 401 ApiError', async () => {
      mockedApi.get.mockRejectedValue({
        response: { status: 401 },
      });

      await expect(adminService.getUsers()).rejects.toMatchObject({
        status: 401,
      });
    });

    it('should throw generic ApiError with message', async () => {
      mockedApi.get.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Server error' },
        },
      });

      await expect(adminService.getUsers()).rejects.toMatchObject({
        status: 500,
        message: 'Server error',
      });
    });
  });

  describe('getUserById', () => {
    it('should fetch user by id', async () => {
      const mockData = { id: '1' };

      mockedApi.get.mockResolvedValue({ data: mockData });

      const result = await adminService.getUserById('1');

      expect(mockedApi.get).toHaveBeenCalledWith('/admin/users/1');
      expect(result).toEqual(mockData);
    });
  });

  describe('deleteUser', () => {
    it('should call delete endpoint', async () => {
      mockedApi.delete.mockResolvedValue({});

      await adminService.deleteUser('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/admin/users/1');
    });

    it('should throw ApiError on failure', async () => {
      mockedApi.delete.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'Delete failed' },
        },
      });

      await expect(adminService.deleteUser('1')).rejects.toMatchObject({
        status: 400,
        message: 'Delete failed',
      });
    });
  });

  describe('updateUserRole', () => {
    it('should call patch with role', async () => {
      mockedApi.patch.mockResolvedValue({});

      await adminService.updateUserRole('1', 'ADMIN');

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/admin/users/1/role',
        { role: 'ADMIN' }
      );
    });

    it('should throw ApiError on failure', async () => {
      mockedApi.patch.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Role update failed' },
        },
      });

      await expect(
        adminService.updateUserRole('1', 'ADMIN')
      ).rejects.toMatchObject({
        status: 500,
        message: 'Role update failed',
      });
    });
  });

  describe('updateUser', () => {
    it('should call patch with user data', async () => {
      const user = { name: 'John' } as any;

      mockedApi.patch.mockResolvedValue({});

      await adminService.updateUser('1', user);

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/admin/users/1',
        user
      );
    });

    it('should throw ApiError on failure', async () => {
      mockedApi.patch.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Update failed' },
        },
      });

      await expect(
        adminService.updateUser('1', {} as any)
      ).rejects.toMatchObject({
        status: 500,
        message: 'Update failed',
      });
    });
  });
});