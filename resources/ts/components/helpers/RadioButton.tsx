import { ChangeEvent, FC, ReactElement } from 'react';

interface RadioButtonProps {
    id: string;
    className?: string;
    label: string;
    condition: boolean;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: FC<RadioButtonProps> = ({
    id,
    className,
    label,
    condition,
    name,
    value,
    onChange,
}: RadioButtonProps): ReactElement => {
    return (
        <label
            className={`d--if ai--center cursor--pointer ${className || ''}`}
            htmlFor={id}>
            {condition ? (
                <i className='fa fa-dot-circle-o text--black-light'></i>
            ) : (
                <i className='fa fa-circle-o text--black-light'></i>
            )}

            <span className='text--black mg-l--xxs'>{label}</span>
            <input
                id={id}
                className='d--none'
                type='radio'
                name={name}
                value={value}
                onChange={onChange}
            />
        </label>
    );
};

export default RadioButton;
