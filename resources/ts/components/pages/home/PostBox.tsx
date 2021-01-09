import React, { FC, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { unshiftAdd } from 'actions';
import useLimitedChars from 'hooks/useLimitedChars';

const PostBox: FC = (): ReactElement => {
    const [body, setBody] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [charsLeft, checkLength] = useLimitedChars(170, handleBodyValue);

    function handleBodyValue(value: string | null) {
        setBody(value);
    }

    async function submitPost() {
        setLoading(true);

        try {
            const { data } = await axios.post('/api/posts/create', { body });

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
                onChange={checkLength}></textarea>

            <div className='bt--1 brdr--primary d--flex ai--center pd-l--md'>
                <label>
                    <span className='text--black-light text--bold'>
                        {charsLeft}{' '}
                    </span>
                    <span className='text--black-light'>left</span>
                </label>
                <button
                    className='btn text--primary-dark text--bold pd-t--sm pd-b--sm pd-l--md pd-r--md mg-l--auto timeline__post-submit'
                    disabled={loading}
                    onClick={submitPost}>
                    Submit post
                </button>
            </div>
        </div>
    );
};

export default PostBox;
