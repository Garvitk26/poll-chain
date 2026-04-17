import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sorobanServer, scValToNative } from '@/lib/stellar';
import { Address, xdr } from '@stellar/stellar-sdk';

// This would be replaced with actual contract ID after deployment
const VOTING_CONTRACT_ID = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ID || '';

export async function GET(request: Request, { params }: { params: { pollId: string } }) {
  try {
    await connectDB();
    const poll = await Poll.findById(params.pollId).select('-collectorSecretEncrypted');
    
    if (!poll) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    
    // ── BI DIRECTIONAL SYNC ───────────────────────────────────
    // If the poll is active and has a contractPollId, we sync 
    // the latest vote counts from Soroban to MongoDB.
    if (poll.status === 'active' && poll.contractPollId && VOTING_CONTRACT_ID) {
      try {
        // In a real implementation, we would query the contract here
        // simulate sync for demonstration:
        // const pollData = await sorobanServer.getContractData(...)
        console.log(`Syncing poll ${poll.contractPollId} from blockchain...`);
      } catch (e) {
        console.error('Blockchain sync failed, using DB cache');
      }
    }

    // Transform for consistency
    const pollObj = poll.toObject();
    pollObj.id = pollObj._id.toString();
    pollObj._id = pollObj._id.toString();

    return NextResponse.json({ poll: pollObj });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'creator') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!status) return NextResponse.json({ error: 'Status is required' }, { status: 400 });

    await connectDB();
    const poll = await Poll.findOne({ _id: params.pollId, creatorId: session.user.id });
    if (!poll) return NextResponse.json({ error: 'Poll Not Found' }, { status: 404 });

    poll.status = status;
    await poll.save();

    return NextResponse.json({ success: true, poll });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'creator') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const poll = await Poll.findOne({ _id: params.pollId, creatorId: session.user.id });
    
    if (!poll) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    
    await Poll.deleteOne({ _id: params.pollId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
