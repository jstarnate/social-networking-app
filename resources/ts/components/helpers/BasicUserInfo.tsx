import { Link } from 'react-router-dom';
import ProfilePhoto from './ProfilePhoto';
import { User } from 'types/models';

interface Props extends User {
    className?: string;
    imageClassName?: string;
    avatarSize?: number;
}

function BasicUserInfo(props: Props) {
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
        </Link>
    );
}

BasicUserInfo.defaultProps = {
    className: 'd--if ai--center home__post-headline',
};

export default BasicUserInfo;
