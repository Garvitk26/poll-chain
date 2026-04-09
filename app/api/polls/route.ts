import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Poll from '@/lib/models/Poll';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { generateCollectorKeypair, encryptSecret, fundWithFriendbot } from '@/lib/stellar';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'creator') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const polls = await Poll.find({ creatorId: session.user.id })
      .select('-collectorSecretEncrypted')
      .sort({ createdAt: -1 });

    return NextResponse.json({ polls });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'creator') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate bounds
    if (!data.options || data.options.length < 2 || data.options.length > 8) {
      return NextResponse.json({ error: 'Polls must contain between 2 and 8 options' }, { status: 400 });
    }
    
    const uniqueMemos = new Set();
    const cleanOptions = data.options.map((opt: any) => {
      const memo = opt.memo.substring(0, 28);
      if (uniqueMemos.has(memo)) throw new Error('Duplicate option memo');
      uniqueMemos.add(memo);
      return { id: opt.id || Math.random().toString(), label: opt.label, memo };
    });

    if (data.closesAt && new Date(data.closesAt) < new Date()) {
      return NextResponse.json({ error: 'closesAt must be in the future' }, { status: 400 });
    }

    await connectDB();

    // Generate Keypair
    const { publicKey, secretKey } = generateCollectorKeypair();
    await fundWithFriendbot(publicKey); // Fire and forget or await
    
    const encryptedSecret = encryptSecret(secretKey);

    const poll = new Poll({
      title: data.title,
      description: data.description,
      creatorId: session.user.id,
      collectorWallet: publicKey,
      collectorSecretEncrypted: encryptedSecret,
      options: cleanOptions,
      requireWallet: data.requireWallet ?? true,
      closesAt: data.closesAt,
      status: 'draft',
    });

    await poll.save();

    const result = poll.toObject();
    delete (result as any).collectorSecretEncrypted;

    return NextResponse.json({ success: true, poll: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
