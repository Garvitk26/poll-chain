'use client';

import { useSession } from 'next-auth/react';
import WalletButton from '@/components/shared/WalletButton';

export default function AccountSettings() {
  const { data: session } = useSession();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Account Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your identity and associated master wallets mapping to your creator profile.</p>
      </div>

      <div className="bg-[#000d1a] border border-cyan-500/15 rounded-xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-200 mb-6 border-b border-cyan-500/10 pb-2">Profile Defaults</h2>
        
        <div className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Display Name</label>
            <input 
              type="text" 
              defaultValue={session?.user?.name || ''} 
              className="input-field max-w-sm" 
              disabled 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Registered Email</label>
            <input 
              type="email" 
              defaultValue={session?.user?.email || ''} 
              className="input-field max-w-sm opacity-60" 
              disabled 
            />
          </div>
          <div>
             <span className="block text-sm font-medium text-slate-400 mb-2">Avatar Primary Color</span>
             <div className="flex gap-3">
               {['#06b6d4', '#6366f1', '#8b5cf6', '#d946ef', '#f59e0b', '#f43f5e'].map(color => (
                 <div 
                   key={color} 
                   className={`w-8 h-8 rounded-full cursor-pointer border-2 hover:scale-110 transition-transform ${session?.user?.avatarColor === color ? 'border-white' : 'border-transparent'}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-[#000d1a] border border-indigo-500/15 rounded-xl p-6 md:p-8">
        <h2 className="text-lg font-semibold text-slate-200 mb-6 border-b border-indigo-500/10 pb-2">Web3 Integrations</h2>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#001224] p-4 border border-indigo-500/20 rounded-lg">
          <div>
            <h3 className="font-medium text-slate-200 mb-1">Freighter Linked Master Wallet</h3>
            <p className="text-sm text-slate-500">
               {session?.user?.linkedWallet 
                 ? 'This wallet will inherently sponsor fees for poll collector initializations.'
                 : 'Link your Freighter wallet to authorize deploying polls onto the Stellar testnet.'}
            </p>
          </div>
          <div>
             <WalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}
