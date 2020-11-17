import React, { FC, ReactElement } from 'react';

const PostBox: FC = (): ReactElement => {
    return (
        <div className='b--1 brdr--primary b-rad--md'>
            <textarea
                rows={3}
                className='font--md text--black-light pd--sm timeline__post-input'
                placeholder="What's on your mind?"></textarea>

            <div className='bt--1 brdr--primary d--flex jc--end'>
                <button className='btn text--primary-dark text--bold pd-t--sm pd-b--sm pd-l--md pd-r--md timeline__post-submit'>
                    Submit post
                </button>
            </div>
        </div>
    );
};

export default PostBox;
