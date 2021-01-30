import { Link } from 'react-router-dom';
import { NotificationType } from 'views/Notifications';
import DefaultAvatar from 'helpers/DefaultAvatar';

interface Props {
    notif: NotificationType;
    updateEvent: () => void;
}

function Notification({ notif, updateEvent }: Props) {
    return (
        <div className='mg-t--md'>
            <Link
                to={notif.data.url}
                className={`d--flex ai--center pd--sm text--black-light b--1 brdr--primary b-rad--md ${
                    !notif.read_at ? 'bg--gray-light' : ''
                }`}
                onClick={updateEvent}>
                {!notif.data.image_url ? (
                    <DefaultAvatar gender={notif.data.gender} size={40} />
                ) : (
                    <img
                        className='round notification__profile-photo'
                        src={notif.data.image_url}
                    />
                )}

                {notif.data.event_type === 'FOLLOW' ? (
                    <p className='text--black-light mg-l--sm'>
                        <b className='text--black'>{notif.data.name}</b>{' '}
                        followed you.
                    </p>
                ) : notif.data.event_type === 'LIKE' ? (
                    <p className='text--black-light mg-l--sm'>
                        <b className='text--black'>{notif.data.name}</b> liked
                        your post.
                    </p>
                ) : notif.data.event_type === 'COMMENT' ? (
                    <p className='text--black-light mg-l--sm'>
                        <b className='text--black'>{notif.data.name}</b>{' '}
                        commented on your post.
                    </p>
                ) : notif.data.event_type === 'OP_COMMENT' ? (
                    <p className='text--black-light mg-l--sm'>
                        <b className='text--black'>{notif.data.name}</b>{' '}
                        commented on {notif.data.gender} post.
                    </p>
                ) : null}
            </Link>

            <span className='font--sm text--gray'>{notif.time_diff}</span>
        </div>
    );
}

export default Notification;
