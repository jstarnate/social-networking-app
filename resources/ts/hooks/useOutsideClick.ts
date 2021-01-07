import { useEffect, RefObject } from 'react';

export default function (ref: RefObject<HTMLElement>, fn: VoidFunction): void {
    function outsideClick(event: MouseEvent) {
        if (ref.current && ref.current.contains(event.target as HTMLElement)) {
            return;
        }

        fn();
    }

    useEffect(() => {
        document.addEventListener('click', outsideClick);

        return () => {
            document.removeEventListener('click', outsideClick);
        };
    }, []);
}
