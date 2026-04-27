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

export interface Device {
    id: string;
    deviceKey: string;
    isActive: boolean;
    createdAt: string;
    revokedAt?: string;
}

export interface AdminUserDetailsRequest {
    firstName: string;
    lastName: string;
    role: 'USER' | 'ADMIN';
    gender: string;
    hasDiagnosis: boolean;
    diagnosis?: string;
};

export interface AdminUserDetailsResponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    dateOfBirth: string;
    gender?: string;
    hasDiagnosis: boolean;
    diagnosis?: string;
    createdAt: string;
    updatedAt: string;
    devices: Device[];
}