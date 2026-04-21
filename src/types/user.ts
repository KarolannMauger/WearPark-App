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
};

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AdminUsersResponse {
  content: UserSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}