import { useEffect, RefObject } from 'react';

export default function (
    ref: RefObject<HTMLElement>,
    fn: CallableFunction | undefined
) {
    function outsideClick(event: MouseEvent) {
        if (
            fn &&
            ref.current &&
            !ref.current.contains(event.target as HTMLElement)
        ) {
            fn();
        }
    }

    useEffect(() => {
        document.addEventListener('click', outsideClick);

        return () => {
            document.removeEventListener('click', outsideClick);
        };
    }, []);
}
