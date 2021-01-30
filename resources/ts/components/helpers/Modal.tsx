import { ReactElement, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useCloseOnEscape from 'hooks/useCloseOnEscape';
import useOutsideClick from 'hooks/useOutsideClick';

interface ModalProps {
    title: string;
    type: string;
    message: string | null;
    closeEvent?: () => void;
    children?: ReactElement;
}

const Content = (props: ModalProps) => {
    const modal = useRef<HTMLDivElement>(null);

    useOutsideClick(modal, props.closeEvent);

    return (
        <div className='pos--fixed modal'>
            <div
                ref={modal}
                className='bg--white b-rad--md mg-l--auto mg-r--auto modal__main'>
                <header
                    className={`d--flex bg--${props.type} pd--xs modal__head`}>
                    <h3 className='text--white'>{props.title}</h3>
                </header>

                <p className='font--md text--black-light pd-t--sm pd-b--sm pd-l--xs pd-r--xs modal__body'>
                    {props.message}
                </p>

                <footer
                    className={`d--flex jc--end bt--1 brdr--${props.type} pd--sm`}>
                    {props.children || (
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

function AlertModal(props: ModalProps) {
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
}

export default AlertModal;
