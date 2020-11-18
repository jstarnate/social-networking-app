import { Post } from 'types/models';
import { Payload, SetItem, AddItem } from 'types/redux';

export const set = (name: string, payload: Payload): SetItem => ({
    type: 'SET',
    name,
    payload,
});

export const add = (payload: Post): AddItem => ({
    type: 'ADD',
    payload,
});
