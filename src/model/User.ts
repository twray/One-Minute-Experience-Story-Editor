interface UserBase {
  id: number;
  status: string;
  email: string;
}

export enum UserRole {
  Administrator = 'Administrator',
  ContentEditor = 'Content Editor'
}

export interface User extends UserBase {
  primary_role: UserRole;
};

export interface UserDB extends UserBase {};

export interface RoleDB {
  id: number;
  name: UserRole;
  description: string;
}

export interface UserRoleDB {
  id: number;
  user: UserDB;
  role: RoleDB;
}
