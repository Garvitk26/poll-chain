'use client';

import { useSession } from 'next-auth/react';
import WalletButton from '@/components/shared/WalletButton';
import { User, ShieldCheck } from 'lucide-react';

export default function VoterProfile() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Voter Profile</h1>

      <div className="bg-[#000d1a] border border-rose-500/15 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-rose-500/10">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
            style={{ backgroundColor: session?.user?.avatarColor || '#6366f1' }}
          >
            {session?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">{session?.user?.name}</h2>
            <p className="text-sm text-slate-400">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400 mt-1">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-slate-200 mb-1">Web3 Identity</h3>
              <p className="text-sm text-slate-400 mb-3">Your wallet is used to sign transactions directly. We do not hold custody of your keys.</p>
              <WalletButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
