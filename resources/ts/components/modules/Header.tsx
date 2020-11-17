import React, { FC, ReactElement } from 'react';
import SearchBar from './SearchBar';

const Header: FC = (): ReactElement => {
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

                <button className='btn pd--xs mg-l--auto'>
                    <i className='fa fa-sign-out font--md text--gray'></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
