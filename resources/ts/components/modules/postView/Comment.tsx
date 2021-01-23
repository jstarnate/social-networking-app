import { useState } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Modal from 'helpers/Modal';
import { User } from 'types/models';

interface CommentProps {
    id: number;
    body: string;
    from_self: boolean;
    user: User;
    deleteEvent: (commentId: number) => void;
}

function Comment({ id, body, from_self, user, deleteEvent }: CommentProps) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

    function showDeleteCommentConfirmation() {
        setShowModal(true);
    }

    function hideDeleteCommentConfirmation() {
        setShowModal(false);
    }

    async function deleteComment() {
        setShowModal(false);
        setLoadingDelete(true);

        await axios.delete(`/api/comments/${id}/destroy`);

        deleteEvent(id);
    }

    return (
        <>
            <div
                className={`b--1 brdr--primary b-rad--sm pd--md mg-t--md ${
                    loadingDelete ? 'disabled' : ''
                }`}>
                <div className='d--flex ai--center'>
                    <BasicUserInfo
                        className='d--flex ai--center'
                        avatarSize={45}
                        {...user}
                    />

                    {from_self && (
                        <button
                            className='btn mg-l--auto'
                            onClick={showDeleteCommentConfirmation}>
                            <i className='fa fa-trash font--md text--gray'></i>
                        </button>
                    )}
                </div>

                <p className='text--black mg-t--sm timeline__post-body'>
                    {body}
                </p>
            </div>

            {showModal && (
                <Modal
                    type='primary'
                    title='Confirm deletion'
                    message='Are you sure you want to delete your comment?'
                    closeEvent={hideDeleteCommentConfirmation}>
                    <div className='d--flex'>
                        <button
                            className='btn btn--primary-o pd-t--xs pd-b--xs pd-l--sm pd-r--sm b-rad--md mg-l--auto'
                            onClick={hideDeleteCommentConfirmation}>
                            Cancel
                        </button>
                        <button
                            className='btn btn--danger text--bold pd--xs b-rad--md mg-l--sm'
                            onClick={deleteComment}>
                            Delete comment
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}

export default Comment;
