import { FC, FormEvent, ReactElement, useState } from 'react';
import axios from 'axios';
import useInput from 'hooks/useInput';
import InputField from 'helpers/InputField';

const IndexComponent: FC = (): ReactElement => {
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
            const { message } = err.response.data.errors;

            setError(message);
            setLoading(false);
        }
    }

    return (
        <section className='pd-t--lg pd-b--lg mg-l--auto mg-r--auto index__wrap'>
            <div>
                <h2 className='text--black-light'>Sign in to your account</h2>

                {!!error && (
                    <div
                        data-testid='error-alert'
                        className='alert--danger b-rad--sm pd--sm mg-t--lg'>
                        {error}
                    </div>
                )}

                <form data-testid='login-form' onSubmit={submit}>
                    <InputField
                        id='username'
                        label='Username'
                        autoFocus={true}
                        {...usernameData}
                    />

                    <InputField
                        id='password'
                        type='password'
                        label='Password'
                        {...passwordData}
                    />

                    <div className='d--flex ai--center mg-t--lg'>
                        <button
                            data-testid='login-button'
                            className='btn btn--primary font--md text--bold pd-t--sm pd-b--sm pd-l--lg pd-r--lg b-rad--sm'
                            disabled={loading}>
                            Sign in
                        </button>
                        <a
                            className='font--md text--gray mg-l--auto index__forgot-link'
                            href='/forgot-password'>
                            I forgot my password
                        </a>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default IndexComponent;
