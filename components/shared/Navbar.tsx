'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import WalletButton from './WalletButton';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide globally overlapping nav on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null; 
  }

  const role = session?.user?.role;
  const dashPath = role === 'creator' ? '/creator/dashboard' : '/voter/dashboard';

  const navLinks = [
    { label: 'Explore Polls', href: '/poll/explore' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
  ];

  return (
    <nav className="sticky top-0 w-full h-16 bg-[rgba(0,8,15,0.85)] border-b border-cyan-500/10 backdrop-blur-md z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <Link href="/" className="text-2xl font-bold gradient-text z-50">
          PollChain
        </Link>

        {/* Center (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive 
                    ? 'text-cyan-400 border-b-2 border-cyan-400 gradient-text' 
                    : 'text-slate-300 hover:text-cyan-300'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <WalletButton />
          
          {session ? (
            <Link href={dashPath} className="btn-primary py-1.5 px-5 text-sm">
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="btn-secondary text-sm py-1.5 px-4">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-1.5 px-4">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-slate-300 hover:text-cyan-400 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Slide-down Panel */}
      <div 
        className={`md:hidden absolute top-[64px] left-0 w-full bg-[rgba(0,13,26,0.95)] backdrop-blur-lg border-b border-cyan-500/10 transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0 py-0 border-opacity-0'
        }`}
      >
        <div className="flex flex-col px-6 gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 font-medium py-2"
            >
              {link.label}
            </Link>
          ))}
          
          <div className="w-full h-px bg-cyan-500/10 my-2" />
          
          <div className="flex flex-col gap-3">
            <div className="flex justify-center mb-2">
              <WalletButton />
            </div>
            {session ? (
              <Link 
                href={dashPath} 
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary text-center py-2"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
                <Link href="/signup" className="btn-primary text-center py-2" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
