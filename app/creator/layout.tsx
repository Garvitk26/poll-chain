'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, PlusCircle, List, BarChart3, Settings, LogOut } from 'lucide-react';
import DashboardSkeleton from '@/components/shared/DashboardSkeleton';
import SessionWatcher from '@/components/shared/SessionWatcher';

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading') {
    return <DashboardSkeleton />;
  }

  if (status === 'unauthenticated' || !session) {
    router.push('/login?returnUrl=' + pathname);
    return null;
  }

  if (session.user.role !== 'creator') {
    router.push('/voter/dashboard');
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/creator/dashboard', icon: LayoutDashboard, color: 'text-cyan-400', activeBg: 'bg-cyan-500/10', activeBorder: 'border-cyan-400' },
    { label: 'Create Poll', href: '/creator/polls/new', icon: PlusCircle, color: 'text-indigo-400', activeBg: 'bg-indigo-500/10', activeBorder: 'border-indigo-400' },
    { label: 'My Polls', href: '/creator/polls', icon: List, color: 'text-violet-400', activeBg: 'bg-violet-500/10', activeBorder: 'border-violet-400' },
    { label: 'Analytics', href: '/creator/analytics', icon: BarChart3, color: 'text-amber-400', activeBg: 'bg-amber-500/10', activeBorder: 'border-amber-400' },
    { label: 'Settings', href: '/creator/settings/account', icon: Settings, color: 'text-slate-400', activeBg: 'bg-slate-500/10', activeBorder: 'border-slate-400' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#00080f]">
      <SessionWatcher />
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#000d1a] border-r border-cyan-500/10 hidden md:flex flex-col">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold gradient-text">
            PollChain
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/creator/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-r-md border-l-2 transition-colors ${
                  isActive 
                    ? `${item.activeBg} ${item.activeBorder} text-slate-100` 
                    : 'border-transparent text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cyan-500/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: session.user.avatarColor || '#06b6d4' }}
            >
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{session.user.name}</p>
              <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-3 py-2 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col pt-4 md:pt-8 px-4 md:px-8 pb-12">
        {children}
      </main>
    </div>
  );
}
