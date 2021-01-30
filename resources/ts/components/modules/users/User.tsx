import { useState } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { UserWithId } from 'types/models';
import useDebounce from 'hooks/useDebounce';

interface UserData extends UserWithId {
    followed?: boolean;
}

function User({ id, ...user }: UserData) {
    const [isFollowed, setIsFollowed] = useState(user.followed);
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
        <div className='d--flex ai--center b--1 brdr--primary b-rad--md pd--sm mg-t--md'>
            <BasicUserInfo
                className='d--if ai--center'
                imageClassName='home__id-photo'
                {...user}
            />

            <button
                className={`btn ${
                    isFollowed ? 'btn--danger-o' : 'btn--primary-o'
                } text--bold curved pd-t--xxs pd-b--xxs pd-l--lg pd-r--lg mg-l--auto`}
                onChange={followEvent}>
                {isFollowed ? 'Unfollow' : 'Follow'}
            </button>
        </div>
    );
}

export default User;
