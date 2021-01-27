import MaleDefaultAvatar from './MaleDefaultAvatar';
import FemaleDefaultAvatar from './FemaleDefaultAvatar';

interface AvatarProps {
    gender: 'Male' | 'Female' | null;
    size?: number;
}

function DefaultAvatar({ gender, size }: AvatarProps) {
    if (gender === 'Female') {
        return <FemaleDefaultAvatar size={size} />;
    }

    return <MaleDefaultAvatar size={size} />;
}

export default DefaultAvatar;
