import { RefObject, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Post } from 'types/models';

export default function (
    fn: CallableFunction,
    target: RefObject<HTMLElement>,
    route: string,
    list: Post[]
): boolean {
    const [loading, setLoading] = useState<boolean>(false);

    const ioCallback: IntersectionObserverCallback = useCallback(
        async (entries, observer) => {
            if (entries[0].isIntersecting) {
                setLoading(false);

                const date = list[list.length - 1].updated_at;
                const { data } = await axios.post(route, { date });

                if (data.has_more) {
                    fn(data);
                }

                if (!data.has_more && target && target.current) {
                    observer.unobserve(target.current);
                }

                setLoading(false);
            }
        },
        [list]
    );

    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };

        const observer = new IntersectionObserver(ioCallback, options);

        if (target && target.current) {
            observer.observe(target.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [ioCallback]);

    return loading;
}
