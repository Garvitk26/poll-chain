import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    if (role !== 'creator' && role !== 'voter') {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already taken' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const colors = ['#06b6d4', '#6366f1', '#8b5cf6', '#d946ef', '#f59e0b', '#f43f5e', '#0ea5e9'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      avatarColor: randomColor,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
