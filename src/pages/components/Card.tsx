import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Permission, Role } from '@/services';
import nProgress from 'nprogress';

export default function Card({
  selectedRole,
  permissions,
}: {
  selectedRole: Role;
  permissions: Permission[];
}) {
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<
    Permission[]
  >([]);

  useEffect(() => {
    setSelectedRolePermissions([...selectedRole.permissions]);
  }, [selectedRole]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    nProgress.start();
    const res = await fetch('/api/permissions', {
      body: JSON.stringify({
        roleId: selectedRole.id,
        permissions: selectedRolePermissions,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (res.status === 500) return;
    nProgress.done();
    toast.success('Permissions saved!');
  };

  const handleToggle = (permission: Permission) => {
    if (selectedRolePermissions.includes(permission)) {
      setSelectedRolePermissions((prev) =>
        prev.filter((p) => p.id !== permission.id),
      );
    } else {
      setSelectedRolePermissions([...selectedRolePermissions, permission!]);
    }
  };

  return (
    <form
      className="bg-neutral-500 p-3 w-full flex flex-col"
      onSubmit={handleSubmit}
    >
      <fieldset>
        {permissions.map((permission) => (
          <div
            key={permission.id}
            className="grid grid-cols-2 m-2 justify-items-center"
          >
            <label htmlFor={`toogle-${permission.id}`}>{permission.name}</label>
            <input
              id={`toogle-${permission.id}`}
              type="checkbox"
              className="h-5 w-5"
              checked={selectedRolePermissions.some(
                (p) => p.id === permission.id,
              )}
              onChange={() => handleToggle(permission)}
            />
          </div>
        ))}
      </fieldset>

      <input
        className="hover:cursor-pointer p-2 m-4 rounded bg-green-700 hover:text-neutral-700"
        type="submit"
        value="Save"
      />
    </form>
  );
}
