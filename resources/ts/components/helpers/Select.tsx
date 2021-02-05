import { ChangeEvent, Children } from 'react';

interface SelectProps {
    className: string;
    defaultOption: string;
    items: (string | number)[];
    changeEvent: (event: ChangeEvent<HTMLSelectElement>) => void;
}

interface MainSelectProps extends SelectProps {
    containerClassName?: string;
    label?: string;
}

const Select = (props: SelectProps) => (
    <select className={props.className} onChange={props.changeEvent}>
        <option value=''>{props.defaultOption}</option>
        {Children.map(props.items, (item: number | string) => (
            <option value={item}>{item}</option>
        ))}
    </select>
);

function MainSelect({ containerClassName, label, ...props }: MainSelectProps) {
    if (!containerClassName || !label) {
        return <Select {...props} />;
    }

    return (
        <div className={containerClassName}>
            <label className='text--bold text--black-light'>{label}</label>

            <Select {...props} />
        </div>
    );
}

export default MainSelect;
