import React, { FC } from 'react';
import { LoaderInterface } from 'types/components';

const Spinner: FC<LoaderInterface> = ({
    className,
    size,
    color,
}: LoaderInterface) => {
    return (
        <div className='d--flex jc--center'>
            <svg
                style={{
                    margin: 'auto',
                    shapeRendering: 'auto',
                }}
                className={className}
                width={`${size}px`}
                height={`${size}px`}
                viewBox='0 0 100 100'
                preserveAspectRatio='xMidYMid'>
                <circle
                    cx='50'
                    cy='50'
                    r='32'
                    strokeWidth='8'
                    stroke={color}
                    strokeDasharray='50.26548245743669 50.26548245743669'
                    fill='none'
                    strokeLinecap='round'>
                    <animateTransform
                        attributeName='transform'
                        type='rotate'
                        repeatCount='indefinite'
                        dur='1s'
                        keyTimes='0;1'
                        values='0 50 50;360 50 50'></animateTransform>
                </circle>
            </svg>
        </div>
    );
};

Spinner.defaultProps = {
    size: 40,
    color: '#7EAEE7',
};

export default Spinner;
