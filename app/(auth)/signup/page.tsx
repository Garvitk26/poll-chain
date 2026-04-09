'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { BarChart2, CheckSquare, ChevronLeft } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initRole = searchParams.get('role');

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'creator' | 'voter'>(
    (initRole === 'creator' || initRole === 'voter') ? initRole : 'creator'
  );

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length > 7) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-500', 'bg-cyan-500'];

  const handleRoleSelect = (selectedRole: 'creator' | 'voter') => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      const signInRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.ok) {
        router.push(role === 'creator' ? '/creator/dashboard' : '/voter/dashboard');
      } else {
        router.push('/login');
      }
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to create account');
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold gradient-text mb-4">Join PollChain</h1>
          <p className="text-slate-400">Choose your role to get started</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Creator Card */}
          <button 
            onClick={() => handleRoleSelect('creator')}
            className="flex flex-col items-start p-8 bg-[#000d1a] border border-cyan-500/20 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:border-cyan-500/50 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">I'm a Poll Creator</h2>
            <p className="text-slate-400 mb-8 h-12">Launch polls and get verifiable on-chain results</p>
            <ul className="space-y-3 text-sm text-slate-300 flex-grow">
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">✓</span> Create unlimited polls
              </li>
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">✓</span> Real-time Stellar vote tracking
              </li>
              <li className="flex items-center">
                <span className="text-cyan-400 mr-2">✓</span> Share public vote links
              </li>
            </ul>
          </button>

          {/* Voter Card */}
          <button 
            onClick={() => handleRoleSelect('voter')}
            className="flex flex-col items-start p-8 bg-[#000d1a] border border-indigo-500/20 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:border-indigo-500/50 text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">I'm a Voter</h2>
            <p className="text-slate-400 mb-8 h-12">Cast tamper-proof votes with your Stellar wallet</p>
            <ul className="space-y-3 text-sm text-slate-300 flex-grow">
              <li className="flex items-center">
                <span className="text-indigo-400 mr-2">✓</span> Vote with Freighter wallet
              </li>
              <li className="flex items-center">
                <span className="text-indigo-400 mr-2">✓</span> Verify your vote on Stellar Explorer
              </li>
              <li className="flex items-center">
                <span className="text-indigo-400 mr-2">✓</span> Discover public polls
              </li>
            </ul>
          </button>
        </div>
        <div className="mt-10">
          <Link href="/login" className="text-slate-400 hover:text-cyan-400 transition-colors">
            Already have an account? Sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#000d1a] border border-cyan-500/20 rounded-xl p-8 shadow-[0_0_40px_rgba(6,182,212,0.05)] relative">
        <button 
          onClick={() => setStep(1)}
          className="absolute top-8 left-8 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Create Account</h2>
          <div className="flex justify-center mt-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${role === 'creator' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'}`}>
              {role === 'creator' ? 'Poll Creator' : 'Voter'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              required
              className="input-field w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email address"
              required
              className="input-field w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              required
              className="input-field w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Strength Meter */}
            {password.length > 0 && (
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level} 
                    className={`h-1 flex-1 rounded-full ${strength >= level ? strengthColors[strength - 1] || 'bg-cyan-500' : 'bg-slate-800'}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Confirm Password"
              required
              className={`input-field w-full ${confirmPassword && confirmPassword !== password ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/50' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword && confirmPassword === password && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-500 text-xs font-bold font-mono">
                MATCH
              </span>
            )}
          </div>

          {error && <p className="text-rose-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 rounded-md font-medium text-white transition-all duration-300 relative overflow-hidden ${role === 'creator' ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:-translate-y-1' : 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:-translate-y-1'}`}
          >
            {loading ? <div className="spin-ring border-white/30 border-t-white" /> : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  );
}
