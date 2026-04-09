import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request: Request, { params }: { params: { pollId: string } }) {
  try {
    await connectDB();
    const poll = await Poll.findById(params.pollId).select('-collectorSecretEncrypted');
    
    if (!poll) return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    return NextResponse.json({ poll });
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
