export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  TECHNICIAN = 'TECHNICIAN',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.COORDINATOR]: 'Coordenador',
  [UserRole.TECHNICIAN]: 'Técnico',
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unit: string;
  avatarUrl?: string;
  createdAt: string;
}
