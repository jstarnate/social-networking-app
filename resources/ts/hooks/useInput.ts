import { ChangeEvent, useState } from 'react';

type InputValueType = string | null | undefined;
type UseInputReturnType = [InputValueType, DataObject, CallableFunction];

interface DataObject {
    value: InputValueType;
    error: string | null;
    onChangeEvent: (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

export default function (initialValue: InputValueType): UseInputReturnType {
    const [value, setValue] = useState<InputValueType>(initialValue);
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
