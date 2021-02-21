import { useState, useRef } from 'react';
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

function Users() {
    const [ids, setIds] = useState<number[]>([]);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const users = useSelector((state: State) => state.users);
    const usersLoading = useSelector((state: State) => state.usersLoading);
    const dispatch = useDispatch();
    const useQuery = () => new URLSearchParams(useLocation().search);
    const sq = useQuery().get('sq');

    function ioFunction(observer: IntersectionObserver) {
        setScrollLoading(true);

        axios
            .post('/api/users/search/results', { sq, ids })
            .then(({ data }) => {
                if (data.has_more) {
                    const newIds = data.items.map((item: UserType) => item.id);

                    dispatch(pushSpread('users', data.items));
                    setIds(userIds => [...userIds, ...newIds]);
                }

                if (!data.has_more && scrollTarget && scrollTarget.current) {
                    observer.unobserve(scrollTarget.current);
                }

                setScrollLoading(false);
            });
    }

    useInfiniteScroll(scrollTarget, ioFunction, ids);

    if (usersLoading) {
        return <Spinner containerClassName='pd--md' />;
    }

    return (
        <div className='pd--md'>
            <div className='users__main'>
                {users.map(user => (
                    <User
                        key={user.id}
                        className='b--1 brdr--primary-light b-rad--sm'
                        namespace='users'
                        {...user}
                    />
                ))}
            </div>

            <div ref={scrollTarget}></div>

            {scrollLoading && <Spinner />}
        </div>
    );
}

export default Users;
