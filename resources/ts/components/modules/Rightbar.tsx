import { lazy, Suspense, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import SearchBar from 'modules/SearchBar';
import SuggestedUsers from 'modules/rightbar/SuggestedUsers';
import Spinner from 'helpers/Spinner';
import { set } from 'actions';

const Filterer = lazy(() => import('modules/rightbar/Filterer'));

function Rightbar() {
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        getSuggestedUsers();
    }, []);

    async function getSuggestedUsers() {
        setLoading(true);

        try {
            const { data } = await axios.get('/api/users/suggested');

            dispatch(set('suggestedUsers', data.users));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    return (
        <aside className='pos--rel rightbar'>
            <div className='pos--fixed bl--1 brdr--primary-light pd--md rightbar__wrap'>
                <SearchBar />

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
