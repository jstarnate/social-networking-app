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
    const buttonColor = isFollowed ? 'danger' : 'primary';

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
        <div className='bg--primary-pale b--1 brdr--primary-light b-rad--sm mg-t--md'>
            <BasicUserInfo
                className='d--flex ai--center pd--xs'
                imageClassName='rightbar__profile-photo'
                {...user}
            />

            <button
                className={`full-width btn btn--${buttonColor} pd-t--xs pd-b--xs rightbar__follow-button`}
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
