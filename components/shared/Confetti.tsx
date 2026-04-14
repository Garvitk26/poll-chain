'use client';

import { useEffect, useState } from 'react';

const COLORS = [
  '#f43f5e', // rose
  '#6366f1', // violet
  '#8b5cf6', // violet
  '#d946ef', // pink
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#0ea5e9', // sky
  '#ffffff', // white
];

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (!active) return;

    const newParticles = Array.from({ length: 150 }).map(() => ({
      id: Math.random().toString(),
      x: Math.random() * 100, // percentage
      y: -20 - Math.random() * 20, // start above screen
      angle: Math.random() * 360,
      velocity: 1 + Math.random() * 3,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
    }));

    setParticles(newParticles);

    // Animation loop manually using RAF or just CSS transitions.
    // Given the constraints and simplicity, a CSS based approach is easiest if we render divs.
    
    // Auto cleanup after 3s
    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}vw`,
            top: `${120}vh`, // Destination
            width: `${p.size}px`,
            height: `${p.size * 2}px`,
            backgroundColor: p.color,
            transition: `top ${1.5 + Math.random() * 1.5}s cubic-bezier(.25,.46,.45,.94), transform 3s linear`,
            transform: `rotate(${p.angle + p.rotationSpeed * 300}deg)`,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{__html: `
        /* Force paint the animation immediately */
        .fixed.inset-0 > div {
          animation: dropDown 3s forwards;
        }
        @keyframes dropDown {
          0% { top: -10%; }
          100% { top: 110%; transform: rotate(720deg); }
        }
      `}} />
    </div>
  );
}

// Export a singleton function to trigger it globally if needed
let triggerFn = () => {};
export const triggerConfetti = () => triggerFn();

export function ConfettiProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    triggerFn = () => {
      setActive(true);
      setTimeout(() => setActive(false), 3100);
    };
  }, []);

  return (
    <>
      {children}
      <Confetti active={active} />
    </>
  );
}
