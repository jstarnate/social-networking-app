import { ChangeEvent, useState } from 'react';

interface DataObject {
    value: string | null | undefined;
    error: string | null;
    onChangeEvent: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

export default function (
    initialValue: string | null | undefined
): [string | null | undefined, DataObject, CallableFunction] {
    const [value, setValue] = useState<string | null | undefined>(initialValue);
    const [error, setError] = useState<string | null>(null);

    function handleValue(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        setValue(event.target.value);
    }

    function handleError(message: [string] | undefined) {
        setError(message ? message[0] : null);
    }

    const data = { value, error, onChangeEvent: handleValue };

    return [value, data, handleError];
}
