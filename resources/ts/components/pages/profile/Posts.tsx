import React, { FC, ReactElement, useState, useEffect } from 'react';
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
    const { username }: RouteParams = useParams();

    useEffect(() => {
        getPosts();
    }, [section]);

    async function getPosts() {
        setLoadingPosts(true);

        const route = section
            ? `/api/users/u/${username}/${section}`
            : `/api/users/u/${username}/posts`;
        const { data } = await axios.get(route);

        setPosts(data.posts);
        setLoadingPosts(false);
    }

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
            {loadingPosts ? (
                <div className='mg-t--md'>
                    <Spinner size={40} color='#7EAEE7' />
                </div>
            ) : (
                <div>
                    {posts.map((post: PostModel) => (
                        <Post key={post.id} namespace='profile' {...post} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Posts;
