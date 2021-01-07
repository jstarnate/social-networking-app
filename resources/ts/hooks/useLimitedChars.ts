import { ChangeEvent, useState } from 'react';

type LimitedCharsReturn = [
    number,
    (event: ChangeEvent<HTMLTextAreaElement>) => void
];

export default function (
    totalChars: number,
    fn: CallableFunction
): LimitedCharsReturn {
    const [charsLeft, setChars] = useState<number>(totalChars);

    function checkLength(event: ChangeEvent<HTMLTextAreaElement>) {
        const { value } = event.target;

        if (value.length === totalChars + 1) {
            return false;
        }

        setChars(totalChars - value.length);
        fn(value);
    }

    return [charsLeft, checkLength];
}
