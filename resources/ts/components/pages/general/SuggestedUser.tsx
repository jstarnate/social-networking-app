import React, { FC, ReactElement, useState } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { UserWithId } from 'types/models';

const SuggestedUser: FC<UserWithId> = ({
    id,
    ...user
}: UserWithId): ReactElement => {
    const [isFollowed, setIsFollowed] = useState<boolean>(false);

    async function followUser() {
        setIsFollowed(true);

        try {
            await axios.post('/users/follow', { id });
        } catch (err) {
            setIsFollowed(false);
        }
    }

    async function unfollowUser() {
        setIsFollowed(false);

        try {
            await axios.post('/users/unfollow', { id });
        } catch (err) {
            setIsFollowed(true);
        }
    }

    return (
        <div className='bg--white b-rad--sm mg-t--md'>
            <BasicUserInfo {...user} />

            {isFollowed ? (
                <button
                    className='full-width btn btn--danger pd-t--xs pd-b--xs rightbar__follow-button'
                    onClick={unfollowUser}>
                    <i className='fa fa-user-times'></i>
                    <span className='text--bold mg-l--xxs'>Unfollow</span>
                </button>
            ) : (
                <button
                    className='full-width btn btn--primary pd-t--xs pd-b--xs rightbar__follow-button'
                    onClick={followUser}>
                    <i className='fa fa-user-plus'></i>
                    <span className='text--bold mg-l--xxs'>Follow</span>
                </button>
            )}
        </div>
    );
};

export default SuggestedUser;
