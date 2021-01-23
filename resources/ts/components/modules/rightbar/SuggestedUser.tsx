import { useState } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { UserWithId } from 'types/models';
import useDebounce from 'hooks/useDebounce';

function SuggestedUser({ id, ...user }: UserWithId) {
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const followEvent = useDebounce(
        toggleFollowButton,
        toggleFollowRequest,
        2000
    );

    function toggleFollowButton() {
        setIsFollowed(followed => !followed);
    }

    async function toggleFollowRequest() {
        if (!isFollowed) {
            await axios.post('/api/users/follow', { id });
        } else {
            await axios.post('/api/users/unfollow', { id });
        }
    }

    return (
        <div className='bg--white b-rad--sm mg-t--md'>
            <BasicUserInfo imageClassName='rightbar__profile-photo' {...user} />

            <button
                className={`full-width btn btn--${
                    isFollowed ? 'danger' : 'primary'
                } pd-t--xs pd-b--xs rightbar__follow-button`}
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

export default SuggestedUser;
