import { Inter } from 'next/font/google';
import { useState } from 'react';
import { Result } from './api/permissions';
import { Permission, Role } from '@/services';
import Card from './components/Card';

const inter = Inter({ subsets: ['latin'] });

export default function Home({
  roles,
  permissions,
}: {
  roles: Role[];
  permissions: Permission[];
}) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const handleClick = (role: Role) => {
    if (role.id === selectedRole?.id) {
      setSelectedRole(null);
    } else {
      setSelectedRole(role);
    }
  };
  return (
    <main
      className={`flex min-h-screen justify-center p-24 ${inter.className}`}
    >
      <div className="z-10 w-full max-w-xs flex flex-col items-center">
        <h2 className="text-xl p-2">Permissions Dashboard</h2>
        <ul className="flex gap-2 mt-4">
          {roles.map((role) => (
            <li key={role.id}>
              <button
                className={`hover:bg-neutral-700 p-2 rounded ${
                  selectedRole?.id === role.id
                    ? 'bg-neutral-500'
                    : 'bg-neutral-900'
                }`}
                onClick={() => handleClick(role)}
              >
                {role.name}
              </button>
              {selectedRole?.id === role.id && (
                <div className="h-0 w-0 m-auto border-x-8 border-x-transparent border-b-[16px] border-b-neutral-500" />
              )}
            </li>
          ))}
        </ul>
        {selectedRole && (
          <Card selectedRole={selectedRole} permissions={permissions} />
        )}
      </div>
    </main>
  );
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/permissions');
  const data = (await res.json()) as Result;

  return {
    props: { ...data },
  };
}
