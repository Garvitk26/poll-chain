import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vote from '@/lib/models/Vote';
import Poll from '@/lib/models/Poll';
import { getTransactionDetail } from '@/lib/stellar';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { txHash: string } }) {
  try {
    await connectDB();
    
    // 1. Fetch from DB
    const vote = await Vote.findOne({ txHash: params.txHash });
    
    // 2. Fetch from Horizon
    const txDetail = await getTransactionDetail(params.txHash);
    
    if (!txDetail && !vote) {
      return NextResponse.json({ error: 'Verification failed: Not found' }, { status: 404 });
    }

    let pollDetails = null;
    if (vote) {
      const poll = await Poll.findById(vote.pollId).select('title');
      pollDetails = { id: vote.pollId, title: poll?.title };
    }

    // Merge knowledge
    return NextResponse.json({ 
       verified: true,
       tx: txDetail || { hash: params.txHash, memo: vote?.optionMemo, sourceAccount: vote?.voterWallet },
       dbRecord: vote,
       poll: pollDetails
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
