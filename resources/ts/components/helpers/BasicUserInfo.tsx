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

const Content = (props: ContentProps) => (
    <>
        {props.gender === 'Male' && !props.image_url ? (
            <MaleDefaultAvatar size={props.avatarSize} />
        ) : props.gender === 'Female' && !props.image_url ? (
            <FemaleDefaultAvatar size={props.avatarSize} />
        ) : (
            <img
                className={`round ${props.imageClassName}`}
                src={props.image_url}
                alt='Profile photo'
            />
        )}

        <div className='mg-l--xs'>
            <span className='d--block font--sm text--black-light text--bold'>
                {props.full_name}
            </span>
            <span className='font--sm text--gray'>@{props.username}</span>
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
