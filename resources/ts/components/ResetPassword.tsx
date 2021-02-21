import { lazy, Suspense, ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import InputField from 'helpers/InputField';
import Spinner from 'helpers/Spinner';
import useInput from 'hooks/useInput';

const Modal = lazy(() => import('helpers/Modal'));

function ResetPasswordComponent() {
    const [password, passwordData, setPasswordError] = useInput(null);
    const [password_confirmation, setPasswordConfirmation] = useState<
        string | null
    >(null);
    const [passwordConfirmationError, setPasswordConfirmationError] = useState<
        string | null
    >(null);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    function handleRepeatPasswordValue(event: ChangeEvent<HTMLInputElement>) {
        setPasswordConfirmation(event.target.value);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios.post('/api/reset-password', {
                password,
                password_confirmation,
            });

            setSuccessMessage(data.message);
            setIsSent(true);
            setLoading(false);
        } catch (error) {
            const errors = error.response.data.errors;

            setPasswordError(errors.password);
            setPasswordConfirmationError(
                errors.password_confirmation
                    ? errors.password_confirmation[0]
                    : null
            );
            setLoading(false);
        }
    }

    return (
        <section className='mg-l--auto mg-r--auto mg-t--md reset__wrap'>
            <form className='pd-r--lg pd-l--md' onSubmit={submit}>
                <InputField
                    id='password'
                    type='password'
                    label='New password'
                    {...passwordData}
                />

                <div className='mg-t--md'>
                    <label
                        htmlFor='repeat'
                        className={`text--bold ${
                            passwordConfirmationError
                                ? 'text--danger'
                                : 'text--black-light'
                        }`}>
                        {passwordConfirmationError || 'Confirm new password'}
                    </label>
                    <input
                        className='full-width text--black b--1 brdr--gray b-rad--sm pd--xs mg-t--xxs'
                        id='repeat'
                        type='password'
                        value={password_confirmation || ''}
                        onChange={handleRepeatPasswordValue}
                    />
                </div>

                <button
                    className='btn btn--primary font--md text--bold b-rad--sm pd-t--xs pd-b--xs pd-l--lg pd-r--lg mg-t--md'
                    disabled={loading}>
                    Change password
                </button>
            </form>

            {isSent && (
                <Suspense
                    fallback={
                        <Spinner containerClassName='pos--fixed ai--center modal' />
                    }>
                    <Modal title='Success!' message={successMessage} />
                </Suspense>
            )}
        </section>
    );
}

export default ResetPasswordComponent;
