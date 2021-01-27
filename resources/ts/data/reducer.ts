import { Post } from 'types/models';
import {
    State,
    SetItem,
    PushAdd,
    UnshiftAdd,
    PushSpread,
    UnshiftSpread,
    UpdatePost,
    DeletePost,
} from 'types/redux';
import initialState from './state';

type ActionType =
    | SetItem
    | PushAdd
    | UnshiftAdd
    | PushSpread
    | UnshiftSpread
    | UpdatePost
    | DeletePost;

export default (state = initialState, action: ActionType): State => {
    if (action.type === 'SET') {
        state[action.name] = action.payload;

        return state;
    }

    if (action.type === 'PUSH_ADD') {
        const name = action.name === 'users' ? 'users' : 'posts';
        state[action.name] = [...state[name], action.payload];

        return state;
    }

    if (action.type === 'UNSHIFT_ADD') {
        const name = action.name === 'users' ? 'users' : 'posts';
        state[action.name] = [action.payload, ...state[name]];

        return state;
    }

    if (action.type === 'PUSH_SPREAD') {
        const name = action.name === 'users' ? 'users' : 'posts';
        state[action.name] = [...state[name], ...action.payload];

        return state;
    }

    if (action.type === 'UNSHIFT_SPREAD') {
        const name = action.name === 'users' ? 'users' : 'posts';
        state[action.name] = [...action.payload, ...state[name]];

        return state;
    }

    if (action.type === 'UPDATE_POST') {
        const mapped = state.posts.map((item: Post) => {
            if (item.id === action.id) {
                item = action.payload;
            }

            return item;
        });

        state.posts = mapped;

        return state;
    }

    if (action.type === 'DELETE_POST') {
        const filtered = state.posts.filter(
            (post: Post) => post.id !== action.id
        );

        state.posts = filtered;

        return state;
    }

    return state;
};
