import React, {
    FC,
    ReactElement,
    useState,
    useEffect,
    ChangeEvent,
    KeyboardEvent,
} from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Spinner from 'helpers/Spinner';
import MaleDefaultAvatar from 'helpers/MaleDefaultAvatar';
import FemaleDefaultAvatar from 'helpers/FemaleDefaultAvatar';
import { Comment } from 'types/models';

interface CommentsSectionProps {
    postId: number | string | undefined;
    userGender: string | null;
    avatarLink: string | undefined;
}

const CommentsSection: FC<CommentsSectionProps> = ({
    postId,
    userGender,
    avatarLink,
}: CommentsSectionProps): ReactElement => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentBody, setCommentBody] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [commentLoading, setCommentLoading] = useState<boolean>(false);

    useEffect(() => {
        getComments();
    }, []);

    async function getComments() {
        setLoading(true);

        const { data } = await axios.post('/comments/get', { postId });

        setComments(data.items);
        setLoading(false);
    }

    async function submitComment() {
        setCommentLoading(true);

        try {
            const { data } = await axios.post('/comments/store', {
                id: postId,
                body: commentBody,
            });

            setComments([data.comment, ...comments]);
            setCommentBody(null);
            setCommentLoading(false);

            // this.$store.commit('update', {
            //     key: 'posts',
            //     id: this.$route.params.id,
            //     payload: { comments: this.post.comments + 1 },
            // });
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
        // if (event.target.value.length >= 250) {
        //     event.preventDefault();
        // }

        if (event.key === 'Enter' && !event.shiftKey) {
            submitComment();
            return;
        }
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
                {userGender === 'Male' && !avatarLink ? (
                    <MaleDefaultAvatar size={45} />
                ) : userGender === 'Female' && !avatarLink ? (
                    <FemaleDefaultAvatar size={45} />
                ) : (
                    <img
                        className='circle'
                        src={avatarLink}
                        alt='Profile photo'
                    />
                )}

                <textarea
                    className='full-width flex--1 font--md text--black pd-t--xs pd-b--xs pd-l--sm pd-r--sm b--1 brdr--primary mg-l--xs home__comment-box'
                    maxLength={250}
                    rows={1}
                    placeholder='Press Enter to submit comment'
                    value={commentBody || ''}
                    disabled={commentLoading}
                    onChange={handleCommentBody}
                    onKeyPress={handleCommentBoxKeypress}></textarea>
            </div>

            {!loading && !!comments.length && (
                <div>
                    {comments.map(comment => (
                        <div
                            key={comment.id}
                            className='b--1 brdr--primary b-rad--sm pd--md mg-t--md'>
                            <BasicUserInfo
                                className='d--flex ai--center'
                                avatarSize={45}
                                {...comment.user}
                            />

                            <p className='text--black mg-t--sm timeline__post-body'>
                                {comment.body}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentsSection;
