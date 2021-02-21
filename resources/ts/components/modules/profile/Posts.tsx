import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from 'modules/Post';
import Spinner from 'helpers/Spinner';
import { Post as PostType } from 'types/models';
import useInfiniteScroll from 'hooks/useInfiniteScroll';

interface Props {
    section?: string;
}

interface RouteParams {
    username: string;
}

function Posts({ section }: Props) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
    const scrollTarget = useRef<HTMLDivElement>(null);
    const { username }: RouteParams = useParams();
    const postRoute = `/api/posts/u/${username}/${section || 'posts'}`;

    function deletePost(id: number) {
        setPosts(posts => posts.filter(post => post.id !== id));
    }

    function getPosts() {
        setLoadingPosts(true);

        axios.post(postRoute).then(({ data }) => {
            setPosts(data.items);
            setLoadingPosts(false);
        });
    }

    function ioFunction(observer: IntersectionObserver) {
        setLoadingPosts(true);

        const date = posts[posts.length - 1].updated_at;

        axios.post(postRoute, { date }).then(({ data }) => {
            if (data.has_more) {
                setPosts(p => [...p, ...data.items]);
            }

            if (!data.has_more && scrollTarget && scrollTarget.current) {
                observer.unobserve(scrollTarget.current);
            }

            setLoadingPosts(false);
        });
    }

    useInfiniteScroll(scrollTarget, ioFunction, posts);

    useEffect(() => {
        getPosts();
    }, [section, username]);

    if (!loadingPosts && !posts.length) {
        return (
            <h4 className='text--gray text--bold text--center pd-t--md pd-b--md pd-l--sm pd-r--sm'>
                {section === 'likes'
                    ? 'No liked post yet.'
                    : section === 'comments'
                    ? 'No comment yet.'
                    : section === 'bookmarks'
                    ? 'No bookmarked post yet.'
                    : 'No post.'}
            </h4>
        );
    }

    return (
        <section className='pd-b--lg pd-l--sm pd-r--sm'>
            <div>
                <div>
                    {posts.map((post: PostType) => (
                        <Post
                            key={post.id}
                            namespace='profile'
                            deleteEvent={deletePost}
                            {...post}
                        />
                    ))}
                </div>

                <div ref={scrollTarget}></div>

                {loadingPosts && <Spinner containerClassName='mg-t--md' />}
            </div>
        </section>
    );
}

export default Posts;
