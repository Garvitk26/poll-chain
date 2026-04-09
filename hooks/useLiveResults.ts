'use client';

import { useState, useEffect } from 'react';

export function useLiveResults(pollId: string | undefined, enabled: boolean = true) {
  const [results, setResults] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pollId || !enabled) {
      setLoading(false);
      return;
    }

    let intervalId: NodeJS.Timeout;

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/polls/${pollId}/results`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.options || []);
          setVotes(data.votes || []);
          setTotalVotes(data.totalVotes || 0);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error('Failed to fetch live results', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
    intervalId = setInterval(fetchResults, 10000); // polls every 10s

    return () => clearInterval(intervalId);
  }, [pollId, enabled]);

  return { results, votes, totalVotes, lastUpdated, loading };
}
