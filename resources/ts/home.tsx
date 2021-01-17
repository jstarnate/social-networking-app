import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Home from './components/Home';
import store from './data/store';

render(
    <Provider store={store}>
        <Home />
    </Provider>,
    document.querySelector('#home')
);
