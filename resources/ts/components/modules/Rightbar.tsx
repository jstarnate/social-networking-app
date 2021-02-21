import { lazy, Suspense, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchBar from 'modules/rightbar/SearchBar';
import SuggestedUsers from 'modules/rightbar/SuggestedUsers';
import Spinner from 'helpers/Spinner';
import { State } from 'types/redux';
import { set } from 'actions';

const Filterer = lazy(() => import('modules/rightbar/Filterer'));

function Rightbar() {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const screenWidth = useSelector((state: State) => state.screenWidth);
    const openRightbar = useSelector((state: State) => state.openRightbar);
    const { pathname } = useLocation();
    const status = screenWidth <= 1024 && openRightbar ? 'rightbar--open' : '';

    function getSuggestedUsers() {
        setLoading(true);

        axios
            .get('/api/users/suggested')
            .then(({ data }) => {
                dispatch(set('suggestedUsers', data.users));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    function hideRightbar() {
        dispatch(set('openRightbar', false));
    }

    useEffect(() => {
        getSuggestedUsers();
    }, []);

    useEffect(() => {
        if (screenWidth <= 1024 && screenWidth > 785 && openRightbar) {
            dispatch(set('openRightbar', false));
        }
    }, [pathname]);

    return (
        <aside className='pos--rel rightbar'>
            <div
                className={`pos--fixed bg--white bl--1 brdr--primary-light pd--md rightbar__wrap ${status}`}>
                <div className='d--flex'>
                    {screenWidth <= 1024 && (
                        <button className='btn mg-r--sm' onClick={hideRightbar}>
                            <i className='fa fa-arrow-right font--lg text--black-light'></i>
                        </button>
                    )}

                    <SearchBar />
                </div>

                {loading ? (
                    <Spinner containerClassName='mg-t--md' />
                ) : (
                    <Switch>
                        <Route exact path='/users/search'>
                            <Suspense
                                fallback={
                                    <Spinner containerClassName='mg-t--md' />
                                }>
                                <Filterer />
                            </Suspense>
                        </Route>
                        <Route component={SuggestedUsers} />
                    </Switch>
                )}
            </div>
        </aside>
    );
}

export default Rightbar;
