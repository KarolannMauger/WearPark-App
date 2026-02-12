import { privateApiClient } from './api';

interface User {
  id: string;
  name: string;
  email: string;
}

// GET PROFILE - Private (token requis)
export const getUserProfile = async (): Promise<User> => {
  const response = await privateApiClient.get<User>('/user/profile');
  return response.data;
};

// UPDATE PROFILE - Private
export const updateProfile = async (data: Partial<User>) => {
  const response = await privateApiClient.put('/user/profile', data);
  return response.data;
};