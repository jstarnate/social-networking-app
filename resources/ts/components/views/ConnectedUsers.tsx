import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import User from 'modules/users/User';
import Spinner from 'helpers/Spinner';
import { UserWithId } from 'types/models';
import useInfiniteScroll from 'hooks/useInfiniteScroll';

interface Props {
    name: 'followers' | 'following';
}

interface ConnectedUser extends UserWithId {
    connected_at: string;
}

interface RouteParams {
    username: string;
}

function ConnectedUsers({ name }: Props) {
    const [users, setUsers] = useState<ConnectedUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const { username }: RouteParams = useParams();

    async function getUsers() {
        setLoading(true);

        const url = `/api/users/u/${username}/connected/${name}`;
        const { data } = await axios.post(url);

        setUsers(data.users);
        setLoading(false);
    }

    async function ioFunction(observer: IntersectionObserver) {
        setLoading(true);

        const url = `/api/users/u/${username}/connected/${name}`;
        const date = users[users.length - 1]?.connected_at || null;
        const { data } = await axios.post(url, { date });

        if (data.has_more) {
            setUsers(u => [...u, ...data.users]);
        }

        if (!data.has_more && scrollTarget && scrollTarget.current) {
            observer.unobserve(scrollTarget.current);
        }

        setLoading(false);
    }

    useInfiniteScroll(scrollTarget, ioFunction, users);

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className='pd--md'>
            {users.length ? (
                <>
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
                </>
            ) : (
                <h3 className='text--gray text--center'>
                    {name === 'followers'
                        ? 'No followers'
                        : name === 'following'
                        ? 'No followed person'
                        : ''}
                </h3>
            )}

            {loading && <Spinner />}
        </div>
    );
}

export default ConnectedUsers;
