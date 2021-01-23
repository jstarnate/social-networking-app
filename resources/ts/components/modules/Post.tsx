import { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { Post as PostExtension } from 'types/models';
import useDebounce from 'hooks/useDebounce';

interface PostProps extends PostExtension {
    namespace: string;
    render?: (comments: number) => ReactElement;
}

function Post(props: PostProps) {
    const [liked, setLiked] = useState<boolean>(props.is_liked);
    const [bookmarked, setBookmarked] = useState<boolean>(props.bookmarked);
    const [likesCount, setLikesCount] = useState<number>(props.likes);
    const likeEvent = useDebounce(toggleLikeButton, toggleLikeRequest, 2000);

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

    async function bookmark() {
        setBookmarked(true);

        try {
            await axios.post('/api/posts/bookmark', { id: props.id });
        } catch (error) {
            setBookmarked(false);
        }
    }

    async function unbookmark() {
        setBookmarked(false);

        try {
            await axios.post('/api/posts/unbookmark', { id: props.id });
        } catch (error) {
            setBookmarked(true);
        }
    }

    return (
        <div className='d--block b--1 brdr--primary b-rad--md pd--md mg-t--md'>
            <BasicUserInfo
                className='d--if ai--center'
                imageClassName='home__id-photo'
                {...props.user}
            />

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

                {bookmarked ? (
                    <button className='btn mg-l--xl' onClick={unbookmark}>
                        <i className='fa fa-bookmark font--lg text--black-light'></i>
                    </button>
                ) : (
                    <button className='btn mg-l--xl' onClick={bookmark}>
                        <i className='fa fa-bookmark-o font--lg text--black-light'></i>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Post;
