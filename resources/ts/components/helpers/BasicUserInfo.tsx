import { Link } from 'react-router-dom';
import ProfilePhoto from './ProfilePhoto';
import { User } from 'types/models';

interface BasicUserInfoProps extends User {
    className?: string;
    imageClassName?: string;
    avatarSize?: number;
    fromSelf?: boolean;
    buttonEvent?: () => void;
}

function BasicUserInfo(props: BasicUserInfoProps) {
    return (
        <Link className={props.className} to={props.url || ''}>
            <ProfilePhoto
                className={props.imageClassName}
                src={props.image_url}
                size={props.avatarSize}
                gender={props.gender}
                alt='Profile photo'
            />

            <div className='mg-l--xs' style={{ minWidth: '0' }}>
                <span className='d--block font--sm text--black-light text--bold truncated'>
                    {props.full_name}
                </span>
                <span className='d--block font--sm text--gray truncated'>
                    @{props.username}
                </span>
            </div>

            {props.fromSelf && props.buttonEvent && (
                <button
                    className='btn font--lg pd-l--md mg-l--auto'
                    onClick={props.buttonEvent}>
                    <i className='fa fa-trash text--gray'></i>
                </button>
            )}
        </Link>
    );
}

BasicUserInfo.defaultProps = {
    className: 'd--flex ai--center home__post-headline',
};

export default BasicUserInfo;
