import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Notification from 'modules/notifications/Notification';
import Spinner from 'helpers/Spinner';

export interface NotificationType {
    id: string;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: {
        name: string;
        gender: 'Male' | 'Female';
        image_url: string | null;
        url: string;
        event_type: 'FOLLOW' | 'LIKE' | 'COMMENT' | 'OP_COMMENT';
    };
    read_at: string | null;
    time_diff: string;
    created_at: string;
    updated_at: string;
}

function Notifications() {
    const [loading, setLoading] = useState<boolean>(false);
    const [notifs, setNotifs] = useState<NotificationType[]>([]);

    async function getNotifications() {
        setLoading(true);

        const { data } = await axios.get('/api/notifications/get');

        setNotifs(data.items);
        setLoading(false);
    }

    function updateReadStatus(id: string) {
        setNotifs(notifItems =>
            notifItems.map((notifItem: NotificationType) => {
                if (notifItem.id === id) {
                    const dateNow = new Date().toString();
                    notifItem.read_at = dateNow;
                }

                return notifItem;
            })
        );

        axios.put('/api/notifications/read', { id });
    }

    useEffect(() => {
        getNotifications();
    }, []);

    if (loading) {
        return (
            <section className='flex--1 pd--md'>
                <Spinner />
            </section>
        );
    }

    return (
        <section className='flex--1 pd--md'>
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

                    {notifs.map((notif: NotificationType) => (
                        <Notification
                            key={notif.id}
                            updateEvent={updateReadStatus.bind(null, notif.id)}
                            notif={notif}
                        />
                    ))}
                </>
            )}
        </section>
    );
}

export default Notifications;
