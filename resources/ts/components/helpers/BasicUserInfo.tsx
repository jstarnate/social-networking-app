import React, { FC, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import MaleDefaultAvatar from './MaleDefaultAvatar';
import FemaleDefaultAvatar from './FemaleDefaultAvatar';
import { User } from 'types/models';

interface BasicUserInfoProps extends User {
    className?: string;
    imageClassName?: string;
    avatarSize?: number;
}

interface ContentProps {
    imageClassName?: string;
    avatarSize?: number;
    full_name: string | undefined;
    username: string | undefined;
    gender: 'Male' | 'Female' | undefined;
    image_url: string | undefined;
}

const Content = ({
    imageClassName,
    avatarSize,
    full_name,
    username,
    gender,
    image_url,
}: ContentProps) => (
    <>
        {gender === 'Male' && !image_url ? (
            <MaleDefaultAvatar size={avatarSize} />
        ) : gender === 'Female' && !image_url ? (
            <FemaleDefaultAvatar size={avatarSize} />
        ) : (
            <img
                className={`round ${imageClassName}`}
                src={image_url}
                alt='Profile photo'
            />
        )}

        <div className='mg-l--xs'>
            <span className='d--block font--sm text--black-light text--bold'>
                {full_name}
            </span>
            <span className='font--sm text--gray'>@{username}</span>
        </div>
    </>
);

const BasicUserInfo: FC<BasicUserInfoProps> = ({
    className,
    url,
    ...props
}: BasicUserInfoProps): ReactElement => {
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
};

BasicUserInfo.defaultProps = {
    className: 'd--flex ai--center pd--xs',
};

export default BasicUserInfo;
