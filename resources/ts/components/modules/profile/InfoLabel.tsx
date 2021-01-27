interface Props {
    containerClassName?: string | null;
    icon: string;
    label?: string;
}

function InfoLabel({ containerClassName, icon, label }: Props) {
    return (
        <label className={`font--md text--gray ${containerClassName || ''}`}>
            <i className={`fa fa-${icon}`}></i>
            <span className='mg-l--xxs'>{label}</span>
        </label>
    );
}

export default InfoLabel;
