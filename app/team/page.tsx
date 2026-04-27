'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function TeamPage() {
  const { users, currentUser } = useAppStore();

  if (currentUser.role === 'employee') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center executive-card rounded-xl shadow-sm mt-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground mb-4">You do not have permission to view the team directory. Only Managers and Admins can access this section.</p>
        <Link href="/" className="text-sm font-medium hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Directory</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage users, roles, and access across your organization.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <div key={user.id} className="bg-surface rounded-xl border border-border shadow-sm p-6 flex flex-col items-center text-center hover:border-black transition-colors">
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mb-4 border border-border object-cover" />
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <div className="text-sm text-muted-foreground mb-3 flex items-center justify-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </div>
            <Badge variant={user.role === 'admin' ? 'error' : user.role === 'manager' ? 'warning' : 'default'} className="uppercase">
              {user.role}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
