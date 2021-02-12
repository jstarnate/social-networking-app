import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import User from 'modules/users/User';
import Spinner from 'helpers/Spinner';
import { UserWithId } from 'types/models';

interface Props {
    name: 'followers' | 'following';
}

interface ConnectedUser extends UserWithId {
    connected_at: string;
}

interface RouteParams {
    username: string;
}

const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');

function ConnectedUsers({ name }: Props) {
    const [users, setUsers] = useState<ConnectedUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const { username }: RouteParams = useParams();

    const ioCallback: IntersectionObserverCallback = useCallback(
        async (entries, observer) => {
            if (entries[0].isIntersecting) {
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
        },
        [users]
    );

    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };

        const observer = new IntersectionObserver(ioCallback, options);

        if (scrollTarget && scrollTarget.current) {
            observer.observe(scrollTarget.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [ioCallback]);

    return (
        <section className='flex--1'>
            <Helmet>
                <title>
                    {name === 'followers'
                        ? 'Followers'
                        : name === 'following'
                        ? 'Followed people'
                        : 'Home'}
                </title>
            </Helmet>

            <header className='d--flex ai--center bb--1 brdr--primary'>
                <Link
                    to={`/u/${username}`}
                    className='btn text--primary pd-t--sm pd-b--sm pd-l--md pd-r--md'>
                    <i className='fa fa-arrow-left'></i>
                </Link>
                <h3 className='text--black-light'>
                    {name === 'followers' &&
                        username === cachedUser.username &&
                        'People who follow you'}
                    {name === 'followers' &&
                        username !== cachedUser.username &&
                        `People who follow ${username}`}

                    {name === 'following' &&
                        username === cachedUser.username &&
                        'People you follow'}
                    {name === 'following' &&
                        username !== cachedUser.username &&
                        `People ${username} follows`}
                </h3>
            </header>

            <div className='pd--md'>
                {users.length ? (
                    <>
                        <div>
                            {users.map(user => (
                                <User key={user.id} {...user} />
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
        </section>
    );
}

export default ConnectedUsers;
