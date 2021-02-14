import { ChangeEvent, ReactElement } from 'react';

interface Props {
    containerClassName?: string;
    inputClassName?: string;
    id: string;
    label: string;
    type?: string;
    value: string | null | undefined;
    onChangeEvent: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string | null;
    autoFocus?: boolean;
    children?: ReactElement;
}

function InputField(props: Props) {
    return (
        <div className={props.containerClassName}>
            <div className='d--flex ai--center jc--between'>
                <label
                    className={`text--bold ${
                        props.error ? 'text--danger' : 'text--black-light'
                    }`}
                    htmlFor={props.id}>
                    {props.error || props.label}
                </label>
                {props.children}
            </div>
            <input
                id={props.id}
                data-testid={`${props.id}-input`}
                className={`${props.inputClassName} ${
                    props.error ? 'b--danger' : 'brdr--gray'
                }`}
                type={props.type}
                value={props.value || ''}
                onChange={props.onChangeEvent}
                autoFocus={props.autoFocus}
            />
        </div>
    );
}

InputField.defaultProps = {
    inputClassName:
        'full-width text--black b--1 brdr--gray b-rad--sm pd--xs mg-t--xxs',
    type: 'text',
};

export default InputField;
