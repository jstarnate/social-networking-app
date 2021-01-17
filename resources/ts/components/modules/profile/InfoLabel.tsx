import { FC, ReactElement } from 'react';

interface Props {
    containerClassName?: string | null;
    icon: string;
    label: string | undefined;
}

const InfoLabel: FC<Props> = ({
    containerClassName,
    icon,
    label,
}: Props): ReactElement => {
    return (
        <label className={`font--md text--gray ${containerClassName || ''}`}>
            <i className={`fa fa-${icon}`}></i>
            <span className='mg-l--xxs'>{label}</span>
        </label>
    );
};

export default InfoLabel;
