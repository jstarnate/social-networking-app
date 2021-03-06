import { lazy, Suspense, ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import InputField from 'helpers/InputField';
import Spinner from 'helpers/Spinner';

const Modal = lazy(() => import('helpers/Modal'));

function ForgotPasswordComponent() {
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSent, setIsSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    function handleValue(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        axios
            .post('/api/forgot-password/send', { email })
            .then(() => {
                setIsSent(true);
            })
            .catch(error => {
                const { email } = error.response.data.errors;

                setError(email ? email[0] : null);
                setLoading(false);
            });
    }

    return (
        <section className='pd-t--sm pd-b--lg pd-l--md pd-r--md mg-l--auto mg-r--auto forgot__wrap'>
            <h3 className='text--black-light'>Make a reset password request</h3>

            <form className='mg-t--sm' onSubmit={submit}>
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
                    className='btn btn--primary font--md text--white text--bold b-rad--sm pd-t--xs pd-b--xs pd-l--md pd-r--md mg-t--md'
                    disabled={!email?.length || loading}>
                    Send request
                </button>
            </form>

            {isSent && (
                <Suspense
                    fallback={
                        <Spinner containerClassName='pos--fixed ai--center modal' />
                    }>
                    <Modal
                        title='Request sent!'
                        message='Please check your email for the sent request. Thank you!'
                    />
                </Suspense>
            )}
        </section>
    );
}

export default ForgotPasswordComponent;
