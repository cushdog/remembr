import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../../utils/mongodb';
import User from '../../../models/User';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  await dbConnect();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  try {
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token, user: { name: user.name, email: user.email, username: user.name } });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
