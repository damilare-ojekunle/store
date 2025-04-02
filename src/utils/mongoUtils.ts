import { Types } from 'mongoose';

export function ensureObjectId(id: string | Types.ObjectId): Types.ObjectId {
    if (typeof id === 'string') {
        return new Types.ObjectId(id);
    }
    return id;
}

export function ensureString(id: string | Types.ObjectId): string {
    if (typeof id === 'string') return id;
    return id.toString();
}