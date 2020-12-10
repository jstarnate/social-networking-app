import React, { FC, ReactElement, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import MaleDefaultAvatar from 'helpers/MaleDefaultAvatar';
import FemaleDefaultAvatar from 'helpers/FemaleDefaultAvatar';
import { UserWithId } from 'types/models';

interface SidebarProps {
    user: UserWithId | null;
    notifCount: number;
    updateNotifStatus: () => void;
}

const Sidebar: FC<SidebarProps> = ({
    user,
    notifCount,
    updateNotifStatus,
}: SidebarProps): ReactElement => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname === '/notifications') {
            updateNotifStatus();
        }
    }, [pathname]);

    return (
        <aside className='sidebar'>
            <div className='pos--fixed bg--primary-pale br--1 brdr--primary sidebar__wrap'>
                <div className='pd-l--lg'>
                    <Link
                        to={`/u/${user?.username}`}
                        className='d--flex ai--center mg-t--lg'
                        href=''>
                        {!user?.image_url && user?.gender === 'Male' ? (
                            <MaleDefaultAvatar size={30} />
                        ) : !user?.image_url && user?.gender === 'Female' ? (
                            <FemaleDefaultAvatar size={30} />
                        ) : (
                            <img className='round' src={user?.image_url} />
                        )}
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
                                <span className='font--sm text--white bg--danger round pos--abs sidebar__notif-count'>
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
};

export default Sidebar;
