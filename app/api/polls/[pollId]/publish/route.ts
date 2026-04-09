import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function POST(request: Request, { params }: { params: { pollId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'creator') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const poll = await Poll.findOne({ _id: params.pollId, creatorId: session.user.id });
    
    if (!poll) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    if (poll.status !== 'draft') return NextResponse.json({ error: 'Only drafts can be published' }, { status: 400 });

    poll.status = 'active';
    await poll.save();

    return NextResponse.json({ success: true, status: poll.status });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
