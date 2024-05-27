import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  favorites: string[];
  history: { word: string; added: Date }[];
}

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
