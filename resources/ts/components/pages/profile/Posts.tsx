import React, { FC, ReactElement, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from 'pages/general/Post';
import Spinner from 'helpers/Spinner';
import { Post as PostModel } from 'types/models';

const Posts: FC = (): ReactElement => {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
    const params: { username: string } = useParams();

    useEffect(() => {
        getPosts();
    }, []);

    async function getPosts() {
        setLoadingPosts(true);

        const { data } = await axios.get(`/users/u/${params.username}/posts`);

        setPosts(data.posts);
        setLoadingPosts(false);
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
