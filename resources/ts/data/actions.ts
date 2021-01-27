import { UserWithId, Post } from 'types/models';
import {
    Payload,
    SetItem,
    PushAdd,
    UnshiftAdd,
    PushSpread,
    UnshiftSpread,
    UpdatePost,
    DeletePost,
} from 'types/redux';

export const set = (name: string, payload: Payload): SetItem => ({
    type: 'SET',
    name,
    payload,
});

export const pushAdd = (name: string, payload: UserWithId | Post): PushAdd => ({
    type: 'PUSH_ADD',
    name,
    payload,
});

export const unshiftAdd = (
    name: string,
    payload: UserWithId | Post
): UnshiftAdd => ({
    type: 'UNSHIFT_ADD',
    name,
    payload,
});

export const pushSpread = (
    name: string,
    payload: (UserWithId | Post)[]
): PushSpread => ({
    type: 'PUSH_SPREAD',
    name,
    payload,
});

export const unshiftSpread = (
    name: string,
    payload: (UserWithId | Post)[]
): UnshiftSpread => ({
    type: 'UNSHIFT_SPREAD',
    name,
    payload,
});

export const updatePost = (id: number, payload: Post): UpdatePost => ({
    type: 'UPDATE_POST',
    id,
    payload,
});

export const deletePost = (id: number): DeletePost => ({
    type: 'DELETE_POST',
    id,
});
