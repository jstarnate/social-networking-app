interface Props {
    containerClassName?: string;
    size?: number;
    color?: string;
}

function Spinner({ containerClassName, size, color }: Props) {
    return (
        <div className={`d--flex jc--center ${containerClassName}`}>
            <svg
                style={{
                    margin: 'auto',
                    shapeRendering: 'auto',
                }}
                className='d--block'
                width={size}
                height={size}
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
}

Spinner.defaultProps = {
    size: 35,
    color: '#7EAEE7',
};

export default Spinner;
