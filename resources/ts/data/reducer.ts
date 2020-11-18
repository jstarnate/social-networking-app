import { Post } from 'types/models';
import { State, SetItem, AddItem } from 'types/redux';
import initialState from './state';

export default (state = initialState, action: SetItem | AddItem): State => {
    if (action.type === 'SET') {
        state[action.name] = action.payload;

        return state;
    }

    if (action.type === 'ADD') {
        const posts: Post[] = state.posts;

        state.posts = [action.payload, ...posts];

        return state;
    }

    return state;
};
