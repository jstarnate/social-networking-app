import { useEffect, RefObject } from 'react';

export default function (ref: RefObject<HTMLElement>, fn: VoidFunction): void {
    function checkClicked(event: MouseEvent) {
        if (ref.current && ref.current.contains(event.target as Node)) {
            return;
        }

        fn();
    }

    useEffect(() => {
        document.addEventListener('click', checkClicked);

        return () => {
            document.removeEventListener('click', checkClicked);
        };
    });
}
