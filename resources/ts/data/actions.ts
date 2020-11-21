import { Post } from 'types/models';
import { Payload, SetItem, AddItem, UpdateItem, DeleteItem } from 'types/redux';

export const set = (name: string, payload: Payload): SetItem => ({
    type: 'SET',
    name,
    payload,
});

export const add = (payload: Post): AddItem => ({
    type: 'ADD',
    payload,
});

export const update = (id: number, payload: Post): UpdateItem => ({
    type: 'UPDATE',
    id,
    payload,
});

export const destroy = (id: number): DeleteItem => ({
    type: 'DESTROY',
    id,
});
