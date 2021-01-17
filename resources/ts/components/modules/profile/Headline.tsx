import { FC, ReactElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import InfoLabel from './InfoLabel';
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
                <BasicUserInfo
                    className='d--flex ai--center'
                    avatarSize={100}
                    full_name={user?.full_name}
                    username={user?.username}
                    gender={user?.gender}
                    image_url={user?.image_url}
                />

                {user?.not_self ? (
                    <button
                        className={`btn ${
                            followed ? 'btn--danger-o' : 'btn--primary-o'
                        } font--md text--bold pd-t--xs pd-b--xs pd-l--lg pd-r--lg mg-l--auto profile__follow-button`}
                        onClick={followEvent}>
                        {followed ? 'Unfollow' : 'Follow'}
                    </button>
                ) : (
                    <Link
                        to={`/profile/${username}/edit`}
                        className='btn btn--primary-o b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md mg-l--auto'>
                        Edit profile
                    </Link>
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
                    <InfoLabel icon='map-marker' label={user.location} />
                )}

                <InfoLabel
                    containerClassName={user?.location ? 'mg-l--lg' : null}
                    icon='gift'
                    label={user?.birth_date}
                />

                <InfoLabel
                    containerClassName='mg-l--lg'
                    icon='calendar'
                    label={user?.date_joined}
                />
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
