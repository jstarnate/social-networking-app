import { ChangeEvent, useState } from 'react';

interface DataObject {
    value: string | null;
    error: string | null;
    onChangeEvent: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function (
    initialValue: string | null
): [string | null, DataObject, CallableFunction] {
    const [value, setValue] = useState<string | null>(initialValue);
    const [error, setError] = useState<string | null>(null);

    function handleValue(event: ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }

    function handleError(message: [string] | undefined) {
        setError(message ? message[0] : null);
    }

    const data = { value, error, onChangeEvent: handleValue };

    return [value, data, handleError];
}
