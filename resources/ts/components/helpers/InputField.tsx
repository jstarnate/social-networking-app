import React, { ChangeEvent, FC, ReactElement } from 'react';

interface Props {
    containerClassName?: string;
    inputClassName?: string;
    id: string;
    label: string;
    type?: string;
    value: string | null;
    onChangeEvent: (event: ChangeEvent<HTMLInputElement>) => void;
    error?: string | null;
    autoFocus?: boolean;
    children?: ReactElement;
}

const InputField: FC<Props> = (props: Props): ReactElement => {
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
};

InputField.defaultProps = {
    containerClassName: 'mg-t--lg',
    inputClassName:
        'font--md text--black b--1 b-rad--sm full-width pd--sm mg-t--xxs',
    type: 'text',
    autoFocus: false,
};

export default InputField;
