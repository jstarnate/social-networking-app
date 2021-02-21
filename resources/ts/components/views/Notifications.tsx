import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Notification from 'modules/notifications/Notification';
import Spinner from 'helpers/Spinner';
import useInfiniteScroll from 'hooks/useInfiniteScroll';

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
    const scrollTarget = useRef<HTMLInputElement>(null);

    async function getNotifications() {
        setLoading(true);

        const { data } = await axios.post('/api/notifications/get');

        setNotifs(data.items);
        setLoading(false);
    }

    async function ioFunction(observer: IntersectionObserver) {
        setLoading(true);

        const date = notifs[notifs.length - 1].created_at;
        const { data } = await axios.post('/api/notifications/get', { date });

        if (data.has_more) {
            setNotifs(current => [...current, ...data.items]);
        }

        if (!data.has_more && scrollTarget && scrollTarget.current) {
            observer.unobserve(scrollTarget.current);
        }

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

    useInfiniteScroll(scrollTarget, ioFunction, notifs);

    return (
        <section className='pd-b--md pd-l--md pd-r--md'>
            {!loading && !notifs.length ? (
                <h4 className='text--gray text--bold text--center mg-t--md'>
                    You do not have any notification yet.
                </h4>
            ) : (
                <>
                    {notifs.map(notif => (
                        <Notification
                            key={notif.id}
                            updateEvent={updateReadStatus.bind(null, notif.id)}
                            notif={notif}
                        />
                    ))}

                    <div ref={scrollTarget}></div>
                </>
            )}

            {loading && <Spinner containerClassName='mg-t--md' />}
        </section>
    );
}

export default Notifications;
