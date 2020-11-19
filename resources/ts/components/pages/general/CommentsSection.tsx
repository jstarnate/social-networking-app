import React, { FC, ReactElement, useState, useEffect } from 'react';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Spinner from 'helpers/Spinner';

interface CommentsSectionProps {
    postId: number | string | undefined;
}

const CommentsSection: FC<CommentsSectionProps> = ({
    postId,
}: CommentsSectionProps): ReactElement => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        getComments();
    }, []);

    async function getComments() {
        setLoading(true);

        const { data } = await axios.post('/comments/get', { postId });

        setComments(data.items);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className='mg-t--md'>
                <Spinner size={30} color='#7EAEE7' />
            </div>
        );
    }

    if (!loading && !comments.length) {
        return (
            <div className='mg-t--md'>
                <h4 className='d--flex ai--center text--gray text--bold'>
                    <span>Comments</span>
                    <span className='round bg--gray home__big-dot mg-l--xxs mg-r--xxs'></span>
                    <span>0</span>
                </h4>
            </div>
        );
    }

    return (
        <div className='mg-t--md'>
            <h4 className='d--flex ai--center text--gray text--bold'>
                <span>Comments</span>
                <span className='round bg--gray home__big-dot mg-l--xxs mg-r--xxs'></span>
                <span>0</span>
            </h4>

            <div className='b--1 brdr--primary b-rad--sm pd--md mg-t--md'>
                <BasicUserInfo
                    className='d--flex ai--center'
                    full_name='Jon Snow'
                    username='jonsnow'
                    gender='Male'
                    image_url={undefined}
                    url='http://localhost:8000/u/jonsnow'
                />

                <p className='text--black mg-t--sm timeline__post-body'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nemo quos nisi praesentium minus, fugit enim illo laboriosam
                    sequi debitis totam voluptatibus ab ipsam iusto nostrum
                    incidunt officia veritatis optio ea?
                </p>
            </div>

            <div className='b--1 brdr--primary b-rad--sm pd--md mg-t--md'>
                <BasicUserInfo
                    className='d--flex ai--center'
                    full_name='Jon Snow'
                    username='jonsnow'
                    gender='Male'
                    image_url={undefined}
                    url='http://localhost:8000/u/jonsnow'
                />

                <p className='text--black mg-t--sm timeline__post-body'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nemo quos nisi praesentium minus, fugit enim illo laboriosam
                    sequi debitis totam voluptatibus ab ipsam iusto nostrum
                    incidunt officia veritatis optio ea?
                </p>
            </div>

            <div className='b--1 brdr--primary b-rad--sm pd--md mg-t--md'>
                <BasicUserInfo
                    className='d--flex ai--center'
                    full_name='Jon Snow'
                    username='jonsnow'
                    gender='Male'
                    image_url={undefined}
                    url='http://localhost:8000/u/jonsnow'
                />

                <p className='text--black mg-t--sm timeline__post-body'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nemo quos nisi praesentium minus, fugit enim illo laboriosam
                    sequi debitis totam voluptatibus ab ipsam iusto nostrum
                    incidunt officia veritatis optio ea?
                </p>
            </div>
        </div>
    );
};

export default CommentsSection;
