import { lazy, Suspense, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ProfilePhoto from 'helpers/ProfilePhoto';
import Spinner from 'helpers/Spinner';
import { UserWithId } from 'types/models';

interface SidebarProps {
    user: UserWithId | null;
    notifCount: number;
}

const Modal = lazy(() => import('helpers/Modal'));

function Sidebar({ user, notifCount }: SidebarProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const logoutForm = useRef<HTMLFormElement>(null);
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

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

    return (
        <aside className='pos--rel sidebar'>
            <div className='pos--fixed d--flex fd--column br--1 brdr--primary-light sidebar__wrap'>
                <Link
                    to={`/u/${user?.username}`}
                    className='d--flex ai--center pd-l--lg mg-t--lg'
                    href=''>
                    <ProfilePhoto
                        className='round sidebar__profile-photo'
                        src={user?.image_url || null}
                        gender={user?.gender || null}
                        size={30}
                    />

                    <span className='font--sm text--black-light text--bold mg-l--xs'>
                        {user?.full_name}
                    </span>
                </Link>

                <nav className='mg-t--md'>
                    <NavLink
                        className='d--block font--lg text--gray pd-t--xs pd-b--xs pd-l--lg'
                        to='/home'
                        activeClassName='sidebar__active-link'>
                        <i className='fa fa-home'></i>
                        <span className='text--bold mg-l--sm'>Home</span>
                    </NavLink>

                    <NavLink
                        className='d--block font--lg text--gray pd-t--xs pd-b--xs pd-l--lg pos--rel'
                        to='/notifications'
                        activeClassName='sidebar__active-link'>
                        <i className='fa fa-bell'></i>
                        <span className='text--bold mg-l--sm'>
                            Notifications
                        </span>

                        {!!notifCount && (
                            <span className='font--sm text--white bg--danger round pos--abs pd-l--xxs pd-r--xxs sidebar__notif-count'>
                                {notifCount > 9 ? '9+' : notifCount}
                            </span>
                        )}
                    </NavLink>

                    <NavLink
                        className='d--block font--lg text--gray pd-t--xs pd-b--xs pd-l--lg'
                        to='/users/search'
                        activeClassName='sidebar__active-link'>
                        <i className='fa fa-users'></i>
                        <span className='text--bold mg-l--sm'>
                            Search people
                        </span>
                    </NavLink>
                </nav>

                <div className='mg-t--auto pd-l--lg pd-r--lg pd-t--sm pd-b--sm'>
                    <button
                        className='btn btn--secondary-o full-width curved pd-t--xs pd-b--xs pd-l--lg pd-r--lg'
                        onClick={enableModal}>
                        Sign out
                    </button>
                </div>
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
