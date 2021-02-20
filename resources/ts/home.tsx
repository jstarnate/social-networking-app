import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Home from './components/Home';
import store from './data/store';

render(
    <Provider store={store}>
        <Helmet>
            <title>Home</title>
        </Helmet>

        <BrowserRouter>
            <Home />
        </BrowserRouter>
    </Provider>,
    document.querySelector('#home')
);
