'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { TicketPriority } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function NewTicketPage() {
  const router = useRouter();
  const { addTicket, currentUser } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description) {
      addTicket({
        title,
        description,
        priority,
        status: 'open',
        creatorId: currentUser.id,
        assigneeId: null,
      });
      router.push('/tickets');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex items-center gap-4 text-sm">
        <button onClick={() => router.push('/tickets')} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Request</h1>
        <p className="text-muted-foreground text-sm mt-1">Submit a new operations request or ticket.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-border p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">Title <span className="text-red-500">*</span></label>
            <input
              id="title"
              type="text"
              required
              className="block w-full rounded-md executive-card px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              placeholder="e.g. Upgrade Database to v14"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              required
              rows={4}
              className="block w-full rounded-md executive-card px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-y"
              placeholder="Provide context and details about your request..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-1">Priority</label>
            <select
              id="priority"
              className="block w-full rounded-md executive-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors cursor-pointer"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => router.push('/tickets')}>Cancel</Button>
          <Button type="submit" variant="primary">Submit Request</Button>
        </div>
      </form>
    </div>
  );
}
