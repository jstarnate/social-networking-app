import { FC, ReactElement, useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from 'pages/general/Post';
import Spinner from 'helpers/Spinner';
import { Post as PostModel } from 'types/models';

interface PostsProps {
    section?: string;
}

interface RouteParams {
    username: string;
}

const Posts: FC<PostsProps> = ({ section }: PostsProps): ReactElement => {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const { username }: RouteParams = useParams();

    async function getPosts() {
        setLoadingPosts(true);

        const route = section
            ? `/api/users/u/${username}/${section}`
            : `/api/users/u/${username}/posts`;
        const { data } = await axios.post(route);

        setPosts(data.items);
        setLoadingPosts(false);
    }

    const ioCallback: IntersectionObserverCallback = useCallback(
        async (entries, observer) => {
            if (entries[0].isIntersecting) {
                setLoadingPosts(true);

                const date = posts[posts.length - 1].updated_at;
                const route = `/api/users/u/${username}/${section || 'posts'}`;
                const { data } = await axios.post(route, { date });

                if (data.has_more) {
                    setPosts(p => [...p, ...data.items]);
                }

                if (!data.has_more && scrollTarget && scrollTarget.current) {
                    observer.unobserve(scrollTarget.current);
                }

                setLoadingPosts(false);
            }
        },
        [posts]
    );

    useEffect(() => {
        getPosts();
    }, [section, username]);

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

    if (!posts.length) {
        return (
            <section>
                <h4 className='text--gray text--bold text--center pd-t--md pd-b--md pd-l--sm pd-r--sm'>
                    {section === 'likes'
                        ? "You don't have any liked post yet."
                        : section === 'comments'
                        ? "You don't have any comment yet."
                        : section === 'bookmarks'
                        ? "You don't have any bookmarked post yet."
                        : "You haven't posted anything yet."}
                </h4>
            </section>
        );
    }

    return (
        <section className='pd-b--lg pd-l--sm pd-r--sm'>
            <div>
                <div>
                    {posts.map((post: PostModel) => (
                        <Post key={post.id} namespace='profile' {...post} />
                    ))}
                </div>

                <div ref={scrollTarget}></div>

                {loadingPosts && (
                    <div className='mg-t--md'>
                        <Spinner size={40} color='#7EAEE7' />
                    </div>
                )}
            </div>
        </section>
    );
};

export default Posts;
