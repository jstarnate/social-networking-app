import React, { FC, ReactElement, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import User from './User';
import Spinner from 'helpers/Spinner';
import { State } from 'types/redux';
import { set } from 'actions';

const useQuery = () => new URLSearchParams(useLocation().search);

const Users: FC = (): ReactElement => {
    const [ids, setIds] = useState<number[]>([]);
    const users = useSelector((state: State) => state.users);
    const usersLoading = useSelector((state: State) => state.usersLoading);
    const dispatch = useDispatch();
    const query = useQuery();
    const sq = query.get('sq');

    async function getSearchResults() {
        dispatch(set('usersLoading', true));

        const { data } = await axios.post('/api/users/search/results', {
            sq,
            ids,
        });

        dispatch(set('users', data.users));
        dispatch(set('usersLoading', false));
    }

    useEffect(() => {
        getSearchResults();
    }, []);

    return (
        <section className='flex--1 pd--lg'>
            <Helmet>
                <title>Users</title>
            </Helmet>

            {usersLoading ? (
                <Spinner />
            ) : (
                <>
                    <h3 className='text--black-light'>
                        Find people you want to follow
                    </h3>

                    <div>
                        {users.map(user => (
                            <User key={user.id} {...user} />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default Users;
