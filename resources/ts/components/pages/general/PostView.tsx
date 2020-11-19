import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { State } from 'types/redux';
import { Post as PostInterface } from 'types/models';
import Post from './Post';
import CommentsSection from './CommentsSection';

interface RouteParams {
    id?: (number & string) | undefined;
}

const PostView: FC = (): ReactElement => {
    const { id } = useParams<RouteParams>();
    const post = useSelector((state: State) =>
        state.posts.find(p => p.id === Number(id))
    );
    const [tweet, setTweet] = useState<PostInterface | undefined>(post);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!tweet) {
            getPost();
        }
    }, []);

    async function getPost() {
        setLoading(true);

        const { data } = await axios.post('/posts/fetch', { id });

        setTweet(data.post);
        setLoading(false);
    }

    return (
        <section className='flex--1 pd-t--xs pd-b--lg pd-l--sm pd-r--sm timeline'>
            {!loading && tweet && (
                <Post
                    key={1}
                    namespace='timeline'
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

            <CommentsSection postId={id} />
        </section>
    );
};

export default PostView;
