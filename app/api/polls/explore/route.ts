import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectDB();
    // Only return active and public polls
    const polls = await Poll.find({ status: 'active', isPublic: true })
      .select('-collectorSecretEncrypted')
      .sort({ createdAt: -1 })
      .limit(50);
      
    // Transform options to include optionsCount needed by UI
    const transformed = polls.map((p: any) => ({
       id: p._id.toString(),
       title: p.title,
       description: p.description,
       status: p.status,
       totalVotes: p.totalVotes,
       optionsCount: p.options?.length || 0,
       createdAt: p.createdAt
    }));

    return NextResponse.json({ polls: transformed });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
