import { IUser } from '@src/interfaces/IUser';
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: String }],
  history: [
    {
      word: { type: String },
      added: { type: Date, default: Date.now },
    },
  ],
});

export default model<IUser>('User', userSchema);
