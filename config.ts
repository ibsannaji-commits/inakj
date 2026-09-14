import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

/** API base — change for production */
export const API_URL: string =
  (extra.apiUrl as string) || 'http://localhost:4000/api/v1';

export const WS_URL: string =
  (extra.wsUrl as string) || 'http://localhost:4000';

export const COMMISSION_RATE = 0.03;
export const COLORS = {
  primary: '#1B7A3D',
  primaryDark: '#145C2E',
  primarySoft: '#E8F5E9',
  accent: '#E76F51',
  bg: '#F7F9F8',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#5C6B66',
  border: '#E0E5E2',
  danger: '#C62828',
  success: '#2E7D32',
  gold: '#F9A825',
};
