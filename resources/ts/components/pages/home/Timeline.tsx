import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Post from 'pages/general/Post';
import PostBox from './PostBox';
import Spinner from 'helpers/Spinner';
import { State } from 'types/redux';
import { Post as PostProps } from 'types/models';
import { set } from 'actions';

const Timeline: FC = (): ReactElement => {
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);
    const posts = useSelector((state: State) => state.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        getPosts();
    }, []);

    async function getPosts() {
        setLoadingPosts(true);

        const { data } = await axios.post('/api/posts/friends');

        dispatch(set('posts', data.items));
        setLoadingPosts(false);
    }

    return (
        <section className='flex--1 pd-t--lg pd-b--lg pd-l--sm pd-r--sm timeline'>
            <PostBox />

            {loadingPosts ? (
                <Spinner />
            ) : !loadingPosts && !posts.length ? (
                <h4 className='text--gray text--center mg-t--md'>
                    Find some people to follow to fill up your timeline.
                </h4>
            ) : (
                <div>
                    {posts.map((post: PostProps) => (
                        <Post key={post.id} namespace='timeline' {...post} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Timeline;
