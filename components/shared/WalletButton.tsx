'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signIn } from 'next-auth/react';
// @ts-ignore
import { 
  isConnected, 
  getPublicKey, 
  setAllowed
} from '@stellar/freighter-api';
import { ChevronDown, LogOut } from 'lucide-react';
import { useToast } from '@/lib/context/ToastContext';
import { useRouter } from 'next/navigation';

export default function WalletButton() {
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  
  const [address, setAddress] = useState<string>('');
  const [isInstalled, setIsInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkInstalled = async () => {
      try {
        const connected = await isConnected();
        setIsInstalled(!!connected);
      } catch (e) {
        setIsInstalled(false);
      }
    };
    checkInstalled();

    if (session?.user?.linkedWallet) {
      setAddress(session.user.linkedWallet);
    }
  }, [session]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConnect = async () => {
    if (!isInstalled) {
      window.open('https://freighter.app', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      await setAllowed();
      const pubKey = await getPublicKey();
      
      if (!pubKey) throw new Error('Freighter failed to return a public key');

      if (session?.user) {
        // Link wallet if logged in
        const res = await fetch('/api/user/link-wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: pubKey }),
        });
        if (res.ok) {
          setAddress(pubKey);
          update({ linkedWallet: pubKey });
          showToast('Wallet successfully linked', 'success');
        } else {
          const data = await res.json();
          showToast(data.error || 'Failed to link wallet', 'error');
        }
      } else {
        // Wallet login flow
        const res = await signIn('credentials', {
          redirect: false,
          walletAddress: pubKey,
        });

        if (res?.error) {
           showToast(res.error, 'error');
        } else {
           showToast('Signed in with wallet', 'success');
           setAddress(pubKey);
           router.refresh();
        }
      }
    } catch (e: any) {
      showToast(e.message || 'Verification failed', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAddress('');
    if (session?.user) {
      update({ linkedWallet: null }); // In a real app we'd call an API to unlink
    }
    setDropdownOpen(false);
    showToast('Wallet disconnected', 'info');
  };

  if (!isInstalled) {
    return (
      <button 
        onClick={handleConnect}
        className="btn-secondary flex items-center text-sm py-1.5 px-4"
      >
        Install Freighter
      </button>
    );
  }

  if (isConnecting) {
    return (
      <button disabled className="btn-secondary flex items-center gap-2 cursor-not-allowed opacity-80 text-sm py-1.5 px-4">
        <div className="w-4 h-4 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        Connecting...
      </button>
    );
  }

  if (address) {
    const truncate = `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-[#001224] border border-cyan-500/30 hover:border-cyan-400 text-slate-200 transition-colors rounded-full pl-3 pr-2 py-1.5 text-sm font-mono-hash"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_var(--cyan)] animate-pulse" />
          {truncate}
          <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#000d1a] border border-cyan-500/20 rounded-md shadow-xl py-1 z-50">
            <button
              onClick={handleDisconnect}
              className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      className="btn-secondary text-sm py-1.5 px-4"
    >
      Connect Wallet
    </button>
  );
}
