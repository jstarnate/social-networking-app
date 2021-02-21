import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ProfilePhoto from 'helpers/ProfilePhoto';
import Modal from 'helpers/Modal';
import InfoLabel from './InfoLabel';
import { UserWithId } from 'types/models';

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

function Headline() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [followed, setFollowed] = useState<boolean | undefined>(
        user?.is_followed
    );
    const [
        showUnfollowConfirmation,
        toggleUnfollowConfirmation,
    ] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { username }: RouteParams = useParams();

    function closeUnfollowModal() {
        toggleUnfollowConfirmation(false);
    }

    function follow() {
        setFollowed(true);
        axios.post('/api/users/follow', { id: user?.id || null });
    }

    function unfollow() {
        setFollowed(false);
        toggleUnfollowConfirmation(false);
        axios.post('/api/users/unfollow', { id: user?.id || null });
    }

    function getAuthUser() {
        setLoading(true);

        axios.get(`/api/users/u/${username}`).then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });
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
        <section className='pd-t--lg pd-l--sm pd-r--sm profile__headline'>
            {/* Basic info and follow/unfollow button */}
            <div className='d--flex ai--center profile__headline-top'>
                <ProfilePhoto
                    className='profile__photo'
                    src={user?.image_url || null}
                    size={100}
                    gender={user?.gender || null}
                    alt='Profile photo'
                />

                <div className='mg-l--xs'>
                    <span
                        className='d--block font--sm text--black-light text--bold'
                        style={{ whiteSpace: 'pre-wrap' }}>
                        {user?.full_name}
                    </span>
                    <span className='d--block font--sm text--gray'>
                        @{user?.username}
                    </span>
                </div>

                {user?.not_self ? (
                    followed ? (
                        <button
                            className='btn btn--danger-o text--bold curved pd-t--xxs pd-b--xxs pd-l--lg pd-r--lg mg-l--auto profile__button'
                            onClick={toggleUnfollowConfirmation.bind(
                                null,
                                true
                            )}>
                            Unfollow
                        </button>
                    ) : (
                        <button
                            className='btn btn--primary-o text--bold curved pd-t--xxs pd-b--xxs pd-l--lg pd-r--lg mg-l--auto profile__button'
                            onClick={follow}>
                            Follow
                        </button>
                    )
                ) : (
                    <Link
                        to={`/profile/${username}/edit`}
                        className='btn btn--primary-o font--sm b-rad--sm pd-t--xxs pd-b--xxs pd-l--md pd-r--md mg-l--auto profile__button'>
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
                    <InfoLabel
                        containerClassName='profile__secondary-info'
                        icon='map-marker'
                        label={user.location}
                    />
                )}

                <InfoLabel
                    containerClassName={`${
                        user?.location ? 'mg-l--lg' : ''
                    } profile__secondary-info`}
                    icon='gift'
                    label={user?.birth_date}
                />

                <InfoLabel
                    containerClassName='mg-l--lg profile__secondary-info'
                    icon='calendar'
                    label={user?.date_joined}
                />
            </div>

            {/* Followers and following users */}
            <div className='mg-t--sm'>
                <Link
                    to={`/${username}/connected/following`}
                    className='btn font--md'>
                    <span className='text--black-light text--bold'>
                        {user?.following}
                    </span>
                    <span className='text--gray mg-l--xxs'>following</span>
                </Link>

                <Link
                    to={`/${username}/connected/followers`}
                    className='btn font--md mg-l--lg'>
                    <span className='text--black-light text--bold'>
                        {user?.followers}
                    </span>
                    <span className='text--gray mg-l--xxs'>followers</span>
                </Link>
            </div>

            {showUnfollowConfirmation && (
                <Modal
                    title='Confirm unfollow'
                    message={`You will no longer see posts from ${username}. Continue?`}
                    closeEvent={closeUnfollowModal}>
                    <>
                        <button
                            className='btn btn--secondary font--sm b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md mg-r--sm'
                            onClick={closeUnfollowModal}>
                            Cancel
                        </button>
                        <button
                            className='btn btn--danger font--sm text--bold b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md'
                            onClick={unfollow}>
                            Yes, unfollow
                        </button>
                    </>
                </Modal>
            )}
        </section>
    );
}

export default Headline;
