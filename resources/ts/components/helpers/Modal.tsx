import React, { FC, ReactElement } from 'react';

interface ModalProps {
    title: string;
    type: string;
    message: string | null;
    children?: ReactElement;
}

const AlertBox: FC<ModalProps> = ({
    title,
    type,
    message,
    children,
}: ModalProps): ReactElement => {
    return (
        <div className='pos--fixed modal'>
            <div className='bg--white b-rad--md mg-l--auto mg-r--auto modal__main'>
                <header className={`d--flex bg--${type} pd--xs modal__head`}>
                    <h3 className='text--white'>{title}</h3>
                </header>

                <p className='font--md text--black-light pd-t--sm pd-b--sm pd-l--xs pd-r--xs modal__body'>
                    {message}
                </p>

                <footer
                    className={`d--flex jc--end bt--1 brdr--${type} pd--sm`}>
                    {children || (
                        <a
                            className='btn btn--primary font--sm text--bold b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md'
                            href='/index'>
                            Got it!
                        </a>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default AlertBox;
