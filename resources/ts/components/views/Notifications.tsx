import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import DefaultAvatar from 'helpers/DefaultAvatar';
import Spinner from 'helpers/Spinner';

interface NotificationType {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    read_at: string | null;
    created_at: string;
    updated_at: string;
}

interface NotifWithStringedData extends NotificationType {
    data: string;
}

interface NotifWithJsonData extends NotificationType {
    data: {
        name: string;
        gender: 'Male' | 'Female';
        image_url: string | null;
        url: string;
        event_type: 'FOLLOW' | 'LIKE' | 'COMMENT' | 'OP_COMMENT';
    };
}

function Notifications() {
    const [loading, setLoading] = useState<boolean>(false);
    const [notifs, setNotifs] = useState<NotifWithJsonData[]>([]);

    async function getNotifications() {
        setLoading(true);

        const { data } = await axios.get('/api/notifications/get');
        const items: NotifWithJsonData[] = data.items.map(
            (item: NotifWithStringedData) => JSON.parse(item.data)
        );

        setNotifs(items);
        setLoading(false);
    }

    async function updateReadStatus(id: string) {
        setNotifs(notifItems =>
            notifItems.map((notifItem: NotifWithJsonData) => {
                if (notifItem.id === id) {
                    const dateNow = new Date().toString();
                    notifItem.read_at = dateNow;
                }

                return notifItem;
            })
        );

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

                    {notifs.map((notif: NotifWithJsonData) => (
                        <div key={notif.id} className='mg-t--md'>
                            <Link
                                to={notif.data.url}
                                className={`d--flex ai--center pd--sm text--black-light b--1 brdr--primary b-rad--md ${
                                    !notif.read_at ? 'bg--gray-light' : ''
                                }`}
                                onClick={updateReadStatus.bind(null, notif.id)}>
                                {!notif.data.image_url ? (
                                    <DefaultAvatar
                                        gender={notif.data.gender}
                                        size={40}
                                    />
                                ) : (
                                    <img
                                        className='round'
                                        src={notif.data.image_url}
                                    />
                                )}

                                {notif.data.event_type === 'FOLLOW' ? (
                                    <p className='mg-l--sm'>
                                        {notif.data.name} followed you.
                                    </p>
                                ) : notif.data.event_type === 'LIKE' ? (
                                    <p className='mg-l--sm'>
                                        {notif.data.name} liked your post.
                                    </p>
                                ) : notif.data.event_type === 'COMMENT' ? (
                                    <p className='mg-l--sm'>
                                        {notif.data.name} commented on your
                                        post.
                                    </p>
                                ) : notif.data.event_type === 'OP_COMMENT' ? (
                                    <p className='mg-l--sm'>
                                        {notif.data.name} commented on{' '}
                                        {notif.data.gender} post.
                                    </p>
                                ) : null}
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
