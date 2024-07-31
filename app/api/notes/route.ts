import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/mongodb';
import User from '@/models/User';

async function getUserFromToken(request: NextRequest) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;

  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    return {
      email: decodedToken.email,
      username: decodedToken.username,
    };
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  const user = await getUserFromToken(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content } = await request.json();

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $push: { notes: { content } } },
      { new: true }
    );
    if (updatedUser) {
      return NextResponse.json(updatedUser.notes);
    } else {
      return NextResponse.json({ error: 'Failed to add note' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add note' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
    await dbConnect();
    const user = await getUserFromToken(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const foundUser = await User.findOne({ email: user.email });
        if (foundUser) {
            return NextResponse.json(foundUser.notes);
        } else {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Failed to retrieve notes' }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();
  const user = await getUserFromToken(request);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { noteId } = await request.json();

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { $pull: { notes: { _id: noteId } } },
      { new: true }
    );
    if (updatedUser) {
      return NextResponse.json(updatedUser.notes);
    } else {
      return NextResponse.json({ error: 'Failed to delete note' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 400 });
  }
}