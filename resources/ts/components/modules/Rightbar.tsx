import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'helpers/Spinner';
import SuggestedUsers from 'modules/rightbar/SuggestedUsers';
import Filterer from 'modules/rightbar/Filterer';
import { set } from 'actions';

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

    if (loading) {
        return (
            <aside className='rightbar'>
                <div className='pos--fixed bg--primary-pale bl--1 brdr--primary pd-t--lg pd-l--lg pd-r--lg rightbar__wrap'>
                    <Spinner size={40} color='#7EAEE7' />
                </div>
            </aside>
        );
    }

    return (
        <aside className='rightbar'>
            <div className='pos--fixed bg--primary-pale bl--1 brdr--primary pd-t--lg pd-l--lg pd-r--lg rightbar__wrap'>
                <Switch>
                    <Route exact path='/users/search' component={Filterer} />
                    <Route component={SuggestedUsers} />
                </Switch>
            </div>
        </aside>
    );
}

export default Rightbar;
