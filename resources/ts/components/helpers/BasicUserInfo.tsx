import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ProfilePhoto from './ProfilePhoto';
import { User } from 'types/models';

interface Props extends User {
    className?: string;
    imageClassName?: string;
    avatarSize?: number;
    fromSelf?: boolean;
    children?: ReactNode;
}

function BasicUserInfo(props: Props) {
    return (
        <div
            className={props.className}
            style={{ gridTemplateColumns: 'auto 1fr auto' }}>
            <Link to={props.url || ''}>
                <ProfilePhoto
                    className={props.imageClassName}
                    src={props.image_url}
                    size={props.avatarSize}
                    gender={props.gender}
                    alt='Profile photo'
                />
            </Link>

            <Link
                className='mg-l--xs'
                to={props.url || ''}
                style={{ minWidth: '0' }}>
                <span className='d--block font--sm text--black-light text--bold truncated'>
                    {props.full_name}
                </span>
                <span className='d--block font--sm text--gray truncated'>
                    @{props.username}
                </span>
            </Link>

            {props.children}
        </div>
    );
}

BasicUserInfo.defaultProps = {
    className: 'd--grid ai--center',
};

export default BasicUserInfo;
