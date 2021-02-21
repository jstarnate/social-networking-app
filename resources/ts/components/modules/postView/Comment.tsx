import { useState, useEffect } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Modal from 'helpers/Modal';
import { Comment as CommentType } from 'types/models';

interface Props extends CommentType {
    deleteEvent: (id: number) => void;
}

function Comment({ id, body, from_self, user, deleteEvent }: Props) {
    const [showModal, setShowModal] = useState<boolean>(false);

    function showDeleteCommentConfirmation() {
        setShowModal(true);
    }

    function hideDeleteCommentConfirmation() {
        setShowModal(false);
    }

    function deleteComment() {
        axios.delete(`/api/comments/${id}/destroy`).then(() => {
            deleteEvent(id);
        });
    }

    useEffect(() => {
        return () => {
            hideDeleteCommentConfirmation();
        };
    }, []);

    return (
        <>
            <div className='full-width b--1 brdr--primary b-rad--sm pd--md mg-t--md'>
                <BasicUserInfo avatarSize={45} fromSelf={from_self} {...user}>
                    <button
                        className='btn pd-l--md mg-l--auto'
                        onClick={showDeleteCommentConfirmation}>
                        <i className='fa fa-trash font--lg text--gray'></i>
                    </button>
                </BasicUserInfo>

                <p className='text--black mg-t--sm timeline__post-body'>
                    {body}
                </p>
            </div>

            {showModal && (
                <Modal
                    title='Confirm deletion'
                    color='bg--danger'
                    message='Are you sure you want to delete your comment?'
                    closeEvent={hideDeleteCommentConfirmation}>
                    <button
                        className='btn btn--secondary font--sm b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md'
                        onClick={hideDeleteCommentConfirmation}>
                        Cancel
                    </button>
                    <button
                        className='btn btn--danger text--bold pd--xs b-rad--md mg-l--sm'
                        onClick={deleteComment}>
                        Delete comment
                    </button>
                </Modal>
            )}
        </>
    );
}

export default Comment;
