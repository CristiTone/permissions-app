import { MockRoleService, Permission, Role } from '@/services';
import type { NextApiRequest, NextApiResponse } from 'next';

export type Result = {
  roles: Role[];
  permissions: Permission[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result | { message: string }>,
) {
  const roleService = new MockRoleService();
  try {
    if (req.method === 'GET') {
      const result = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
      ]);
      res.status(200).json({ roles: result[0], permissions: result[1] });
    }
    if (req.method === 'POST') {
      const { roleId, permissions } = req.body;
      await roleService.setPermissionsForRole(roleId, permissions);
      res.status(200).json({ message: 'Permissions saved!' });
    }
  } catch (error) {
    console.error(error);
  }
}
