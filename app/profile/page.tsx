'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, User, Mail, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { currentUser, updateProfile } = useAppStore();
  
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setAvatar(currentUser.avatar);
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, email, avatar });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit} className="divide-y divide-border">
          <div className="p-6 md:p-8 space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                <div className="pt-2 flex items-center gap-2">
                  <input 
                    type="url" 
                    placeholder="Enter image URL" 
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="text-sm border border-border bg-background rounded px-2 py-1 max-w-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" /> Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Role</label>
              <input
                type="text"
                disabled
                className="w-full rounded-md border border-border bg-muted text-muted-foreground px-3 py-2 text-sm cursor-not-allowed capitalize"
                value={currentUser.role}
              />
              <p className="text-xs text-muted-foreground">Your role is managed by administrators.</p>
            </div>
          </div>

          <div className="p-6 bg-surface-hover flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isSaved && (
                <span className="flex items-center text-green-600 dark:text-green-500 font-medium">
                  <CheckCircle2 className="h-4 w-4 mr-1.5" /> Changes saved to local database
                </span>
              )}
            </div>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
