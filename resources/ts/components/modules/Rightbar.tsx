import React, { FC, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import SuggestedUser from 'pages/general/SuggestedUser';
import Spinner from 'helpers/Spinner';
import { set } from 'actions';
import { State } from 'types/redux';

const Rightbar: FC = (): ReactElement => {
    const [loading, setLoading] = useState<boolean>(false);
    const suggestedUsers = useSelector((state: State) => state.suggestedUsers);
    const dispatch = useDispatch();

    useEffect(() => {
        getSuggestedUsers();
    }, []);

    async function getSuggestedUsers() {
        setLoading(true);

        try {
            const { data } = await axios.get('/users/suggested');

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
                <div className='d--flex ai--center'>
                    <h3 className='text--black-light'>Find friends</h3>
                    <Link
                        className='font--sm text--primary-dark text--bold mg-l--auto'
                        to='/users'>
                        Show all
                    </Link>
                </div>

                <div>
                    {suggestedUsers.map(user => (
                        <SuggestedUser key={user.id} {...user} />
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Rightbar;
