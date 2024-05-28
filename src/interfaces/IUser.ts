import { Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    favorites: string[];
    history: { word: string; added: Date }[];
}