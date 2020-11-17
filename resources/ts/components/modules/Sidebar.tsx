import React, { FC, ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import MaleDefaultAvatar from 'helpers/MaleDefaultAvatar';

const Sidebar: FC = (): ReactElement => {
    return (
        <aside className='sidebar'>
            <div className='pos--fixed bg--primary-pale br--1 brdr--primary sidebar__wrap'>
                <div className='pd-l--lg'>
                    <a className='d--flex ai--center mg-t--lg' href=''>
                        <MaleDefaultAvatar size={30} />
                        <span className='font--sm text--black text--bold mg-l--xs'>
                            John Doe
                        </span>
                    </a>

                    <nav className='mg-t--md'>
                        <NavLink
                            className='d--block font--lg text--gray pd-t--xs pd-b--xs'
                            to='/home'
                            activeClassName='sidebar__active-link'>
                            <i className='fa fa-home'></i>
                            <span className='text--bold mg-l--sm'>Home</span>
                        </NavLink>
                        <NavLink
                            className='d--block font--lg text--gray pd-t--xs pd-b--xs'
                            to='/notifications'
                            activeClassName='sidebar__active-link'>
                            <i className='fa fa-bell'></i>
                            <span className='text--bold mg-l--sm'>
                                Notifications
                            </span>
                        </NavLink>
                        <NavLink
                            className='d--block font--lg text--gray pd-t--xs pd-b--xs'
                            to='/users'
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
