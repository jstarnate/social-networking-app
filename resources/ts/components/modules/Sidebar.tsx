import { Link, NavLink } from 'react-router-dom';
import ProfilePhoto from 'helpers/ProfilePhoto';
import { UserWithId } from 'types/models';

interface SidebarProps {
    user: UserWithId | null;
    notifCount: number;
}

function Sidebar({ user, notifCount }: SidebarProps) {
    return (
        <aside className='sidebar'>
            <div className='pos--fixed bg--primary-pale br--1 brdr--primary sidebar__wrap'>
                <div className='pd-l--lg'>
                    <Link
                        to={`/u/${user?.username}`}
                        className='d--flex ai--center mg-t--lg'
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
                            className='d--block font--lg text--gray pd-t--xs pd-b--xs'
                            to='/home'
                            activeClassName='sidebar__active-link'>
                            <i className='fa fa-home'></i>
                            <span className='text--bold mg-l--sm'>Home</span>
                        </NavLink>

                        <NavLink
                            className='d--block font--lg text--gray pd-t--xs pd-b--xs pos--rel'
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
                            className='d--block font--lg text--gray pd-t--xs pd-b--xs'
                            to='/users/search'
                            activeClassName='sidebar__active-link'>
                            <i className='fa fa-users'></i>
                            <span className='text--bold mg-l--sm'>
                                Search people
                            </span>
                        </NavLink>
                    </nav>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
