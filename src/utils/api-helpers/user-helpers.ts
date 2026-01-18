import type { UserDto } from '@/api/generated/model/userDto';
import { Role, Department, Permission } from '@/types/auth';

/**
 * Format user display name (first name + last name)
 */
export function formatUserDisplayName(user: UserDto): string {
  return `${user.name} ${user.lastName}`;
}

/**
 * Get user's full info string
 */
export function getUserInfoString(user: UserDto): string {
  return `${formatUserDisplayName(user)} (${user.username} - ${user.email})`;
}

/**
 * Check if user is active based on last login time
 */
export function isUserActive(user: UserDto, daysThreshold: number = 30): boolean {
  if (!user.lastLoginTime) return false;

  const lastLogin = new Date(user.lastLoginTime);
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - daysThreshold);

  return lastLogin > threshold;
}

/**
 * Get user's role names as array
 */
export function getUserRoleNames(user: UserDto): string[] {
  return user.roleSet ? Array.from(user.roleSet) : [];
}

/**
 * Get user's department names as array
 */
export function getUserDepartmentNames(user: UserDto): string[] {
  return user.departmentSet ? Array.from(user.departmentSet) : [];
}

/**
 * Get user's permission names as array
 */
export function getUserPermissionNames(user: UserDto): string[] {
  return user.authoritySet ? Array.from(user.authoritySet) : [];
}

/**
 * Check if user has specific role
 */
export function hasRole(user: UserDto, role: Role): boolean {
  return user.roleSet ? user.roleSet?.includes(role) : false;
}

/**
 * Check if user has specific department
 */
export function hasDepartment(user: UserDto, department: Department): boolean {
  return user.departmentSet ? user.departmentSet.includes(department) : false;
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: UserDto, permission: Permission): boolean {
  return user.authoritySet ? user.authoritySet.includes(permission) : false;
}

/**
 * Get days since last login
 */
export function getDaysSinceLastLogin(user: UserDto): number | null {
  if (!user.lastLoginTime) return null;

  const lastLogin = new Date(user.lastLoginTime);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastLogin.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
