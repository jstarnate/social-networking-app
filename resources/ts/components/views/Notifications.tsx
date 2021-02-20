import { useEffect, useState } from 'react';
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
// FIXME: Implement infinite scroll functionality
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
        const selected = notifs.find(
            (notif: NotificationType) => notif.id === id
        );

        if (selected && !selected.read_at) {
            return;
        }

        setNotifs(current =>
            current.map(item => {
                if (item.id === id) {
                    const dateNow = new Date().toString();
                    item.read_at = dateNow;
                }

                return item;
            })
        );

        axios.put('/api/notifications/read', { id });
    }

    useEffect(() => {
        getNotifications();
    }, []);

    return (
        <section className='pd-b--md pd-l--md pd-r--md'>
            {loading ? (
                <Spinner />
            ) : !loading && !notifs.length ? (
                <h3 className='text--gray text--bold text--center'>
                    You do not have any notification yet.
                </h3>
            ) : (
                <>
                    {notifs.map(notif => (
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
