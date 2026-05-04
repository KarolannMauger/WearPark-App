import { Device } from "./device";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  dateOfBirth: string;
  gender?: string;
  hasDiagnosis: boolean;
  diagnosis?: string;
  userPreferences: {
    monthlyReportEmail: boolean;
    reportRecipients: string[];
  };
  device: Device | null;
};