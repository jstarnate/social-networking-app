import MaleDefaultAvatar from './MaleDefaultAvatar';
import FemaleDefaultAvatar from './FemaleDefaultAvatar';

interface Props {
    className?: string;
    gender: 'Male' | 'Female' | null;
    size?: number;
    src: string | null;
    alt?: string;
}

function ProfilePhoto({ className, gender, size, src, alt }: Props) {
    if (!src && gender === 'Male') {
        return <MaleDefaultAvatar className={className} size={size} />;
    }

    if (!src && gender === 'Female') {
        return <FemaleDefaultAvatar className={className} size={size} />;
    }

    return (
        <img
            className={`round ${className}`}
            src={src || undefined}
            alt={alt}
        />
    );
}

export default ProfilePhoto;
