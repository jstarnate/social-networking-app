import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import InputField from 'helpers/InputField';
import ProfilePhoto from 'helpers/ProfilePhoto';
import Ellipsis from 'helpers/Ellipsis';
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

interface ImageData {
    id: number | null;
    path: string | null;
}

function EditProfile({ user }: EditProfileProps) {
    const [full_name, fullNameData, setFullNameError] = useInput(
        user?.full_name
    );
    const [username, usernameData, setUsernameError] = useInput(user?.username);
    const [location, locationData] = useInput(user?.location);
    const [bio, setBio] = useState<string | null | undefined>(user?.bio);
    const [bioError, setBioError] = useState<string | null>(null);
    const [image, setImage] = useState<ImageData>({
        id: null,
        path: user?.image_url || null,
    });
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const [bioCharsLeft, checkBioLength] = useLimitedChars(90, handleBioValue);

    function handleBioValue(value: string | null) {
        setBio(value);
    }

    function upload(event: ChangeEvent<HTMLInputElement>) {
        setUploadLoading(true);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        };

        const formData = new FormData();

        if (event.target.files) {
            formData.append('image', event.target.files[0]);
        }

        axios
            .post('/api/users/upload', formData, config)
            .then(({ data }) => {
                setImage(data);
                setUploadLoading(false);
            })
            .catch(() => {
                setUploadLoading(false);
            });
    }

    function updateUser(event: FormEvent) {
        event.preventDefault();

        setUpdateLoading(true);

        axios
            .put('/api/users/auth/update', {
                id: user?.id,
                image_url: image.path,
                full_name,
                username,
                location,
                bio,
            })
            .then(() => {
                localStorage.removeItem('user');
                window.location.href = `/u/${username}`;
            })
            .catch(error => {
                if (error.response.status === 422) {
                    const { errors } = error.response.data;

                    setFullNameError(errors.full_name);
                    setUsernameError(errors.username);
                    setBioError(errors.bio ? errors.bio[0] : null);
                }

                setUpdateLoading(false);
            });
    }

    return (
        <form
            className='pd--md mg-l--auto mg-r--auto profile__edit-profile-form'
            onSubmit={updateUser}>
            <div className='d--flex ai--center'>
                {uploadLoading ? (
                    <div className='d--ib bg--gray-light d--flex ai--center jc--center round profile__loading-image'>
                        <Ellipsis />
                    </div>
                ) : (
                    <div className='pos--rel d--ib round profile__change-photo-container'>
                        <ProfilePhoto
                            className='round profile__headline-profile-photo'
                            src={image.path}
                            gender={user?.gender || null}
                            size={100}
                            alt='Profile photo'
                        />

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
                            onChange={upload}
                        />
                    </div>
                )}

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
                        bioError ? 'brdr-danger' : 'brdr--gray'
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
    );
}

export default EditProfile;
