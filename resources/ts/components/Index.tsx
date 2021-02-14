import { FormEvent, useState } from 'react';
import axios from 'axios';
import useInput from 'hooks/useInput';
import InputField from 'helpers/InputField';

function IndexComponent() {
    const [username, usernameData] = useInput(null);
    const [password, passwordData] = useInput(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        try {
            const { data } = await axios.post('/api/sign-in', {
                username,
                password,
            });

            location = data.url;
        } catch (err) {
            setError(err.response.data.errors.message);
            setLoading(false);
        }
    }

    return (
        <section className='pd-t--sm pd-b--lg pd-l--md pd-r--md mg-l--auto mg-r--auto index__wrap'>
            <h2 className='text--black-light'>Sign in to your account</h2>

            {!!error && (
                <div
                    data-testid='error-alert'
                    className='alert--danger b-rad--sm pd--sm mg-t--sm'>
                    {error}
                </div>
            )}

            <form
                data-testid='login-form'
                className='mg-t--md'
                onSubmit={submit}>
                <InputField
                    id='username'
                    label='Username'
                    autoFocus={true}
                    {...usernameData}
                />

                <InputField
                    containerClassName='mg-t--md'
                    id='password'
                    type='password'
                    label='Password'
                    {...passwordData}
                />

                <div className='d--flex ai--center mg-t--lg'>
                    <button
                        data-testid='login-button'
                        className='btn btn--primary font--md text--bold pd-t--xs pd-b--xs pd-l--lg pd-r--lg b-rad--sm'
                        disabled={loading}>
                        Sign in
                    </button>
                    <a
                        className='text--gray mg-l--auto index__forgot-link'
                        href='/forgot-password'>
                        I forgot my password
                    </a>
                </div>
            </form>
        </section>
    );
}

export default IndexComponent;
