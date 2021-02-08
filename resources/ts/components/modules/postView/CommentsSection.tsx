import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import axios from 'axios';
import Spinner from 'helpers/Spinner';
import ProfilePhoto from 'helpers/ProfilePhoto';
import Comment from './Comment';
import { Comment as CommentType } from 'types/models';

interface Props {
    postId?: number | string;
    userGender: 'Male' | 'Female' | null;
    avatarLink: string | null;
}

function CommentsSection({ postId, userGender, avatarLink }: Props) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentBody, setCommentBody] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [commentLoading, setCommentLoading] = useState<boolean>(false);

    useEffect(() => {
        getComments();
    }, []);

    async function getComments() {
        setLoading(true);

        const { data } = await axios.post('/api/comments/get', { postId });

        setComments(data.items);
        setLoading(false);
    }

    async function submitComment() {
        setCommentLoading(true);

        try {
            const { data } = await axios.post('/api/comments/store', {
                id: postId,
                body: commentBody,
            });

            setComments([data.comment, ...comments]);
            setCommentBody(null);
            setCommentLoading(false);

            // TODO: Increment comments count upon creation of comment
        } catch (e) {
            setCommentLoading(false);
        }
    }

    function handleCommentBody(event: ChangeEvent<HTMLTextAreaElement>) {
        setCommentBody(event.target.value);
    }

    function handleCommentBoxKeypress(
        event: KeyboardEvent<HTMLTextAreaElement>
    ) {
        // TODO: Prevent user from typing if length is >= 250.

        if (event.key === 'Enter' && !event.shiftKey) {
            submitComment();
            return;
        }
    }

    function deleteCommentEvent(id: number) {
        const filtered = comments.filter(comment => comment.id !== id);
        setComments(filtered);
    }

    if (loading) {
        return (
            <div className='mg-t--md'>
                <Spinner size={30} color='#7EAEE7' />
            </div>
        );
    }

    return (
        <div className='mg-t--md'>
            <h4 className='d--flex ai--center text--gray text--bold'>
                <span>Comments</span>
                <span className='round bg--gray home__big-dot mg-l--xxs mg-r--xxs'></span>
                <span>{comments.length}</span>
            </h4>

            <div className='d--flex ai--start mg-t--md'>
                <ProfilePhoto
                    src={avatarLink}
                    gender={userGender}
                    size={45}
                    alt='Profile photo'
                />

                {/* FIXME: Make comment box stretchable. */}
                <textarea
                    className='full-width flex--1 font--md text--black pd-t--xs pd-b--xs pd-l--sm pd-r--sm b--1 brdr--gray mg-l--xs home__comment-box'
                    maxLength={250}
                    rows={1}
                    placeholder='Press Enter to submit comment'
                    value={commentBody || ''}
                    disabled={commentLoading}
                    onChange={handleCommentBody}
                    onKeyPress={handleCommentBoxKeypress}></textarea>

                {/* TODO: Add "characters left" indicator */}
            </div>

            {!loading && !!comments.length && (
                <div>
                    {comments.map(comment => (
                        <Comment
                            key={comment.id}
                            deleteEvent={deleteCommentEvent}
                            {...comment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentsSection;
