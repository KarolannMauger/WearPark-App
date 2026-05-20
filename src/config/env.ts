import Constants from 'expo-constants';

export const ENV = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL 
    || Constants.expoConfig?.extra?.apiUrl 
    || 'http://localhost:8080/',
  env: Constants.expoConfig?.extra?.env || 'development',
  debug: Constants.expoConfig?.extra?.debug || false,
};