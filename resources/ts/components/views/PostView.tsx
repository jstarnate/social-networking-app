import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import Post from 'modules/Post';
import CommentsSection from 'modules/postView/CommentsSection';
import { State } from 'types/redux';
import { Post as PostType } from 'types/models';
import { deletePost } from 'actions';

interface RouteParams {
    id?: number & string;
}

function PostView() {
    const { id } = useParams<RouteParams>();
    const post = useSelector((state: State) =>
        state.posts.find(p => p.id === Number(id))
    );
    const [tweet, setTweet] = useState<PostType | undefined>(post);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const history = useHistory();

    async function getPost() {
        setLoading(true);

        const { data } = await axios.post('/api/posts/fetch', {
            id: Number(id),
        });

        setTweet(data.post);
        setLoading(false);
    }

    function destroyPost(id: number) {
        dispatch(deletePost(Number(id)));
        history.goBack();
    }

    function modifyCount(operation: 'increment' | 'decrement') {
        setTweet(current => {
            if (current) {
                return {
                    ...current,
                    comments:
                        operation === 'increment'
                            ? current.comments + 1
                            : current.comments - 1,
                };
            }

            return current;
        });
    }

    useEffect(() => {
        if (!tweet) {
            getPost();
        }
    }, []);

    if (!tweet) {
        return <h1>Not found</h1>;
    }

    return (
        <section className='flex--1 pd-t--xs pd-b--lg pd-l--sm pd-r--sm timeline'>
            {!loading && tweet && (
                <Post
                    key={1}
                    namespace='timeline'
                    deleteEvent={destroyPost}
                    render={commentsCount => (
                        <button className='btn font--lg mg-l--xl'>
                            <i className='fa fa-comment-o text--black-light'></i>
                            <span className='text--black-light mg-l--xxs'>
                                {commentsCount}
                            </span>
                        </button>
                    )}
                    {...tweet}
                />
            )}

            <CommentsSection
                postId={Number(id)}
                userGender={tweet?.user.gender || null}
                avatarLink={tweet?.user.image_url || null}
                incrementEvent={modifyCount.bind(null, 'increment')}
                decrementEvent={modifyCount.bind(null, 'decrement')}
            />
        </section>
    );
}

export default PostView;
