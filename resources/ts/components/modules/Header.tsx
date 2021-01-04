import React, { FC, ReactElement, useState, useRef } from 'react';
import SearchBar from './SearchBar';
import Portal from 'helpers/Portal';
import Modal from 'helpers/Modal';

const Header: FC = (): ReactElement => {
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
        <header className='pos--sticky bg--primary pd-t--sm pd-b--sm pd-l--lg pd-r--lg header'>
            <div className='d--flex ai--center mg-l--auto mg-r--auto header__wrap'>
                <a href='/home'>
                    <svg
                        width='40'
                        height='40'
                        viewBox='0 0 40 40'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'>
                        <circle cx='20' cy='20' r='20' fill='black' />
                        <path
                            d='M6.85718 12H18V29.1429L9.14289 20.2857M33.4286 12H24.8572M24.8572 12H21.7143L9.42861 31.1429M24.8572 12V31.7143'
                            stroke='white'
                            strokeWidth='2'
                        />
                    </svg>
                </a>

                <SearchBar />

                <button className='btn pd--xs mg-l--auto' onClick={enableModal}>
                    <i className='fa fa-sign-out font--md text--gray'></i>
                </button>
            </div>

            {showModal && (
                <Portal>
                    <Modal
                        namespace='home'
                        type='primary'
                        title='Sign out'
                        message='Are you sure you want to sign out?'>
                        <>
                            <button
                                className='btn btn--secondary font--sm b-ra--sm pd-t--xs pd-b--xs pd-l--md pd-r--md mg-r--sm'
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
                </Portal>
            )}
        </header>
    );
};

export default Header;
