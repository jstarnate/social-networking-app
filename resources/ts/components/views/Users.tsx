import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import User from 'modules/users/User';
import Spinner from 'helpers/Spinner';
import { State } from 'types/redux';
import { UserWithId } from 'types/models';
import { pushSpread } from 'actions';
import useInfiniteScroll from 'hooks/useInfiniteScroll';

interface UserType extends UserWithId {
    followed?: boolean;
}

const useQuery = () => new URLSearchParams(useLocation().search);

function Users() {
    const [ids, setIds] = useState<number[]>([]);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const users = useSelector((state: State) => state.users);
    const usersLoading = useSelector((state: State) => state.usersLoading);
    const dispatch = useDispatch();
    const query = useQuery();
    const sq = query.get('sq');

    async function ioFunction(observer: IntersectionObserver) {
        setScrollLoading(true);

        const { data } = await axios.post('/api/users/search/results', {
            sq,
            ids,
        });

        if (data.has_more) {
            const newIds = data.items.map((item: UserType) => item.id);

            dispatch(pushSpread('users', data.items));
            setIds(userIds => [...userIds, ...newIds]);
        }

        if (!data.has_more && scrollTarget && scrollTarget.current) {
            observer.unobserve(scrollTarget.current);
        }

        setScrollLoading(false);
    }

    useInfiniteScroll(scrollTarget, ioFunction, ids);

    return (
        <section className='flex--1 pd--lg'>
            <Helmet>
                <title>Users</title>
            </Helmet>

            <h3 className='text--black-light'>
                Find people you want to follow
            </h3>

            {usersLoading ? (
                <Spinner />
            ) : (
                <>
                    <div>
                        {users.map(user => (
                            <User key={user.id} {...user} />
                        ))}
                    </div>

                    <div ref={scrollTarget}></div>

                    {scrollLoading && <Spinner />}
                </>
            )}
        </section>
    );
}

export default Users;
