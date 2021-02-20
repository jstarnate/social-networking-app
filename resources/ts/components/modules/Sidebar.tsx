import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Echo from 'laravel-echo';
import ProfilePhoto from 'helpers/ProfilePhoto';
import Spinner from 'helpers/Spinner';
import { UserWithId } from 'types/models';
import { State } from 'types/redux';
import 'pusher-js';

interface Props {
    user: UserWithId | null;
}

interface EchoData {
    count: number;
}

const Modal = lazy(() => import('helpers/Modal'));
const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute('content');
const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.PUSHER_APP_KEY,
    cluster: process.env.PUSHER_APP_CLUSTER,
});

function Sidebar({ user }: Props) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [notifCount, setNotifCount] = useState<number>(0);
    const logoutForm = useRef<HTMLFormElement>(null);
    const screenWidth = useSelector((state: State) => state.screenWidth);

    async function getNotifCount() {
        const { data } = await axios.get('/api/notifications/count');
        setNotifCount(data.count);
    }

    function enableModal() {
        setShowModal(true);
    }

    function disableModal() {
        setShowModal(false);
    }

    function signOut() {
        logoutForm.current?.submit();
        localStorage.clear();
    }

    useEffect(() => {
        getNotifCount();
    }, []);

    useEffect(() => {
        if (user) {
            echo.channel(`notify.user.${user.id}`).listen(
                'SendUnreadNotifsCount',
                (data: EchoData) => {
                    setNotifCount(data.count);
                }
            );
        }
    }, [user]);

    return (
        <aside className='pos--rel sidebar'>
            <div className='pos--fixed bg--white d--flex fd--column br--1 brdr--primary-light sidebar__wrap'>
                <nav className='mg-t--md sidebar__nav'>
                    <NavLink
                        className='d--block font--lg text--gray pd-t--xs pd-b--xs pd-l--lg sidebar__navitem'
                        to='/home'
                        activeClassName='sidebar__active-link'>
                        <i className='fa fa-home'></i>
                        <span className='text--bold mg-l--sm sidebar__navitem-label'>
                            Home
                        </span>
                    </NavLink>

                    <NavLink
                        className='d--flex ai--center pd-t--xs pd-b--xs pd-l--lg sidebar__navitem'
                        to={`/u/${user?.username}`}
                        activeClassName='sidebar__active-link'>
                        <ProfilePhoto
                            className='sidebar__profile-photo'
                            src={user?.image_url || null}
                            gender={user?.gender || null}
                            size={20}
                        />

                        <span className='font--lg text--gray text--bold mg-l--sm sidebar__navitem-label'>
                            Profile
                        </span>
                    </NavLink>

                    <NavLink
                        className='d--flex ai--center font--lg text--gray pd-t--xs pd-b--xs pd-l--lg sidebar__navitem'
                        to='/notifications'
                        activeClassName='sidebar__active-link'>
                        <i className='fa fa-bell'></i>
                        <span className='text--bold mg-l--sm sidebar__navitem-label'>
                            Notifications
                        </span>

                        {!!notifCount && (
                            <span className='font--sm text--white bg--danger round pd-l--xxs pd-r--xxs mg-l--sm sidebar__notif-count'>
                                {notifCount > 9 ? '9+' : notifCount}
                            </span>
                        )}
                    </NavLink>

                    <NavLink
                        className='d--block font--lg text--gray pd-t--xs pd-b--xs pd-l--lg sidebar__navitem'
                        to='/users/search'
                        activeClassName='sidebar__active-link'>
                        <i className='fa fa-users'></i>
                        <span className='text--bold mg-l--sm sidebar__navitem-label'>
                            Search people
                        </span>
                    </NavLink>
                </nav>

                {screenWidth <= 785 ? (
                    <button
                        className='btn pd-t--sm pd-b--sm mg-t--auto'
                        onClick={enableModal}>
                        <i className='fa fa-sign-out text--gray'></i>
                    </button>
                ) : (
                    <div className='mg-t--auto pd-l--lg pd-r--lg pd-t--sm pd-b--sm'>
                        <button
                            className='btn btn--secondary-o full-width curved pd-t--xs pd-b--xs pd-l--lg pd-r--lg'
                            onClick={enableModal}>
                            Sign out
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <Suspense
                    fallback={
                        <Spinner containerClassName='pos--fixed ai--center modal' />
                    }>
                    <Modal
                        type='primary'
                        title='Sign out'
                        message='Are you sure you want to sign out?'
                        closeEvent={disableModal}>
                        <>
                            <button
                                className='btn btn--secondary font--sm b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md mg-r--sm'
                                onClick={disableModal}>
                                Cancel
                            </button>
                            <button
                                className='btn btn--primary font--sm text--bold b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md'
                                onClick={signOut}>
                                Sign out
                            </button>

                            <form
                                ref={logoutForm}
                                className='d--none'
                                method='POST'
                                action='/api/sign-out'>
                                <input
                                    type='hidden'
                                    name='_token'
                                    value={csrfToken || ''}
                                />
                                <input type='submit' />
                            </form>
                        </>
                    </Modal>
                </Suspense>
            )}
        </aside>
    );
}

export default Sidebar;
