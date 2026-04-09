'use client';

import React, { createContext, useContext, useState } from 'react';

interface PollContextType {
  // Add state variables here
  currentPoll: any | null;
  setCurrentPoll: (poll: any) => void;
}

const PollContext = createContext<PollContextType | undefined>(undefined);

export function PollProvider({ children }: { children: React.ReactNode }) {
  const [currentPoll, setCurrentPoll] = useState<any | null>(null);

  return (
    <PollContext.Provider value={{ currentPoll, setCurrentPoll }}>
      {children}
    </PollContext.Provider>
  );
}

export function usePoll() {
  const context = useContext(PollContext);
  if (context === undefined) {
    throw new Error('usePoll must be used within a PollProvider');
  }
  return context;
}
