import { UserWithId, Post } from './models';

export type Payload = (UserWithId | Post)[] | boolean;

export interface State {
    [index: string]: Payload;
    users: UserWithId[];
    usersLoading: boolean;
    posts: Post[];
    suggestedUsers: UserWithId[];
}

export interface SetItem {
    type: 'SET';
    name: string;
    payload: Payload;
}

export interface PushAdd {
    type: 'PUSH_ADD';
    name: string;
    payload: UserWithId | Post;
}

export interface UnshiftAdd {
    type: 'UNSHIFT_ADD';
    name: string;
    payload: UserWithId | Post;
}

export interface PushSpread {
    type: 'PUSH_SPREAD';
    name: string;
    payload: Payload;
}

export interface UnshiftSpread {
    type: 'UNSHIFT_SPREAD';
    name: string;
    payload: Payload;
}

export interface UpdatePost {
    type: 'UPDATE_POST';
    id: number;
    payload: Post;
}

export interface DeletePost {
    type: 'DELETE_POST';
    id: number;
}
