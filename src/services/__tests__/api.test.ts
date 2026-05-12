import { privateApiClient } from '../api';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');

describe('privateApiClient interceptors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add token to headers if present', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('my-token');

    const interceptor = (privateApiClient.interceptors.request as any).handlers[0].fulfilled;

    const requestConfig = { headers: {} };
    const result = await interceptor(requestConfig);

    expect(result.headers.Authorization).toBe('Bearer my-token');
  });

  it('should reject if token is missing', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

    const interceptor = (privateApiClient.interceptors.request as any).handlers[0].fulfilled;
    const requestConfig = { headers: {} };

    await expect(interceptor(requestConfig)).rejects.toThrow('Authentication required');
  });

  it('should delete token on 401', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

    const error = { response: { status: 401 }, config: {}, isAxiosError: true } as any;
    const interceptor = (privateApiClient.interceptors.response as any).handlers[0].rejected;

    await expect(interceptor(error)).rejects.toEqual(error);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('userToken');
  });
});