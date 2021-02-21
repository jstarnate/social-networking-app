import { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Spinner from 'helpers/Spinner';
import ProfilePhoto from 'helpers/ProfilePhoto';
import Comment from './Comment';
import useLimitedChars from 'hooks/useLimitedChars';
import { Post as PostType, Comment as CommentType } from 'types/models';
import { State } from 'types/redux';
import { updatePost } from 'actions';

interface Props {
    postId: number;
    userGender: 'Male' | 'Female' | null;
    avatarLink: string | null;
    incrementEvent: () => void;
    decrementEvent: () => void;
}

function CommentsSection({
    postId,
    userGender,
    avatarLink,
    incrementEvent,
    decrementEvent,
}: Props) {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentBody, setCommentBody] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [commentLoading, setCommentLoading] = useState<boolean>(false);
    const posts = useSelector((state: State) => state.posts);
    const dispatch = useDispatch();
    const commentBox = useRef<HTMLTextAreaElement>(null);
    const [commentCharsLeft, checkCommentLength] = useLimitedChars(
        170,
        handleCommentValue
    );

    function modifyCount(operation: 'increment' | 'decrement') {
        if (posts.length) {
            const post = posts.find((p: PostType) => p.id === postId);

            if (post) {
                dispatch(
                    updatePost(postId, {
                        ...post,
                        comments:
                            operation === 'increment'
                                ? post.comments + 1
                                : post.comments - 1,
                    })
                );
            }
        }
    }

    function handleCommentValue(value: string | null) {
        setCommentBody(value);
        resizeCommentBox();
    }

    function handleCommentBoxKeypress(
        event: KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (event.key === 'Enter' && !event.shiftKey) {
            submitComment();
            return;
        }
    }

    function resizeCommentBox() {
        if (commentBox.current) {
            commentBox.current.style.height = 'auto';
            commentBox.current.style.height = `${commentBox.current.scrollHeight}px`;
        }
    }

    function getComments() {
        setLoading(true);

        axios.post('/api/comments/get', { postId }).then(({ data }) => {
            setComments(data.items);
            setLoading(false);
        });
    }

    function submitComment() {
        setCommentLoading(true);

        axios
            .post('/api/comments/store', {
                id: postId,
                body: commentBody,
            })
            .then(({ data }) => {
                setComments([data.comment, ...comments]);
                setCommentBody(null);
                setCommentLoading(false);
                incrementEvent();
                modifyCount('increment');
            })
            .catch(() => {
                setCommentLoading(false);
            });
    }

    function deleteCommentEvent(id: number) {
        const filtered = comments.filter(comment => comment.id !== id);

        setComments(filtered);
        decrementEvent();
        modifyCount('decrement');
    }

    useEffect(() => {
        getComments();

        if (commentBox.current) {
            commentBox.current.setAttribute('rows', '1');
            resizeCommentBox();
        }
    }, []);

    if (loading) {
        return (
            <div className='mg-t--md'>
                <Spinner size={30} color='#7EAEE7' />
            </div>
        );
    }

    return (
        <div className='mg-t--md'>
            <div>
                <span className='d--block font--sm text--black-light text--right pd-r--sm'>
                    {commentCharsLeft}
                </span>
                <div className='d--flex'>
                    <ProfilePhoto
                        src={avatarLink}
                        gender={userGender}
                        size={45}
                        alt='Profile photo'
                    />

                    <textarea
                        ref={commentBox}
                        className='full-width flex--1 font--md text--black pd-t--xs pd-b--xs pd-l--sm pd-r--sm b--1 curved brdr--gray mg-l--xs home__comment-box'
                        maxLength={250}
                        rows={1}
                        placeholder='Write a comment'
                        value={commentBody || ''}
                        disabled={commentLoading}
                        onChange={checkCommentLength}
                        onKeyPress={handleCommentBoxKeypress}></textarea>
                </div>
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
