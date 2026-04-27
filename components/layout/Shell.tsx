'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  CheckSquare, 
  Users, 
  Settings,
  Bell,
  Search,
  Menu,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';
import { useAppStore, MOCK_USERS } from '@/lib/store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeToggle } from '@/components/ThemeToggle';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, setCurrentUserId } = useAppStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Tickets & Requests', href: '/tickets', icon: TicketIcon },
    { name: 'Approvals', href: '/approvals', icon: CheckSquare },
  ];

  if (currentUser.role === 'admin' || currentUser.role === 'manager') {
    navigation.push({ name: 'Team', href: '/team', icon: Users });
  }

  return (
    <div className="flex h-screen bg-background text-foreground font-sans antialiased overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-[#0f172a] dark:bg-[#09090b] text-slate-300 z-20 border-r border-[#1e293b] dark:border-[#27272a] shadow-xl relative">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-[#1e293b] dark:border-[#27272a]">
          <div className="font-semibold text-lg tracking-tight flex items-center gap-2 text-white">
            <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center shadow-inner">
              <span className="text-white text-xs font-bold font-mono">OP</span>
            </div>
            OpsFlow
          </div>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive ? 'bg-blue-600/20 text-blue-400 font-medium border border-blue-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent',
                  'group flex items-center px-3 py-2.5 text-sm rounded-lg transition-all duration-200'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300',
                    'mr-3 h-[18px] w-[18px] shrink-0 transition-colors'
                  )}
                  aria-hidden={true}
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-5 border-t border-[#1e293b] dark:border-[#27272a] bg-slate-900/50 dark:bg-black/20">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
            Simulate Role
          </div>
          <select 
            value={currentUser.id}
            onChange={(e) => setCurrentUserId(e.target.value)}
            className="w-full text-xs border border-transparent hover:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-800/50 text-slate-300 appearance-none cursor-pointer transition-colors"
          >
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id} className="bg-slate-800">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden z-10 relative">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-md px-4 sm:px-6 relative z-30">
          <div className="flex items-center md:hidden">
            <button type="button" className="text-muted-foreground hover:text-foreground focus:outline-none">
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden={true} />
            </button>
          </div>
          <div className="flex flex-1 items-center justify-between gap-4 md:gap-8">
            <div className="flex-1 w-full max-w-md hidden md:flex items-center ml-4">
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-muted-foreground" aria-hidden={true} />
                </div>
                <input
                  id="search-field"
                  className="block h-9 w-full rounded-md executive-card-hover pl-10 pr-3 text-sm placeholder-muted-foreground focus:bg-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Search tickets, requests, users..."
                  type="search"
                  name="search"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-auto">
              <ThemeToggle />

              <button type="button" className="text-muted-foreground hover:text-foreground transition-colors relative w-10 h-10 rounded-full flex items-center justify-center">
                <span className="sr-only">View notifications</span>
                <Bell className="h-5 w-5" aria-hidden={true} />
              </button>
              
              <div className="relative border-l border-border pl-4">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 text-left focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1 py-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="h-8 w-8 rounded-full border border-border object-cover"
                    src={currentUser.avatar}
                    alt=""
                  />
                  <div className="hidden lg:block text-sm">
                    <div className="font-medium text-foreground leading-none mb-1">{currentUser.name}</div>
                    <div className="text-xs text-muted-foreground leading-none capitalize">{currentUser.role}</div>
                  </div>
                </button>

                {showProfileMenu && (
                  <>
                    {/* Fixed overlay to catch clicks outside dropdown */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg executive-card z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="py-1">
                        <Link 
                          href="/profile" 
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-muted"
                        >
                          <UserIcon className="h-4 w-4 mr-2" />
                          Your Profile
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-background notebook-paper">
          <div className="max-w-6xl mx-auto notebook-margin pl-6 md:pl-8 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
