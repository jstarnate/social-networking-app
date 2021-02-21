import { lazy, Suspense, ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import eachYearOfInterval from 'date-fns/eachYearOfInterval';
import InputField from 'helpers/InputField';
import Select from 'helpers/Select';
import RadioButton from 'helpers/RadioButton';
import Spinner from 'helpers/Spinner';
import useInput from 'hooks/useInput';

const Modal = lazy(() => import('helpers/Modal'));
const currentYear = new Date().getFullYear();
const generateYears = eachYearOfInterval({
    start: new Date(currentYear - 100, 0),
    end: new Date(currentYear, 0),
});
const generateMonths = eachMonthOfInterval({
    start: new Date(currentYear, 0),
    end: new Date(currentYear, 11),
});
const years = generateYears.map(date => date.getFullYear()).reverse();
const months = generateMonths.map(date =>
    date.toLocaleDateString('default', { month: 'long' })
);

function openModal() {
    const coord = window.scrollY;

    document.body.style.position = 'fixed';
    document.body.style.top = `-${coord}px`;
    document.body.style.right = '0';
    document.body.style.left = '0';
    document.body.style.bottom = '0';
}

function handleSelectValue(
    fn: CallableFunction,
    event: ChangeEvent<HTMLSelectElement>
) {
    fn(event.target.value);
}

function RegisterComponent() {
    const [full_name, fullNameData, setFullNameError] = useInput(null);
    const [email, emailData, setEmailError] = useInput(null);
    const [username, usernameData, setUsernameError] = useInput(null);
    const [password, passwordData, setPasswordError] = useInput(null);
    const [gender, genderData, setGenderError] = useInput(null);
    const [birth_month, setBirthMonth] = useState<string | null>(null);
    const [birth_day, setBirthDay] = useState<string | null>(null);
    const [birth_year, setBirthYear] = useState<string | null>(null);
    const [birthdate_error, setBirthdateError] = useState<string | null>(null);
    const [passwordType, setPasswordType] = useState<'password' | 'text'>(
        'password'
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [registered, setRegistered] = useState<boolean>(false);

    function handleBirthDayValue(event: ChangeEvent<HTMLInputElement>) {
        setBirthDay(event.target.value);
    }

    function togglePasswordType() {
        setPasswordType(passwordType =>
            passwordType === 'password' ? 'text' : 'password'
        );
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        const requests = {
            full_name,
            email,
            username,
            password,
            gender,
            birth_month,
            birth_day,
            birth_year,
        };

        axios
            .post('/api/sign-up', requests)
            .then(() => {
                openModal();
                setRegistered(true);
            })
            .catch(error => {
                const e = error.response.data.errors;
                const bde = e.birth_month || e.birth_day || e.birth_year;

                setFullNameError(e.full_name);
                setEmailError(e.email);
                setUsernameError(e.username);
                setPasswordError(e.password);
                setGenderError(e.gender);
                setPasswordError(e.password);
                setBirthdateError(
                    bde ? 'Please complete your whole birth date.' : null
                );
                setLoading(false);
            });
    }

    return (
        <section className='pd-t--sm pd-b--lg pd-l--md pd-r--md mg-l--auto mg-r--auto register__wrap'>
            <h2 className='text--black-light'>Create your account</h2>

            <form className='mg-t--md register' onSubmit={submit}>
                <InputField
                    id='full_name'
                    label='Name'
                    autoFocus={true}
                    {...fullNameData}
                />

                <InputField
                    containerClassName='mg-t--md'
                    id='email'
                    type='email'
                    label='Email address'
                    {...emailData}
                />

                <InputField
                    id='username'
                    containerClassName='mg-t--md'
                    label='Username'
                    {...usernameData}
                />

                <InputField
                    containerClassName='mg-t--md'
                    id='password'
                    type={passwordType}
                    label='Password'
                    {...passwordData}>
                    <button
                        type='button'
                        className='btn font--md text--primary text--bold'
                        onClick={togglePasswordType}>
                        {passwordType === 'password' ? 'Show' : 'Hide'}
                    </button>
                </InputField>

                <div className='mg-t--md'>
                    <label
                        className={`text--bold ${
                            genderData.error
                                ? 'text--danger'
                                : 'text--black-light'
                        }`}>
                        {genderData.error ? genderData.error : 'Select gender'}
                    </label>

                    <div className='d--flex ai--center mg-t--xs'>
                        <RadioButton
                            id='male'
                            label='Male'
                            condition={gender === 'Male'}
                            name='gender'
                            value='Male'
                            onChange={genderData.onChangeEvent}
                        />
                        <RadioButton
                            id='female'
                            className='mg-l--lg'
                            label='Female'
                            condition={gender === 'Female'}
                            name='gender'
                            value='Female'
                            onChange={genderData.onChangeEvent}
                        />
                    </div>
                </div>

                <div className='mg-t--md'>
                    <label
                        className={`text--bold ${
                            birthdate_error
                                ? 'text--danger'
                                : 'text--black-light'
                        }`}>
                        {birthdate_error || 'Birthdate'}
                    </label>

                    <div className='d--flex mg-t--xs'>
                        <Select
                            className='bg--none text--black pd-t--xs pd-b--xs pd-l--sm pd-r--sm b-rad--sm b--1 brdr--gray'
                            defaultOption='Month'
                            items={months}
                            changeEvent={handleSelectValue.bind(
                                null,
                                setBirthMonth
                            )}
                        />

                        <input
                            className='text--black b--1 brdr--gray b-rad--sm pd-l--sm pd-r--sm mg-l--sm register__birthday-input'
                            type='text'
                            inputMode='numeric'
                            placeholder='Day'
                            onChange={handleBirthDayValue}
                        />

                        <Select
                            className='bg--none text--black b-rad--sm b--1 brdr--gray pd-t--xs pd-b--xs pd-l--sm pd-r--sm mg-l--sm'
                            defaultOption='Year'
                            items={years}
                            changeEvent={handleSelectValue.bind(
                                null,
                                setBirthYear
                            )}
                        />
                    </div>
                </div>

                <button
                    className='btn btn--primary full-width font--md text--bold pd-t--sm pd-b--sm b-rad--sm mg-t--lg'
                    disabled={loading}>
                    Sign up
                </button>
            </form>

            {registered && (
                <Suspense
                    fallback={
                        <Spinner containerClassName='pos--fixed ai--center modal' />
                    }>
                    <Modal
                        title='Success!'
                        message={`You have successfully registered. Please check
                                    your email (${email}) for the verification of
                                    your account.`}
                    />
                </Suspense>
            )}
        </section>
    );
}

export default RegisterComponent;
