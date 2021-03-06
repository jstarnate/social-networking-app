import { lazy, Suspense, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Spinner from 'helpers/Spinner';
import { Post as PostType } from 'types/models';
import useDebounce from 'hooks/useDebounce';

interface Props extends PostType {
    namespace: string;
    deleteEvent: (id: number) => void;
    render?: (comments: number) => ReactElement;
}

const Modal = lazy(() => import('helpers/Modal'));

function Post(props: Props) {
    const [liked, setLiked] = useState<boolean>(props.is_liked);
    const [bookmarked, setBookmarked] = useState<boolean>(props.bookmarked);
    const [likesCount, setLikesCount] = useState<number>(props.likes);
    const [
        showDeleteConfirmation,
        toggleDeleteConfirmation,
    ] = useState<boolean>(false);
    const likeEvent = useDebounce(toggleLikeButton, toggleLikeRequest, 2000);
    const bookmarkEvent = useDebounce(
        toggleBookmarkButton,
        toggleBookmarkRequest,
        2000
    );

    function closeDeleteModal() {
        toggleDeleteConfirmation(false);
    }

    function deletePost() {
        axios.delete(`/api/posts/delete/${props.id}`).then(() => {
            props.deleteEvent(props.id);
        });
    }

    function toggleLikeButton() {
        setLiked(isLiked => !isLiked);
        setLikesCount(count => (liked ? count - 1 : count + 1));
    }

    function toggleLikeRequest() {
        if (!liked) {
            axios.post('/api/posts/like', { id: props.id });
        } else {
            axios.post('/api/posts/dislike', { id: props.id });
        }
    }

    function toggleBookmarkButton() {
        setBookmarked(current => !current);
    }

    function toggleBookmarkRequest() {
        if (!bookmarked) {
            axios.post('/api/posts/bookmark', { id: props.id });
        } else {
            axios.post('/api/posts/unbookmark', { id: props.id });
        }
    }

    useEffect(() => {
        return () => {
            closeDeleteModal();
        };
    }, []);

    return (
        <div className='d--block bg--primary-pale b--1 brdr--primary-light b-rad--md pd--md mg-t--md'>
            <BasicUserInfo
                imageClassName='home__id-photo'
                avatarSize={55}
                fromSelf={props.from_self}
                {...props.user}>
                <button
                    className='btn pd-l--md mg-l--auto'
                    onClick={toggleDeleteConfirmation.bind(null, true)}>
                    <i className='fa fa-trash font--lg text--gray'></i>
                </button>
            </BasicUserInfo>

            <p
                className={`text--black-light mg-t--sm ${props.namespace}__post-body`}>
                {props.body}
            </p>

            <div className='mg-t--sm'>
                <button
                    className='btn font--lg home__post-action-button'
                    onClick={likeEvent}>
                    {liked ? (
                        <i className='fa fa-heart font--lg text--danger-dark'></i>
                    ) : (
                        <i className='fa fa-heart-o font--lg text--black-light'></i>
                    )}

                    <span
                        className={`font--sm font--lg text--${
                            liked ? 'danger-dark' : 'black-light'
                        } mg-l--xxs`}>
                        {likesCount}
                    </span>
                </button>

                {props.render ? (
                    props.render(props.comments)
                ) : (
                    <Link
                        to={`/posts/${props.id}/comments`}
                        className='btn font--lg mg-l--xl home__post-action-button'>
                        <i className='fa fa-comment-o text--black-light'></i>
                        <span className='text--black-light mg-l--xxs'>
                            {props.comments}
                        </span>
                    </Link>
                )}

                <button
                    className='btn mg-l--xl home__post-action-button'
                    onClick={bookmarkEvent}>
                    <i
                        className={`fa ${
                            bookmarked ? 'fa-bookmark' : 'fa-bookmark-o'
                        } font--lg text--black-light`}></i>
                </button>
            </div>

            {showDeleteConfirmation && (
                <Suspense
                    fallback={
                        <Spinner containerClassName='pos--fixed ai--center modal' />
                    }>
                    <Modal
                        title='Confirm delete'
                        color='bg--danger'
                        message='Are you sure you want to delete this post?'
                        closeEvent={closeDeleteModal}>
                        <button
                            className='btn btn--secondary font--sm b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md mg-r--sm'
                            onClick={closeDeleteModal}>
                            Cancel
                        </button>
                        <button
                            className='btn btn--danger font--sm text--bold b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md'
                            onClick={deletePost}>
                            Yes, delete
                        </button>
                    </Modal>
                </Suspense>
            )}
        </div>
    );
}

export default Post;
