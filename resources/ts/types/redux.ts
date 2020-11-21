import { User, UserWithId, Post } from './models';

export type Payload = User[] | Post[] | UserWithId[];

export interface State {
    [index: string]: Payload;
    users: User[];
    posts: Post[];
    suggestedUsers: UserWithId[];
}

export interface SetItem {
    type: 'SET';
    name: string;
    payload: Payload;
}

export interface AddItem {
    type: 'ADD';
    payload: Post;
}

export interface UpdateItem {
    type: 'UPDATE';
    id: number;
    payload: Post;
}

export interface DeleteItem {
    type: 'DESTROY';
    id: number;
}
