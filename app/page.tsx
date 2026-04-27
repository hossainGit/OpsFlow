'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { format } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { ArrowUpRight, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { tickets, currentUser } = useAppStore();

  const stats = useMemo(() => {
    const total = tickets.length;
    const pending = tickets.filter(t => t.status === 'pending-approval').length;
    const completed = tickets.filter(t => t.status === 'completed' || t.status === 'approved').length;
    const open = tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length;
    
    return { total, pending, completed, open };
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  }, [tickets]);

  // Mock data for charts
  const weeklyData = [
    { name: 'Mon', requests: 4 },
    { name: 'Tue', requests: 7 },
    { name: 'Wed', requests: 5 },
    { name: 'Thu', requests: 10 },
    { name: 'Fri', requests: 6 },
    { name: 'Sat', requests: 2 },
    { name: 'Sun', requests: 1 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser.name.split(' ')[0]}</h1>
          <p className="text-muted-foreground text-sm mt-1">Here is what&apos;s happening with your operations today.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/tickets/new" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black">
            New Request
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl executive-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Tickets</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight">{stats.total}</span>
            <span className="text-xs text-green-600 font-medium flex items-center"><ArrowUpRight className="h-3 w-3 mr-0.5" /> +12%</span>
          </div>
        </div>

        <div className="rounded-xl executive-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Open Issues</h3>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight">{stats.open}</span>
            <span className="text-xs text-red-600 font-medium flex items-center"><ArrowUpRight className="h-3 w-3 mr-0.5" /> +2%</span>
          </div>
        </div>

        <div className="rounded-xl executive-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Approvals</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-semibold tracking-tight">{stats.pending}</span>
          </div>
        </div>

        <div className="rounded-xl executive-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-tight">{stats.completed}</span>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-3">
        <div className="md:col-span-4 lg:col-span-2 rounded-xl executive-card p-6 shadow-sm flex flex-col">
          <h3 className="font-semibold mb-6">Activity Volume</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />
                <RechartsTooltip cursor={{ fill: 'var(--color-muted)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="requests" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="md:col-span-3 lg:col-span-1 rounded-xl executive-card p-0 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold">Recent Activity</h3>
            <Link href="/tickets" className="text-sm text-muted-foreground hover:text-foreground">View all</Link>
          </div>
          <div className="flex-1 overflow-y-auto w-full">
            <div className="divide-y divide-border">
              {recentTickets.map(ticket => (
                <Link href={`/tickets/${ticket.id}`} key={ticket.id} className="block p-5 hover:bg-surface-hover transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                    <Badge variant={
                      ticket.status === 'completed' || ticket.status === 'approved' ? 'success' :
                      ticket.status === 'pending-approval' ? 'warning' :
                      ticket.status === 'rejected' ? 'error' : 'default'
                    }>
                      {ticket.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-medium line-clamp-1 mb-1">{ticket.title}</h4>
                  <p className="text-xs text-muted-foreground">{format(new Date(ticket.updatedAt), 'MMM d, h:mm a')}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
