import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { getVotesFromHorizon } from '@/lib/stellar';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { pollId: string } }) {
  try {
    await connectDB();
    const poll = await Poll.findById(params.pollId).select('-collectorSecretEncrypted');
    
    if (!poll) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const { tally, totalVotes } = await getVotesFromHorizon(poll.collectorWallet, poll.options);

    return NextResponse.json({ 
      options: tally,
      totalVotes,
      status: poll.status 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
