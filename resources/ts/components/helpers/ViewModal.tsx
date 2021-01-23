import { ReactElement, useRef } from 'react';
import useOutsideClick from 'hooks/useOutsideClick';
import useCloseOnEscape from 'hooks/useCloseOnEscape';

interface ViewModalProps {
    title: string;
    closeEvent: () => void;
    children: ReactElement;
}

function ViewModal(props: ViewModalProps) {
    const modal = useRef<HTMLDivElement>(null);

    useCloseOnEscape(props.closeEvent);
    useOutsideClick(modal, props.closeEvent);

    return (
        <div className='pos--fixed modal'>
            <div
                ref={modal}
                className='bg--white b-rad--md mg-l--auto mg-r--auto modal__main'>
                <header className='d--flex ai--center pd--sm bb--1 brdr--gray-light modal__head'>
                    <h4 className='text--black-light'>{props.title}</h4>
                    <button
                        className='btn text--gray text--bold mg-l--auto'
                        onClick={props.closeEvent}>
                        Close
                    </button>
                </header>

                {props.children}
            </div>
        </div>
    );
}

export default ViewModal;
