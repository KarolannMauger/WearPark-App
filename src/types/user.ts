export interface User {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender?: string;
  hasDiagnosis: boolean;
  diagnosis?: string;
  userPreferences: {
    monthlyReportEmail: boolean;
    reportRecipients: string[];
  };
};