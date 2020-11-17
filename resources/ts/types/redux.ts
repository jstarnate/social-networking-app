import { User, UserWithId, Post } from './models';

export type Payload = User[] | Post[] | UserWithId[];

export interface State {
    [index: string]: User[] | Post[] | UserWithId[];
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
    name: string;
    payload: User | Post;
}
