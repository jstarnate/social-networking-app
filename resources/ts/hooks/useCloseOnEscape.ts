import { useEffect } from 'react';

export default function (fn: CallableFunction | undefined): void {
    function closeOnEscape(event: KeyboardEvent) {
        if (fn && event.key === 'Escape') {
            fn();
        }
    }

    useEffect(() => {
        window.addEventListener('keyup', closeOnEscape);

        return () => {
            window.removeEventListener('keyup', closeOnEscape);
        };
    }, []);
}
