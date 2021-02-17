import { Link } from 'react-router-dom';
import ProfilePhoto from './ProfilePhoto';
import { User } from 'types/models';

interface BasicUserInfoProps extends User {
    className?: string;
    imageClassName?: string;
    avatarSize?: number;
}

interface ContentProps extends User {
    imageClassName?: string;
    avatarSize?: number;
}

const Content = (props: ContentProps) => (
    <>
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
    </>
);

function BasicUserInfo({ className, url, ...props }: BasicUserInfoProps) {
    if (!url) {
        return (
            <div className={className}>
                <Content {...props} />
            </div>
        );
    }

    return (
        <Link className={className} to={url || ''}>
            <Content {...props} />
        </Link>
    );
}

export default BasicUserInfo;
