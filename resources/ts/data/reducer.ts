import { Post } from 'types/models';
import { State, SetItem, AddItem, UpdateItem, DeleteItem } from 'types/redux';
import initialState from './state';

export default (
    state = initialState,
    action: SetItem | AddItem | UpdateItem | DeleteItem
): State => {
    if (action.type === 'SET') {
        state[action.name] = action.payload;

        return state;
    }

    if (action.type === 'ADD') {
        const posts: Post[] = state.posts;

        state.posts = [action.payload, ...posts];

        return state;
    }

    if (action.type === 'UPDATE') {
        const mapped = state.posts.map(post => {
            if (post.id === action.id) {
                post = action.payload;
            }

            return post;
        });

        state.posts = mapped;

        return state;
    }

    if (action.type === 'DESTROY') {
        const filtered = state.posts.filter(post => post.id !== action.id);

        state.posts = filtered;

        return state;
    }

    return state;
};
