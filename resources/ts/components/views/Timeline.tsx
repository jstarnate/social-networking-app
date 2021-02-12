import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import PostBox from 'modules/timeline/PostBox';
import Post from 'modules/Post';
import Spinner from 'helpers/Spinner';
import { State } from 'types/redux';
import { Post as PostProps } from 'types/models';
import { pushSpread, deletePost } from 'actions';
import useInfiniteScroll from 'hooks/useInfiniteScroll';

function Timeline() {
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
    const posts = useSelector((state: State) => state.posts);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    async function ioFunction(observer: IntersectionObserver) {
        setLoadingPosts(true);

        const date = posts[posts.length - 1]?.updated_at || null;
        const { data } = await axios.post('/api/posts', { date });

        if (data.has_more) {
            dispatch(pushSpread('posts', data.items));
        }

        if (!data.has_more && scrollTarget && scrollTarget.current) {
            observer.unobserve(scrollTarget.current);
        }

        setLoadingPosts(false);
    }

    function deletePostEvent(id: number) {
        dispatch(deletePost(id));
    }

    useInfiniteScroll(scrollTarget, ioFunction, posts);

    return (
        <div className='pd-t--lg pd-b--lg pd-l--sm pd-r--sm timeline'>
            <PostBox />

            {!loadingPosts && !posts.length ? (
                <h4 className='text--gray text--center mg-t--md'>
                    Find some people to follow to fill up your timeline.
                </h4>
            ) : (
                <div>
                    {posts.map((post: PostProps) => (
                        <Post
                            key={post.id}
                            namespace='timeline'
                            deleteEvent={deletePostEvent}
                            {...post}
                        />
                    ))}
                </div>
            )}

            <div ref={scrollTarget}></div>

            {loadingPosts && <Spinner />}
        </div>
    );
}

export default Timeline;
