import React, { ChangeEvent, FC, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { unshiftAdd } from 'actions';

const PostBox: FC = (): ReactElement => {
    const [body, setBody] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    function handleBodyValue(event: ChangeEvent<HTMLTextAreaElement>) {
        setBody(event.target.value);
    }

    async function submitPost() {
        setLoading(true);

        try {
            const { data } = await axios.post('/posts/create', { body });

            dispatch(unshiftAdd('posts', data.post));
            setBody(null);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    }

    return (
        <div className='b--1 brdr--primary b-rad--md'>
            <textarea
                rows={3}
                className='font--md text--black-light pd--sm timeline__post-input'
                placeholder="What's on your mind?"
                value={body || ''}
                onChange={handleBodyValue}></textarea>

            <div className='bt--1 brdr--primary d--flex jc--end'>
                <button
                    className='btn text--primary-dark text--bold pd-t--sm pd-b--sm pd-l--md pd-r--md timeline__post-submit'
                    disabled={loading}
                    onClick={submitPost}>
                    Submit post
                </button>
            </div>
        </div>
    );
};

export default PostBox;
