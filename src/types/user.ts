export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  dateOfBirth?: string;
  hasDiagnostic?: boolean;
  disease?: string;
  preferences?: {
    monthlyReportEmail: boolean;
    reportRecipients: string[];
  };
}

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  hasDiagnostic?: boolean;
  disease?: string;
  preferences?: {
    monthlyReportEmail?: boolean;
    reportRecipients?: string[];
  };
}