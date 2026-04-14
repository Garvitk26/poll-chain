import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getVotesFromHorizon, decryptSecret } from '@/lib/stellar';

// NOTE: Close decrypts secret server-side only in a production app if doing stellar account merges, 
// but for the audit we simply fetch final tally and lock it.
export async function POST(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'creator') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const poll = await Poll.findOne({ _id: params.pollId, creatorId: session.user.id }).select('+collectorSecretEncrypted');
    
    if (!poll) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    
    // Simulate decrypt usage server side only
    const secret = decryptSecret(poll.collectorSecretEncrypted);

    const { totalVotes } = await getVotesFromHorizon(poll.collectorWallet, poll.options);
    
    poll.totalVotes = totalVotes;
    poll.status = 'closed';
    poll.closesAt = new Date();
    await poll.save();

    return NextResponse.json({ success: true, status: poll.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
