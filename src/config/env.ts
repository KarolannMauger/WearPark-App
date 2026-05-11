import Constants from 'expo-constants';

export const ENV = {
  apiUrl: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8080/',
  env: Constants.expoConfig?.extra?.env || 'development',
  debug: Constants.expoConfig?.extra?.debug || false,
};