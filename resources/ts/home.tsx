import { render } from 'react-dom';
import { Provider } from 'react-redux';
import HomeComponent from './components/HomeComponent';
import store from './data/store';

render(
    <Provider store={store}>
        <HomeComponent />
    </Provider>,
    document.querySelector('#home')
);
