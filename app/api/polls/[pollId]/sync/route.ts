import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { getVotesFromHorizon } from '@/lib/stellar';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'creator') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const poll = await Poll.findById(params.pollId);
    if (!poll) return NextResponse.json({ error: 'Poll Not Found' }, { status: 404 });

    // Verify ownership
    if (poll.creatorId !== session.user.id) {
       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch from Horizon
    const onChainData = await getVotesFromHorizon(poll.collectorWallet, poll.options);
    
    // Update local DB to match Horizon
    poll.totalVotes = onChainData.totalVotes;
    await poll.save();

    return NextResponse.json({ 
      success: true, 
      totalVotes: poll.totalVotes,
      onChainVotes: onChainData.votes 
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
