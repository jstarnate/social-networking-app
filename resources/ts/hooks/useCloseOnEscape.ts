import { useEffect } from 'react';

export default function (fn: CallableFunction): void {
    function closeOnEscape(event: KeyboardEvent) {
        if (event.key !== 'Escape') {
            return;
        }

        fn();
    }

    useEffect(() => {
        window.addEventListener('keyup', closeOnEscape);

        return () => {
            window.removeEventListener('keyup', closeOnEscape);
        };
    }, []);
}
