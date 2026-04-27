'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { Check, X, MoreHorizontal, AlertTriangle } from 'lucide-react';

export default function ApprovalsPage() {
  const { tickets, users, updateTicketStatus, currentUser } = useAppStore();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  // Only show pending-approval tickets for the approvals page
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => t.status === 'pending-approval')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets]);

  const toggleSelect = (id: string) => {
    setSelectedTickets(prev => prev.includes(id) ? prev.filter(tickId => tickId !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const getUser = (id: string | null) => users.find(u => u.id === id);

  if (currentUser.role === 'employee') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center executive-card rounded-xl shadow-sm mt-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground mb-4">You do not have permission to view or manage approvals. Only Managers and Admins can access this section.</p>
        <Link href="/tickets" className="text-sm font-medium hover:underline">Return to Tickets</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review requests pending your administrative approval.</p>
      </div>

      {selectedTickets.length > 0 && (
        <div className="bg-muted border border-border rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <span className="text-sm font-medium">{selectedTickets.length} items selected</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => {
              selectedTickets.forEach(id => updateTicketStatus(id, 'approved'));
              setSelectedTickets([]);
            }}>
              <Check className="h-4 w-4 mr-1" /> Approve
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              selectedTickets.forEach(id => updateTicketStatus(id, 'rejected'));
              setSelectedTickets([]);
            }}>
              <X className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedTickets([])}>Clear</Button>
          </div>
        </div>
      )}

      <div className="executive-card rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left line-clamp-none">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider bg-surface-hover border-b border-border">
              <tr>
                <th className="px-4 py-3 w-[40px]">
                  <input
                    type="checkbox"
                    className="rounded border-border text-foreground focus:ring-primary cursor-pointer"
                    checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 font-medium">Ticket ID</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Priority</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Requested By</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Requested On</th>
                <th className="px-4 py-3 w-[40px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <p className="text-foreground font-medium mb-1">You&apos;re all caught up!</p>
                    <p className="text-muted-foreground text-sm">There are no pending requests awaiting approval.</p>
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => {
                  const creator = getUser(ticket.creatorId);
                  return (
                    <tr key={ticket.id} className="hover:bg-surface-hover transition-colors group">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-border text-foreground focus:ring-primary cursor-pointer"
                          checked={selectedTickets.includes(ticket.id)}
                          onChange={() => toggleSelect(ticket.id)}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        <Link href={`/tickets/${ticket.id}`} className="hover:underline hover:text-foreground">
                          {ticket.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                        <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                          {ticket.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="capitalize text-xs font-medium text-muted-foreground">{ticket.priority}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {creator ? (
                          <div className="flex items-center gap-2">
                            <img src={creator.avatar} className="w-5 h-5 rounded-full" alt="" />
                            <span className="text-xs">{creator.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/tickets/${ticket.id}`} className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
