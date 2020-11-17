import { User, Post } from 'types/models';
import { Payload } from 'types/redux';

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

export const set = (name: string, payload: Payload): SetItem => ({
    type: 'SET',
    name,
    payload,
});

export const add = (name: string, payload: User | Post): AddItem => ({
    type: 'ADD',
    name,
    payload,
});
