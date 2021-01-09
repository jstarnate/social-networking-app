import React, { FC, ReactElement, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useCloseOnEscape from 'hooks/useCloseOnEscape';
import useOutsideClick from 'hooks/useOutsideClick';

interface ModalProps {
    title: string;
    type: string;
    message: string | null;
    closeEvent?: CallableFunction;
    children?: ReactElement;
}

const Content = ({
    title,
    type,
    message,
    closeEvent,
    children,
}: ModalProps) => {
    const modal = useRef<HTMLDivElement>(null);

    useOutsideClick(modal, closeEvent);

    return (
        <div className='pos--fixed modal'>
            <div
                ref={modal}
                className='bg--white b-rad--md mg-l--auto mg-r--auto modal__main'>
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

const AlertModal: FC<ModalProps> = (props: ModalProps): ReactElement => {
    const root = document.querySelector('#portal');
    const el = document.createElement('section');

    useCloseOnEscape(props.closeEvent);

    useEffect(() => {
        root?.appendChild(el);

        return () => {
            root?.removeChild(el);
        };
    }, [el, root]);

    return createPortal(<Content {...props} />, el);
};

export default AlertModal;
