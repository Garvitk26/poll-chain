import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { checkHasVoted } from '@/lib/stellar';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    
    if (!wallet) return NextResponse.json({ hasVoted: false });

    await connectDB();
    const poll = await Poll.findById(params.pollId);
    if (!poll) return NextResponse.json({ error: 'Not Found' }, { status: 404 });

    const hasVoted = await checkHasVoted(poll.collectorWallet, wallet);
    
    return NextResponse.json({ hasVoted });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
