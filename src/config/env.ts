import Constants from 'expo-constants';

export const ENV = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api',
  env: Constants.expoConfig?.extra?.env || 'development',
  debug: Constants.expoConfig?.extra?.debug || false,
};