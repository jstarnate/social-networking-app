import { useRef, MouseEvent } from 'react';

function useDebounce(
    stateFn: CallableFunction,
    requestFn: CallableFunction,
    delay: number
): (event: MouseEvent<HTMLButtonElement>) => void {
    const timeout = useRef<number | undefined>();

    return () => {
        stateFn();

        if (timeout.current) {
            clearTimeout(timeout.current);
            timeout.current = undefined;
        }

        timeout.current = window.setTimeout(() => {
            requestFn();
            timeout.current = undefined;
        }, delay);
    };
}

export default useDebounce;
