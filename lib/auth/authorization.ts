import { accountType, role } from '@/types/user';

const adminRoles = [role.superadmin, role.admin, role.manager];

export const canEditOrganization = (user: accountType) => {
  return user.roles.includes(role.superadmin) || user.roles.includes(role.admin);
};

export const hasAdminCredentials = (user: accountType) => {
  let has = false;
  adminRoles.map((r: role) => {
    if (user?.roles.includes(r)) {
      has = true;
    }
  });
  return has;
};

export const canEditUser = (accessor: accountType, accesseeId: number) => {
  return hasAdminCredentials(accessor) || (accesseeId === accessor.id && !isStudent(accessor));
};

export const canDeleteUser = (accessor: accountType) => {
  return hasAdminCredentials(accessor);
};

export const canEditCourse = (accessor: accountType, courseMemberIds: number[]) => {
  if (hasAdminCredentials(accessor)) {
    return true;
  } else if (accessor.roles.includes(role.teacher)) {
    return courseMemberIds?.includes(accessor.id);
  }
  return false;
};

export const canDeleteCourse = (accessor: accountType) => {
  return hasAdminCredentials(accessor);
};

export const isStudent = (accessor: accountType) => {
  return accessor.roles.includes(role.student);
};

export const isSuperAdmin = (accessor: accountType) => {
  return accessor.roles.includes(role.superadmin);
};

export const isAdmin = (accessor: accountType) => {
  return accessor.roles.includes(role.admin);
};

export const userHasRoles = (user: accountType, roles: role[]) => {
  return roles.some((role) => user.roles.includes(role));
};
