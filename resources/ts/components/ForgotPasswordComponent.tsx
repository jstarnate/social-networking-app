import React, {
    ChangeEvent,
    FC,
    FormEvent,
    ReactElement,
    useState,
} from 'react';
import axios from 'axios';
import InputField from 'helpers/InputField';
import Portal from 'helpers/Portal';
import Modal from 'helpers/Modal';

const ForgotPasswordComponent: FC = (): ReactElement => {
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    function handleValue(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            await axios.post('/forgot-password/send', { email });

            setIsSent(true);
        } catch (error) {
            const { email } = error.response.data.errors;

            setError(email ? email[0] : null);
            setLoading(false);
        }
    }

    return (
        <section className='mg-t--lg mg-l--auto mg-r--auto forgot__wrap'>
            <p className='text--black-light'>
                Please enter your email address. A change-password request email
                will be sent to you afterwards.
            </p>

            <form className='mg-t--md' onSubmit={submit}>
                <InputField
                    containerClassName='mg-t--0'
                    id='email'
                    type='email'
                    label='Email address'
                    value={email}
                    error={error}
                    onChangeEvent={handleValue}
                    autoFocus={true}
                />

                <button
                    className='btn btn--primary font--md text--white text--bold b-rad--sm pd-t--sm pd-b--sm pd-l--md pd-r--md mg-t--md'
                    disabled={!email?.length || loading}>
                    Send request
                </button>
            </form>

            {isSent && (
                <Portal>
                    <Modal
                        title='Request sent!'
                        type='primary'
                        message='Please check your email for the sent request. Thank you!'
                    />
                </Portal>
            )}
        </section>
    );
};

export default ForgotPasswordComponent;
