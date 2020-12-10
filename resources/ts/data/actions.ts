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

type SingleData = UserWithId | Post;

export const set = (name: string, payload: Payload): SetItem => ({
    type: 'SET',
    name,
    payload,
});

export const pushAdd = (name: string, payload: SingleData): PushAdd => ({
    type: 'PUSH_ADD',
    name,
    payload,
});

export const unshiftAdd = (name: string, payload: SingleData): UnshiftAdd => ({
    type: 'UNSHIFT_ADD',
    name,
    payload,
});

export const pushSpread = (name: string, payload: Payload): PushSpread => ({
    type: 'PUSH_SPREAD',
    name,
    payload,
});

export const unshiftSpread = (
    name: string,
    payload: Payload
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
