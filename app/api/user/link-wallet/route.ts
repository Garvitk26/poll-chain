import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    await connectDB();
    
    // Ensure this wallet isn't linked to someone else
    const existing = await User.findOne({ linkedWallet: walletAddress });
    if (existing && existing._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Wallet already linked to another account' }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.linkedWallet = walletAddress;
    await user.save();

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Link wallet error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
