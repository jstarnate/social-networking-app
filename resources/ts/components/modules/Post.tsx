import { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Modal from 'helpers/Modal';
import { Post as PostType } from 'types/models';
import useDebounce from 'hooks/useDebounce';

interface PostProps extends PostType {
    namespace: string;
    deleteEvent: (id: number) => void;
    render?: (comments: number) => ReactElement;
}

function Post(props: PostProps) {
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

    async function deletePost() {
        await axios.delete(`/api/posts/delete/${props.id}`);
        props.deleteEvent(props.id);
    }

    function toggleLikeButton() {
        setLiked(isLiked => !isLiked);
        setLikesCount(count => (liked ? count - 1 : count + 1));
    }

    async function toggleLikeRequest() {
        if (!liked) {
            await axios.post('/api/posts/like', { id: props.id });
        } else {
            await axios.post('/api/posts/dislike', { id: props.id });
        }
    }

    function toggleBookmarkButton() {
        setBookmarked(current => !current);
    }

    async function toggleBookmarkRequest() {
        if (!bookmarked) {
            await axios.post('/api/posts/bookmark', { id: props.id });
        } else {
            await axios.post('/api/posts/unbookmark', { id: props.id });
        }
    }

    useEffect(() => {
        return () => {
            closeDeleteModal();
        };
    }, []);

    return (
        <div className='d--block bg--primary-pale b--1 brdr--primary-light b-rad--md pd--md mg-t--md'>
            <div className='d--flex ai--center'>
                <BasicUserInfo
                    className='d--if ai--center'
                    imageClassName='home__id-photo'
                    {...props.user}
                />

                {props.from_self && (
                    <button
                        className='btn font--lg mg-l--auto'
                        onClick={toggleDeleteConfirmation.bind(null, true)}>
                        <i className='fa fa-trash text--gray'></i>
                    </button>
                )}
            </div>

            <p
                className={`text--black-light mg-t--sm ${props.namespace}__post-body`}>
                {props.body}
            </p>

            <div className='mg-t--sm'>
                <button className='btn font--lg' onClick={likeEvent}>
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
                        className='btn font--lg mg-l--xl'>
                        <i className='fa fa-comment-o text--black-light'></i>
                        <span className='text--black-light mg-l--xxs'>
                            {props.comments}
                        </span>
                    </Link>
                )}

                <button className='btn mg-l--xl' onClick={bookmarkEvent}>
                    <i
                        className={`fa ${
                            bookmarked ? 'fa-bookmark' : 'fa-bookmark-o'
                        } font--lg text--black-light`}></i>
                </button>
            </div>

            {showDeleteConfirmation && (
                <Modal
                    title='Confirm delete'
                    type='danger'
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
            )}
        </div>
    );
}

export default Post;
