'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { Search, Filter, MoreHorizontal, Check, X } from 'lucide-react';
import { TicketStatus } from '@/lib/types';

export default function TicketsPage() {
  const { tickets, users, updateTicketStatus, currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, search, statusFilter]);

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets & Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage all internal operations requests.</p>
        </div>
        <div>
          <Link href="/tickets/new" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            New Request
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 border-b border-border pb-4">
        <div className="relative w-full max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            className="block h-9 w-full rounded-md executive-card pl-9 pr-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Search tickets by ID, Title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center h-9 rounded-md executive-card px-3 text-sm text-muted-foreground">
            <Filter className="h-4 w-4 mr-2" />
            <select
              className="bg-transparent focus:outline-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {selectedTickets.length > 0 && (
        <div className="bg-muted border border-border rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <span className="text-sm font-medium">{selectedTickets.length} items selected</span>
          <div className="flex gap-2">
            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <>
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
              </>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSelectedTickets([])}>Clear</Button>
          </div>
        </div>
      )}

      <div className="executive-card rounded-xl shadow-sm overflow-hidden line-clamp-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
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
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Priority</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Assignee</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Created</th>
                <th className="px-4 py-3 w-[40px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No tickets found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => {
                  const assignee = getUser(ticket.assigneeId);
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
                      <td className="px-4 py-3">
                        <Badge variant={
                          ticket.status === 'completed' || ticket.status === 'approved' ? 'success' :
                          ticket.status === 'pending-approval' ? 'warning' :
                          ticket.status === 'rejected' ? 'error' : 'default'
                        }>
                          {ticket.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="capitalize text-xs font-medium text-muted-foreground">{ticket.priority}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {assignee ? (
                          <div className="flex items-center gap-2">
                            <img src={assignee.avatar} className="w-5 h-5 rounded-full" alt="" />
                            <span className="text-xs">{assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Unassigned</span>
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
