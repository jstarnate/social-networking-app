import { FC, FormEvent, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InputField from 'helpers/InputField';
import MaleDefaultAvatar from 'helpers/MaleDefaultAvatar';
import FemaleDefaultAvatar from 'helpers/FemaleDefaultAvatar';
import useInput from 'hooks/useInput';
import useLimitedChars from 'hooks/useLimitedChars';
import { UserWithId } from 'types/models';

interface AuthUser extends UserWithId {
    location: string | null;
    bio: string | null;
}

interface EditProfileProps {
    user: AuthUser | null;
}

const EditProfile: FC<EditProfileProps> = ({
    user,
}: EditProfileProps): ReactElement => {
    const [full_name, fullNameData, setFullNameError] = useInput(
        user?.full_name
    );
    const [username, usernameData, setUsernameError] = useInput(user?.username);
    const [location, locationData] = useInput(user?.location);
    const [bio, setBio] = useState<string | null | undefined>(user?.bio);
    const [bioError, setBioError] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [bioCharsLeft, checkBioLength] = useLimitedChars(90, handleBioValue);

    function handleBioValue(value: string | null) {
        setBio(value);
    }

    async function updateUser(event: FormEvent) {
        event.preventDefault();

        setUpdateLoading(true);

        try {
            await axios.put('/api/users/auth/update', {
                id: user?.id,
                full_name,
                username,
                location,
                bio,
            });

            localStorage.removeItem('user');
            window.location.href = `/u/${username}`;
        } catch (error) {
            if (error.response.status === 422) {
                const { errors } = error.response.data;

                setFullNameError(errors.full_name);
                setUsernameError(errors.username);
                setBioError(errors.bio ? errors.bio[0] : null);
            }

            setUpdateLoading(false);
        }
    }

    return (
        <section className='flex--1'>
            <header className='d--flex ai--center bb--1 brdr--primary'>
                <Link
                    to={`/u/${user?.username}`}
                    className='btn text--primary pd-t--sm pd-b--sm pd-l--md pd-r--md'>
                    <i className='fa fa-arrow-left'></i>
                </Link>
                <h3 className='text--black'>Update your profile</h3>
            </header>

            <form
                className='pd--md mg-l--auto mg-r--auto profile__edit-profile-form'
                onSubmit={updateUser}>
                <div className='d--flex ai--center'>
                    <div className='pos--rel d--ib round profile__change-photo-container'>
                        {!user?.image_url && user?.gender === 'Male' ? (
                            <MaleDefaultAvatar size={100} />
                        ) : !user?.image_url && user?.gender === 'Female' ? (
                            <FemaleDefaultAvatar size={100} />
                        ) : (
                            <img
                                className='round profile__headline-profile-photo'
                                src={user?.image_url}
                                alt='Profile photo'
                            />
                        )}

                        <label
                            className='pos--abs d--block full-width text--center pd-t--xs pd-b--xs cursor--pointer profile__change-photo-button'
                            htmlFor='avatar'>
                            <i className='fa fa-camera text--white'></i>
                        </label>

                        <input
                            id='avatar'
                            className='d--none'
                            type='file'
                            accept='.jpg,jpeg,.png'
                        />
                    </div>

                    <span className='font--sm text--black-light mg-l--sm'>
                        Max size:
                        <br />
                        200x200
                    </span>
                </div>

                <InputField
                    containerClassName='mg-t--md'
                    inputClassName='text--black b--1 brdr-black-light b-rad--sm full-width pd--xs mg-t--xxs'
                    id='name'
                    label='Name'
                    {...fullNameData}
                />

                <InputField
                    containerClassName='mg-t--md'
                    inputClassName='text--black b--1 brdr-black-light b-rad--sm full-width pd--xs mg-t--xxs'
                    id='username'
                    label='Username'
                    {...usernameData}
                />

                <InputField
                    containerClassName='mg-t--md'
                    inputClassName='text--black b--1 brdr-black-light b-rad--sm full-width pd--xs mg-t--xxs'
                    id='location'
                    label='Location'
                    {...locationData}
                />

                <div className='mg-t--md'>
                    <label
                        className={`text--bold ${
                            bioError ? 'text--danger' : 'text--black-light'
                        }`}
                        htmlFor='bio'>
                        {bioError || 'Bio'}
                    </label>
                    <textarea
                        id='bio'
                        className={`text--black b--1 ${
                            bioError ? 'brdr-danger' : 'brdr-black-light'
                        } b-rad--sm full-width pd--xs mg-t--xxs profile__edit-bio`}
                        rows={3}
                        value={bio || ''}
                        onChange={checkBioLength}></textarea>

                    <span className='d--block font--sm text--right text--black-light'>
                        {bioCharsLeft}
                    </span>
                </div>

                <button
                    className='btn btn--primary text--bold b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md mg-t--md'
                    disabled={updateLoading}>
                    Update profile
                </button>
            </form>
        </section>
    );
};

export default EditProfile;
