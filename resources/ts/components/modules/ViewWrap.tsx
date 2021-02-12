import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

function ViewWrap({ children }: Props) {
    return (
        <section className='flex--1'>
            <header className='pos--sticky full-width d--flex jc--center bg--white bb--1 brdr--primary-light pd-t--xs pd-b--xs header'>
                <a href='/home'>
                    <svg
                        width='30'
                        height='30'
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
            </header>

            {children}
        </section>
    );
}

export default ViewWrap;
