import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import Vote from '@/lib/models/Vote';
import { getTransactionDetail } from '@/lib/stellar';

export async function POST(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const { txHash } = await request.json();
    if (!txHash) return NextResponse.json({ error: 'txHash is required' }, { status: 400 });

    await connectDB();
    const poll = await Poll.findById(params.pollId);
    
    if (!poll || poll.status !== 'active') {
      return NextResponse.json({ error: 'Poll is not active' }, { status: 400 });
    }

    // Verify on Horizon
    const txDetail = await getTransactionDetail(txHash);
    if (!txDetail) {
      return NextResponse.json({ error: 'Transaction not found on Horizon' }, { status: 400 });
    }

    const { memo, sourceAccount: voterWallet, createdAt } = txDetail;

    // Check unique
    const existingTx = await Vote.findOne({ txHash });
    if (existingTx) return NextResponse.json({ error: 'Duplicate transaction' }, { status: 400 });

    // Check one vote per wallet
    const priorVote = await Vote.findOne({ pollId: poll._id.toString(), voterWallet });
    if (priorVote) return NextResponse.json({ error: 'Wallet has already voted on this poll' }, { status: 400 });

    const option = poll.options.find((o: any) => o.memo === memo);
    if (!option) return NextResponse.json({ error: 'Invalid option memo recorded' }, { status: 400 });

    const vote = new Vote({
      pollId: poll._id.toString(),
      voterWallet,
      optionId: option.id,
      optionMemo: memo,
      txHash,
      amount: poll.voteAmount,
      confirmedAt: createdAt,
    });

    await vote.save();

    return NextResponse.json({ success: true, vote });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
