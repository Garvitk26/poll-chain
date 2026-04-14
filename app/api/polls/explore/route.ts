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
      
    // Return all necessary fields for the UI (PollCard needs options for badges)
    const transformed = polls.map((p: any) => ({
       _id: p._id.toString(),
       id: p._id.toString(),
       title: p.title,
       description: p.description,
       status: p.status,
       totalVotes: p.totalVotes,
       options: p.options || [],
       optionsCount: p.options?.length || 0,
       createdAt: p.createdAt
    }));

    return NextResponse.json({ polls: transformed });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
