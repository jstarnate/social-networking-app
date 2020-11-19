import React, { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import MaleDefaultAvatar from './MaleDefaultAvatar';
import FemaleDefaultAvatar from './FemaleDefaultAvatar';
import { User } from 'types/models';

interface BasicUserInfoProps extends User {
    className?: string;
    avatarSize?: number;
}

const BasicUserInfo: FC<BasicUserInfoProps> = ({
    className,
    avatarSize,
    full_name,
    username,
    gender,
    image_url,
    url,
}: BasicUserInfoProps): ReactElement => {
    return (
        <Link className={className} to={url || ''}>
            {gender === 'Male' && !image_url ? (
                <MaleDefaultAvatar size={avatarSize} />
            ) : gender === 'Female' && !image_url ? (
                <FemaleDefaultAvatar size={avatarSize} />
            ) : (
                <img className='circle' src={image_url} alt='Profile photo' />
            )}

            <div className='mg-l--xs'>
                <span className='d--block font--sm text--black-light text--bold'>
                    {full_name}
                </span>
                <span className='font--sm text--gray'>@{username}</span>
            </div>
        </Link>
    );
};

BasicUserInfo.defaultProps = {
    className: 'd--flex ai--center pd--xs',
};

export default BasicUserInfo;
