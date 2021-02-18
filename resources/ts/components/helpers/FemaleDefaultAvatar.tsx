interface Props {
    className?: string;
    size?: number;
}

function FemaleDefaultAvatar({ className, size }: Props) {
    return (
        <div
            className={className}
            style={{ width: `${size}px`, height: `${size}px` }}>
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
                    <path
                        d='M176 116.5C176 103.04 174.034 89.7108 170.215 77.2749C166.395 64.8391 160.797 53.5396 153.74 44.0216C146.683 34.5035 138.305 26.9535 129.084 21.8023C119.863 16.6512 109.98 14 100 14C90.0195 14 80.1368 16.6512 70.9161 21.8024C61.6953 26.9535 53.3171 34.5036 46.2599 44.0216C39.2026 53.5396 33.6045 64.8391 29.7852 77.275C25.9658 89.7108 24 103.04 24 116.5L100 116.5H176Z'
                        fill='#B0B0B0'
                    />
                    <ellipse
                        cx='100.5'
                        cy='178.5'
                        rx='61.5'
                        ry='78.5'
                        fill='#E9E9E9'
                    />
                    <circle cx='100' cy='69' r='50' fill='#DFDFDF' />
                    <path
                        d='M150 51C150 46.7977 148.707 42.6365 146.194 38.7541C143.681 34.8717 139.998 31.3441 135.355 28.3726C130.712 25.4011 125.2 23.044 119.134 21.4359C113.068 19.8277 106.566 19 100 19C93.4339 19 86.9321 19.8277 80.8658 21.4359C74.7995 23.044 69.2876 25.4011 64.6447 28.3726C60.0017 31.3441 56.3188 34.8717 53.806 38.7541C51.2933 42.6366 50 46.7977 50 51L100 51H150Z'
                        fill='#B0B0B0'
                    />
                </g>
            </svg>
        </div>
    );
}

FemaleDefaultAvatar.defaultProps = {
    size: 55,
};

export default FemaleDefaultAvatar;
