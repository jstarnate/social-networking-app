import React, { FC, ReactElement } from 'react';

interface ModalProps {
    title: string;
    type: string;
    message: string | null;
    closeEvent?: () => void;
    children?: ReactElement;
}

const AlertBox: FC<ModalProps> = ({
    title,
    type,
    message,
    closeEvent,
    children,
}: ModalProps): ReactElement => {
    return (
        <div className='pos--fixed modal'>
            <div className='bg--white b-rad--md mg-l--auto mg-r--auto modal__main'>
                <header className={`d--flex bg--${type} pd--sm modal__head`}>
                    <h3 className='text--white'>{title}</h3>
                    <button className='btn mg-l--auto' onClick={closeEvent}>
                        <i className='fa fa-times font--lg text--white'></i>
                    </button>
                </header>

                <p className='font--md text--black-light pd--sm modal__body'>
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
