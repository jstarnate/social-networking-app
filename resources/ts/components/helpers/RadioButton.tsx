import { ChangeEvent } from 'react';

interface RadioButtonProps {
    id: string;
    className?: string;
    label: string;
    condition: boolean;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function RadioButton(props: RadioButtonProps) {
    return (
        <label
            className={`d--if ai--center cursor--pointer ${
                props.className || ''
            }`}
            htmlFor={props.id}>
            {props.condition ? (
                <i className='fa fa-dot-circle-o text--black-light'></i>
            ) : (
                <i className='fa fa-circle-o text--black-light'></i>
            )}

            <span className='text--black mg-l--xxs'>{props.label}</span>
            <input
                id={props.id}
                className='d--none'
                type='radio'
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            />
        </label>
    );
}

export default RadioButton;
