import { FC, ReactElement } from 'react';

interface Props {
    size?: number;
}

const MaleDefaultAvatar: FC<Props> = ({ size }: Props): ReactElement => {
    return (
        <svg
            className='d--block'
            width={size}
            height={size}
            viewBox='0 0 200 200'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <mask
                id='mask0'
                mask-type='alpha'
                maskUnits='userSpaceOnUse'
                x='0'
                y='0'
                width='200'
                height='200'>
                <circle cx='100' cy='100' r='100' fill='#C4C4C4' />
            </mask>
            <g mask='url(#mask0)'>
                <circle cx='100' cy='100' r='100' fill='#C4C4C4' />
                <ellipse
                    cx='100.5'
                    cy='178.5'
                    rx='61.5'
                    ry='78.5'
                    fill='#E9E9E9'
                />
                <circle cx='100' cy='69' r='50' fill='#DFDFDF' />
            </g>
        </svg>
    );
};

MaleDefaultAvatar.defaultProps = {
    size: 55,
};

export default MaleDefaultAvatar;
