'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SessionWatcher() {
  const { data: session } = useSession();
  const router = useRouter();

  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  // 60 minutes = 3600000 ms
  const INACTIVITY_LIMIT = 60 * 60 * 1000;
  
  useEffect(() => {
    if (!session) return;
    
    let interval: NodeJS.Timeout;

    const checkActivity = () => {
      const now = Date.now();
      const diff = now - lastActivity;

      if (diff > INACTIVITY_LIMIT && !showModal) {
        setShowModal(true);
        setTimeLeft(300);
      }
    };

    interval = setInterval(checkActivity, 10000);
    return () => clearInterval(interval);
  }, [session, lastActivity, showModal, INACTIVITY_LIMIT]);

  useEffect(() => {
    if (showModal && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showModal && timeLeft === 0) {
      // Auto logout
      setShowModal(false);
      signOut({ callbackUrl: '/login' });
    }
  }, [showModal, timeLeft]);

  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());

    // Only attach listeners if session exists and modal is NOT shown
    if (session && !showModal) {
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('click', handleActivity);
      window.addEventListener('scroll', handleActivity);
    }

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [session, showModal]);

  const handleStaySignedIn = () => {
    setLastActivity(Date.now());
    setShowModal(false);
  };

  const handleSignOut = () => {
    setShowModal(false);
    signOut({ callbackUrl: '/login' });
  };

  if (!showModal) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm min-h-[500px]">
      <div className="bg-[#000d1a] border border-rose-500/20 p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold gradient-text mb-4">Inactivity Warning</h2>
        <p className="text-slate-300 mb-2">You will be signed out due to inactivity in:</p>
        <div className="text-3xl font-mono-hash text-rose-400 mb-8">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={handleStaySignedIn}
            className="w-full bg-gradient-to-r from-rose-500 to-violet-500 text-white font-medium py-2 rounded-md hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            Stay Signed In
          </button>
          <button 
            onClick={handleSignOut}
            className="w-full bg-transparent text-slate-400 hover:text-white py-2 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
