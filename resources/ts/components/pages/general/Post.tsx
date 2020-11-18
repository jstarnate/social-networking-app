import React, { FC, ReactElement, useState } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { Post as PostExtension } from 'types/models';

interface PostProps extends PostExtension {
    namespace: string;
}

const Post: FC<PostProps> = (props: PostProps): ReactElement => {
    const [liked, setLiked] = useState<boolean>(props.is_liked);
    const [bookmarked, setBookmarked] = useState<boolean>(props.bookmarked);
    const [likesCount, setLikesCount] = useState<number>(props.likes);

    async function like() {
        setLiked(true);
        setLikesCount(likesCount => likesCount + 1);

        try {
            await axios.post('/posts/like', { id: props.id });
        } catch (error) {
            setLiked(false);
            setLikesCount(likesCount);
        }
    }

    async function dislike() {
        setLiked(false);
        setLikesCount(likesCount => likesCount - 1);

        try {
            await axios.post('/posts/dislike', { id: props.id });
        } catch (error) {
            setLiked(false);
            setLikesCount(likesCount => likesCount - 1);
        }
    }

    async function bookmark() {
        setBookmarked(true);

        try {
            await axios.post('/posts/bookmark', { id: props.id });
        } catch (error) {
            setBookmarked(false);
        }
    }

    async function unbookmark() {
        setBookmarked(false);

        try {
            await axios.post('/posts/unbookmark', { id: props.id });
        } catch (error) {
            setBookmarked(true);
        }
    }

    return (
        <div className='d--block b--1 brdr--primary b-rad--md pd--md mg-t--md'>
            <BasicUserInfo className='d--if ai--center' {...props.user} />

            <p
                className={`text--black-light mg-t--sm ${props.namespace}__post-body`}>
                {props.body}
            </p>

            <div className='mg-t--sm'>
                {liked ? (
                    <button className='btn font--lg' onClick={dislike}>
                        <i className='fa fa-heart text--danger-dark'></i>
                        <span className='font--sm text--danger-dark mg-l--xxs'>
                            {likesCount}
                        </span>
                    </button>
                ) : (
                    <button className='btn font--lg' onClick={like}>
                        <i className='fa fa-heart-o text--black-light'></i>
                        <span className='font--sm text--black-light mg-l--xxs'>
                            {likesCount}
                        </span>
                    </button>
                )}

                <button className='btn font--lg mg-l--xl'>
                    <i className='fa fa-comment-o text--black-light'></i>
                    <span className='text--black-light mg-l--xxs'>
                        {props.comments}
                    </span>
                </button>

                {bookmarked ? (
                    <button
                        className='btn font--lg mg-l--xl'
                        onClick={unbookmark}>
                        <i className='fa fa-bookmark text--black-light'></i>
                    </button>
                ) : (
                    <button
                        className='btn font--lg mg-l--xl'
                        onClick={bookmark}>
                        <i className='fa fa-bookmark-o text--black-light'></i>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Post;
