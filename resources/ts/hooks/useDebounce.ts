import { useRef, MouseEvent } from 'react';

type DebounceReturnType = (event: MouseEvent<HTMLButtonElement>) => void;

function useDebounce(
    stateFn: CallableFunction,
    requestFn: CallableFunction,
    delay: number
): DebounceReturnType {
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
