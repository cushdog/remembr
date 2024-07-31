import mongoose, { Document, Model, Schema } from 'mongoose';

interface INote {
  content: string;
  emotion: string;
  createdAt: Date;
}

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  notes: INote[];
}

const noteSchema: Schema<INote> = new Schema({
  content: { type: String, required: true },
  emotion: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: [noteSchema],
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;