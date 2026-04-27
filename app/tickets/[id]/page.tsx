'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';
import { 
  ArrowLeft, Check, X, Clock, MessageSquare, AlertCircle, Calendar, User as UserIcon
} from 'lucide-react';

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { tickets, users, currentUser, updateTicketStatus, addComment } = useAppStore();
  const [newComment, setNewComment] = useState('');

  const ticket = tickets.find(t => t.id === params.id);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-xl font-bold mb-2">Ticket not found</h2>
        <p className="text-muted-foreground mb-4">The request you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button variant="outline" onClick={() => router.push('/tickets')}>Back to Tickets</Button>
      </div>
    );
  }

  const creator = users.find(u => u.id === ticket.creatorId);
  const assignee = users.find(u => u.id === ticket.assigneeId);

  const canApprove = (currentUser.role === 'admin' || currentUser.role === 'manager') && ticket.status === 'pending-approval';

  const handlePostComment = () => {
    if (newComment.trim()) {
      addComment(ticket.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-20">
      <div className="flex items-center gap-4 text-sm">
        <button onClick={() => router.push('/tickets')} className="text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="font-mono text-muted-foreground">{ticket.id}</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold tracking-tight">{ticket.title}</h1>
            <Badge variant={
              ticket.status === 'completed' || ticket.status === 'approved' ? 'success' :
              ticket.status === 'pending-approval' ? 'warning' :
              ticket.status === 'rejected' ? 'error' : 'default'
            }>
              {ticket.status.replace('-', ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm flex items-center gap-4">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
            {creator && (
               <span className="flex items-center gap-1">by {creator.name}</span>
            )}
          </p>
        </div>

        {canApprove && (
          <div className="flex gap-2 shrink-0 bg-surface p-2 rounded-lg border border-border shadow-sm">
            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateTicketStatus(ticket.id, 'rejected')}>
              <X className="w-4 h-4 mr-2" /> Reject
            </Button>
            <Button variant="primary" onClick={() => updateTicketStatus(ticket.id, 'approved')}>
              <Check className="w-4 h-4 mr-2" /> Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-surface rounded-xl border border-border p-6 shadow-sm">
            <h3 className="font-semibold mb-4 text-foreground">Description</h3>
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-4 text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Activity & Comments
            </h3>
            
            <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-surface-hover">
                <div className="flex gap-3">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full border border-border" />
                  <div className="flex-1 space-y-2">
                    <textarea 
                      placeholder="Add a comment or update..." 
                      className="w-full text-sm rounded-md executive-card p-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px] resize-y transition-colors"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button variant="primary" size="sm" disabled={!newComment.trim()} onClick={handlePostComment}>
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {[...ticket.history, ...ticket.comments] // Combine and sort
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((item) => {
                    const isComment = 'content' in item;
                    const actor = users.find(u => u.id === (isComment ? (item as any).authorId : (item as any).actorId));
                    
                    if (isComment) {
                      return (
                        <div key={item.id} className="flex gap-4">
                           <img src={actor?.avatar} alt="" className="w-8 h-8 rounded-full border border-border shrink-0 object-cover" />
                           <div className="flex-1 bg-surface-hover rounded-md border border-border p-3 text-sm">
                             <div className="flex items-baseline justify-between mb-1">
                               <span className="font-medium text-foreground">{actor?.name}</span>
                               <span className="text-xs text-muted-foreground">{format(new Date(item.createdAt), 'MMM d, h:mm a')}</span>
                             </div>
                             <p className="text-foreground whitespace-pre-wrap">{(item as any).content}</p>
                           </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={item.id} className="flex gap-4 items-center">
                          <div className="w-8 shrink-0 flex justify-center">
                            <div className="w-2 h-2 bg-border rounded-full"></div>
                          </div>
                          <div className="flex-1 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{actor?.name}</span>
                            {' '} {(item as any).action}
                            {(item as any).detail && <span className="font-medium text-foreground"> {(item as any).detail}</span>}
                            <span className="text-muted-foreground ml-2 text-xs">{format(new Date(item.createdAt), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      )
                    }
                  })}
              </div>
            </div>
          </section>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface rounded-xl border border-border p-5 shadow-sm space-y-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Details</h3>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><UserIcon className="w-3.5 h-3.5" /> Assignee</div>
              {assignee ? (
                 <div className="flex items-center gap-2">
                   <img src={assignee.avatar} className="w-6 h-6 rounded-full border border-border" alt=""/>
                   <span className="text-sm font-medium">{assignee.name}</span>
                 </div>
              ) : (
                <span className="text-sm italic text-muted-foreground">Unassigned</span>
              )}
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> Priority</div>
              <span className="text-sm font-medium capitalize">{ticket.priority}</span>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Updated</div>
              <span className="text-sm font-medium">{format(new Date(ticket.updatedAt), 'MMM d, yyyy h:mm a')}</span>
            </div>

            {currentUser.role === 'admin' || currentUser.role === 'manager' ? (
              <div className="pt-4 border-t border-border">
                 <div className="text-xs text-muted-foreground mb-2">Change Status</div>
                 <select 
                    className="w-full text-sm border border-border rounded bg-surface px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending-approval">Pending Approval</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                 </select>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
