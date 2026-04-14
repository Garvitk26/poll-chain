'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import WalletButton from '@/components/shared/WalletButton';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const [role, setRole] = useState<'creator' | 'voter'>('creator');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeLeft, setLockTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimeLeft > 0) {
      interval = setInterval(() => {
        setLockTimeLeft((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (res?.error) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (res.error.includes('locked')) {
        setIsLocked(true);
        // default 15 min for newly locked, or parse from string if possible.
        // For simplicity, lock UI for 15 minutes locally until page refresh.
        setLockTimeLeft(15 * 60); 
        setError(res.error);
      } else {
        setError(res.error);
      }
    } else {
      // Refresh the router to ensure middleware/layouts pick up the new session
      router.refresh();
      
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        // Fetch the actual session to get the real role from the server
        const { getSession } = await import('next-auth/react');
        const session = await getSession();
        const userRole = session?.user?.role || role;
        router.push(userRole === 'creator' ? '/creator/dashboard' : '/voter/dashboard');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div 
        className={`w-full max-w-md bg-[#000d1a] border border-rose-500/20 rounded-xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.05)] ${shake ? 'animate-shake' : ''}`}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">PollChain</h1>
          <p className="text-slate-400 text-sm">Tamper-proof voting on Stellar blockchain</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-[#001224] p-1 rounded-lg mb-8 relative border border-rose-500/10">
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md transition-all duration-200 ease-out"
            style={{ 
              left: role === 'creator' ? '4px' : 'calc(50%)',
              backgroundColor: role === 'creator' ? 'rgba(6,182,212,0.15)' : 'rgba(99,102,241,0.15)',
              border: `1px solid ${role === 'creator' ? 'rgba(6,182,212,0.5)' : 'rgba(99,102,241,0.5)'}`
            }}
          />
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${role === 'creator' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setRole('creator')}
          >
            Creator
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${role === 'voter' ? 'text-violet-400' : 'text-slate-400 hover:text-slate-200'}`}
            onClick={() => setRole('voter')}
          >
            Voter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              className="input-field w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLocked}
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="input-field w-full pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-400 text-sm"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-rose-500/30 text-rose-500 focus:ring-rose-500 bg-[#001224]"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLocked}
              />
              <span className="text-slate-300">Remember me</span>
            </label>
            <Link href="/contact" className="text-rose-400 hover:text-rose-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          {error && !isLocked && (
            <p className="text-rose-500 text-sm text-center">{error}</p>
          )}

          {isLocked && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center p-3 rounded-md">
              Account locked. Try again in {formatTime(lockTimeLeft)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="btn-primary w-full flex items-center justify-center py-3"
          >
            {loading ? <div className="spin-ring border-white/30 border-t-white" /> : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          New here?{' '}
          <Link href={`/signup?role=${role}`} className="text-rose-400 hover:text-rose-300 transition-colors font-medium">
            Create account
          </Link>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-rose-500/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#000d1a] px-4 text-slate-500">──── or ────</span>
          </div>
        </div>

        <div className="flex justify-center">
          <WalletButton />
        </div>
      </div>
    </main>
  );
}
