import { createStore, StoreEnhancer } from 'redux';
import reducer from './reducer';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer;
    }
}

const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
