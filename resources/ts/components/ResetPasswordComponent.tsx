import React, {
    ChangeEvent,
    FC,
    FormEvent,
    ReactElement,
    useState,
} from 'react';
import axios from 'axios';
import InputField from 'helpers/InputField';
import useInput from 'hooks/useInput';
import Portal from 'helpers/Portal';
import Modal from 'helpers/Modal';

const ResetPasswordComponent: FC = (): ReactElement => {
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
            const { data } = await axios.post('/reset-password', {
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
            <form onSubmit={submit}>
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
                        {passwordConfirmationError
                            ? passwordConfirmationError
                            : 'Confirm new password'}
                    </label>
                    <input
                        className='font--md text--black b--1 b-rad--sm full-width pd--sm mg-t--xxs'
                        id='repeat'
                        type='password'
                        value={password_confirmation || ''}
                        onChange={handleRepeatPasswordValue}
                    />
                </div>

                <button
                    className='btn btn--primary font--md text--bold b-rad--sm pd-t--sm pd-b--sm pd-l--sm pd-r--sm mg-t--md'
                    disabled={loading}>
                    Change password
                </button>
            </form>

            {isSent && (
                <Portal>
                    <Modal
                        namespace='reset'
                        title='Congratulations!'
                        type='success'
                        message={successMessage}
                    />
                </Portal>
            )}
        </section>
    );
};

export default ResetPasswordComponent;
