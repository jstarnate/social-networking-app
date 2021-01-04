import React, {
    FC,
    ReactElement,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Post from 'pages/general/Post';
import PostBox from './PostBox';
import Spinner from 'helpers/Spinner';
import { State } from 'types/redux';
import { Post as PostProps } from 'types/models';
import { pushSpread } from 'actions';

const Timeline: FC = (): ReactElement => {
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
    const posts = useSelector((state: State) => state.posts);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const ioCallback: IntersectionObserverCallback = useCallback(
        async (entries, observer) => {
            if (entries[0].isIntersecting) {
                setLoadingPosts(true);

                const date = posts[posts.length - 1].updated_at;
                const { data } = await axios.post('/api/posts/friends', {
                    date,
                });

                if (data.has_more) {
                    dispatch(pushSpread('posts', data.items));
                }

                if (!data.has_more && scrollTarget && scrollTarget.current) {
                    observer.unobserve(scrollTarget.current);
                }

                setLoadingPosts(false);
            }
        },
        [posts]
    );

    async function getPosts() {
        setLoadingPosts(true);

        const { data } = await axios.post('/api/posts/friends');

        dispatch(pushSpread('posts', data.items));
        setLoadingPosts(false);
    }

    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0,
        };

        const observer = new IntersectionObserver(ioCallback, options);

        if (scrollTarget && scrollTarget.current) {
            observer.observe(scrollTarget.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [ioCallback]);

    return (
        <section className='flex--1 pd-t--lg pd-b--lg pd-l--sm pd-r--sm timeline'>
            <PostBox />

            {!posts.length ? (
                <h4 className='text--gray text--center mg-t--md'>
                    Find some people to follow to fill up your timeline.
                </h4>
            ) : (
                <div>
                    <div>
                        {posts.map((post: PostProps) => (
                            <Post
                                key={post.id}
                                namespace='timeline'
                                {...post}
                            />
                        ))}
                    </div>

                    <div ref={scrollTarget}></div>

                    {loadingPosts && <Spinner />}
                </div>
            )}
        </section>
    );
};

export default Timeline;
