import { useState } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { UserWithId } from 'types/models';
import useDebounce from 'hooks/useDebounce';

interface UserData extends UserWithId {
    className: string;
    namespace: string;
    followed?: boolean;
}

function User({ className, namespace, id, ...user }: UserData) {
    const [isFollowed, setIsFollowed] = useState(user.followed);
    const followEvent = useDebounce(
        toggleFollowButton,
        toggleFollowRequest,
        2000
    );
    const buttonColor = isFollowed ? 'danger' : 'primary';

    function toggleFollowButton() {
        setIsFollowed(followed => !followed);
    }

    function toggleFollowRequest() {
        if (!isFollowed) {
            axios.post('/api/users/follow', { id });
        } else {
            axios.post('/api/users/unfollow', { id });
        }
    }

    return (
        <div className={className}>
            <BasicUserInfo
                className='d--flex ai--center pd--xs'
                imageClassName={`${namespace}__profile-photo`}
                {...user}
            />

            <button
                className={`full-width btn btn--${buttonColor} pd-t--xs pd-b--xs ${namespace}__follow-button`}
                onClick={followEvent}>
                {isFollowed ? (
                    <i className='fa fa-user-times'></i>
                ) : (
                    <i className='fa fa-user-plus'></i>
                )}

                <span className='text--bold mg-l--xxs'>
                    {isFollowed ? 'Unfollow' : 'Follow'}
                </span>
            </button>
        </div>
    );
}

export default User;
