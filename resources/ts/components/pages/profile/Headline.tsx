import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MaleDefaultAvatar from 'helpers/MaleDefaultAvatar';
import FemaleDefaultAvatar from 'helpers/FemaleDefaultAvatar';
import { UserWithId } from 'types/models';
import useDebounce from 'hooks/useDebounce';

interface RouteParams {
    username: string;
}

interface AuthUser extends UserWithId {
    not_self: boolean;
    birth_date: string;
    bio: string | null;
    location: string | null;
    followers: number;
    following: number;
    is_followed: boolean;
    date_joined: string;
}

const Headline: FC = (): ReactElement | null => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [followed, setFollowed] = useState<boolean | undefined>(
        user?.is_followed
    );
    const [loading, setLoading] = useState<boolean>(false);
    const { username }: RouteParams = useParams();
    const followEvent = useDebounce(
        toggleFollowButton,
        toggleFollowRequest,
        2000
    );

    function toggleFollowButton() {
        setFollowed(isFollowed => !isFollowed);
    }

    async function toggleFollowRequest() {
        if (!followed) {
            await axios.post('/api/users/follow', { id: user?.id || null });
        } else {
            await axios.post('/api/users/unfollow', { id: user?.id || null });
        }
    }

    async function getAuthUser() {
        setLoading(true);

        const { data } = await axios.get(`/api/users/u/${username}`);

        setUser(data.user);
        setLoading(false);
    }

    useEffect(() => {
        getAuthUser();
    }, [username]);

    useEffect(() => {
        if (user) {
            setFollowed(user.is_followed);
        }
    }, [user]);

    if (loading) {
        return null;
    }

    return (
        <section className='pd-t--lg pd-l--sm pd-r--sm'>
            {/* Basic info and follow/unfollow button */}
            <div className='d--flex ai--center'>
                <div className='d--flex ai--center'>
                    {user?.gender === 'Male' && !user?.image_url ? (
                        <MaleDefaultAvatar size={100} />
                    ) : user?.gender === 'Female' && !user?.image_url ? (
                        <FemaleDefaultAvatar size={100} />
                    ) : (
                        <img
                            className='circle'
                            src={user?.image_url}
                            alt='Profile photo'
                        />
                    )}

                    <div className='mg-l--sm'>
                        <span className='d--block font--lg text--black text--bold'>
                            {user?.full_name}
                        </span>
                        <span className='font--md text--gray'>
                            @{user?.username}
                        </span>
                    </div>
                </div>

                {user?.not_self && (
                    <button
                        className={`btn ${
                            followed ? 'btn--danger-o' : 'btn--primary-o'
                        } font--md text--bold pd-t--xs pd-b--xs pd-l--lg pd-r--lg mg-l--auto profile__follow-button`}
                        onClick={followEvent}>
                        {followed ? 'Unfollow' : 'Follow'}
                    </button>
                )}
            </div>

            {/* Bio */}
            {!!user?.bio && (
                <p className='font--md text--black-light mg-t--sm'>
                    {user.bio}
                </p>
            )}

            {/* Location, birth date, and date joined */}
            <div className='mg-t--sm'>
                {!!user?.location && (
                    <label className='font--md text--gray'>
                        <i className='fa fa-map-marker'></i>
                        <span className='mg-l--xxs'>{user.location}</span>
                    </label>
                )}

                <label
                    className={`font--md text--gray ${
                        user?.location ? 'mg-l--lg' : ''
                    }`}>
                    <i className='fa fa-gift'></i>
                    <span className='mg-l--xxs'>{user?.birth_date}</span>
                </label>

                <label className='font--md text--gray mg-l--lg'>
                    <i className='fa fa-calendar'></i>
                    <span className='mg-l--xxs'>{user?.date_joined}</span>
                </label>
            </div>

            {/* Followers and following users */}
            <div className='mg-t--sm'>
                <button className='btn font--md'>
                    <span className='text--black-light text--bold'>
                        {user?.following}
                    </span>
                    <span className='text--gray mg-l--xxs'>following</span>
                </button>

                <button className='btn font--md mg-l--lg'>
                    <span className='text--black-light text--bold'>
                        {user?.followers}
                    </span>
                    <span className='text--gray mg-l--xxs'>followers</span>
                </button>
            </div>
        </section>
    );
};

export default Headline;
