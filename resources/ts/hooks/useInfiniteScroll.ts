import { RefObject, useCallback, useEffect } from 'react';
import { UserWithId, Post } from 'types/models';

export default function (
    target: RefObject<HTMLDivElement>,
    fn: (observer: IntersectionObserver) => void,
    dependency: (UserWithId | Post | number)[]
) {
    const ioCallback: IntersectionObserverCallback = useCallback(
        async (entries, observer) => {
            if (entries[0].isIntersecting) {
                fn(observer);
            }
        },
        [dependency]
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
}
