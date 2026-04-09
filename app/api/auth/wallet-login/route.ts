import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ linkedWallet: walletAddress });

    if (!user) {
      return NextResponse.json({ error: 'No account linked to this wallet' }, { status: 404 });
    }

    user.lastLogin = new Date();
    await user.save();

    return NextResponse.json({ user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      linkedWallet: user.linkedWallet,
      avatarColor: user.avatarColor,
      rememberMe: user.rememberMe,
    } }, { status: 200 });

  } catch (error) {
    console.error('Wallet login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
