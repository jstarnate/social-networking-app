import React, { FC, ReactElement, useState } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { UserWithId } from 'types/models';

interface UserData extends UserWithId {
    followed: boolean;
}

const User: FC<UserData> = ({
    id,
    followed,
    ...user
}: UserData): ReactElement => {
    const [isFollowed, setIsFollowed] = useState<boolean>(followed);

    async function followUser() {
        setIsFollowed(true);
        await axios.post('/users/follow', { id });
    }

    async function unfollowUser() {
        setIsFollowed(false);
        await axios.post('/users/unfollow', { id });
    }

    return (
        <div className='d--flex ai--center b--1 brdr--primary b-rad--md pd--xs mg-t--md'>
            <BasicUserInfo {...user} />

            {isFollowed ? (
                <button
                    className='btn btn--danger-o text--bold curved pd-t--xxs pd-b--xxs pd-l--lg pd-r--lg mg-l--auto'
                    onChange={unfollowUser}>
                    Unfollow
                </button>
            ) : (
                <button
                    className='btn btn--primary-o text--bold curved pd-t--xxs pd-b--xxs pd-l--lg pd-r--lg mg-l--auto'
                    onChange={followUser}>
                    Follow
                </button>
            )}
        </div>
    );
};

export default User;
