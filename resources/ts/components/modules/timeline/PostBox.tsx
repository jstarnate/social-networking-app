import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { unshiftAdd } from 'actions';
import useLimitedChars from 'hooks/useLimitedChars';

function PostBox() {
    const [body, setBody] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [charsLeft, checkLength] = useLimitedChars(170, handleBodyValue);

    function handleBodyValue(value: string | null) {
        setBody(value);
    }

    function submitPost() {
        if (!body || !body.length) {
            return;
        }

        setLoading(true);

        axios
            .post('/api/posts/create', { body })
            .then(({ data }) => {
                dispatch(unshiftAdd('posts', data.post));
                setBody(null);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <div className='b--1 brdr--primary-light b-rad--md'>
            <textarea
                rows={3}
                className='font--md text--black-light pd--sm timeline__post-input'
                placeholder="What's on your mind?"
                value={body || ''}
                onChange={checkLength}></textarea>

            <div className='d--flex ai--center bt--1 brdr--primary-light pd-t--xs pd-b--xs pd-l--md pd-r--md'>
                <label className='text--gray'>{charsLeft}</label>
                <button
                    className='btn btn--primary text--white text--bold curved pd-t--xs pd-b--xs pd-l--md pd-r--md mg-l--auto'
                    disabled={loading}
                    onClick={submitPost}>
                    Submit post
                </button>
            </div>
        </div>
    );
}

export default PostBox;
