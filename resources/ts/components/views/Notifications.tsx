import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import DefaultAvatar from 'helpers/DefaultAvatar';
import Spinner from 'helpers/Spinner';
import { User } from 'types/models';

interface NotifType {
    id: number;
    message: string;
    url: string;
    read: boolean;
    user: User;
    created_at: string;
}

function Notifications() {
    const [loading, setLoading] = useState<boolean>(false);
    const [notifs, setNotifs] = useState([]);

    async function getNotifications() {
        setLoading(true);

        const { data } = await axios.get('/api/notifications/get');

        setNotifs(data.items);
        setLoading(false);
    }

    async function updateReadStatus(id: number) {
        await axios.put('/api/notifications/read', { id });
    }

    useEffect(() => {
        getNotifications();
    }, []);

    if (loading) {
        return (
            <section className='flex--1 pd--lg'>
                <Spinner />
            </section>
        );
    }

    return (
        <section className='flex--1 pd--lg'>
            <Helmet>
                <title>Notifications</title>
            </Helmet>

            {loading ? (
                <Spinner />
            ) : !loading && !notifs.length ? (
                <h3 className='text--gray text--bold text--center'>
                    You do not have any notification yet.
                </h3>
            ) : (
                <>
                    <h3 className='text--black-light'>Notifications</h3>

                    {notifs.map((notif: NotifType) => (
                        <div key={notif.id} className='mg-t--md'>
                            <Link
                                to={notif.url}
                                className={`d--flex ai--center pd--sm text--black-light b--1 brdr--primary b-rad--md ${
                                    !notif.read ? 'bg--gray-light' : ''
                                }`}
                                onClick={updateReadStatus.bind(null, notif.id)}>
                                {!notif.user.image_url ? (
                                    <DefaultAvatar
                                        gender={notif.user.gender}
                                        size={40}
                                    />
                                ) : (
                                    <img
                                        className='round'
                                        src={notif.user.image_url}
                                    />
                                )}

                                <p className='mg-l--sm'>{notif.message}</p>
                            </Link>

                            <span className='font--sm text--gray'>
                                {notif.created_at}
                            </span>
                        </div>
                    ))}
                </>
            )}
        </section>
    );
}

export default Notifications;
