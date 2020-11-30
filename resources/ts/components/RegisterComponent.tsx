import React, {
    ChangeEvent,
    FC,
    FormEvent,
    ReactElement,
    useState,
    Children,
} from 'react';
import axios from 'axios';
import InputField from 'helpers/InputField';
import useInput from 'hooks/useInput';
import RadioButton from 'helpers/RadioButton';
import Portal from 'helpers/Portal';
import Modal from 'helpers/Modal';

function generateYears() {
    const years = [];

    for (let i = new Date().getFullYear(); i >= 1920; i--) {
        years.push(i);
    }

    return years;
}

const RegisterComponent: FC = (): ReactElement => {
    const [first_name, firstNameData, setFirstnameError] = useInput(null);
    const [last_name, lastNameData, setLastnameError] = useInput(null);
    const [email, emailData, setEmailError] = useInput(null);
    const [username, usernameData, setUsernameError] = useInput(null);
    const [password, passwordData, setPasswordError] = useInput(null);
    const [gender, genderData, setGenderError] = useInput(null);
    const [birth_month, setBirthMonth] = useState<string | null>(null);
    const [birth_day, setBirthDay] = useState<string | null>(null);
    const [birth_year, setBirthYear] = useState<string | null>(null);
    const [birthdate_error, setBirthdateError] = useState<string | null>(null);
    const [passwordType, setPasswordType] = useState<string>('password');
    const [loading, setLoading] = useState<boolean>(false);
    const [registered, setRegistered] = useState<boolean>(false);

    function handleBirthMonthValue(event: ChangeEvent<HTMLSelectElement>) {
        setBirthMonth(event.target.value);
    }

    function handleBirthDayValue(event: ChangeEvent<HTMLInputElement>) {
        setBirthDay(event.target.value);
    }

    function handleBirthYearValue(event: ChangeEvent<HTMLSelectElement>) {
        setBirthYear(event.target.value);
    }

    function openModal() {
        const coord = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.top = `-${coord}px`;
        document.body.style.right = '0';
        document.body.style.left = '0';
        document.body.style.bottom = '0';
    }

    function togglePasswordType() {
        setPasswordType(passwordType =>
            passwordType === 'password' ? 'text' : 'password'
        );
    }

    async function submit(event: FormEvent) {
        event.preventDefault();

        setLoading(true);

        const requests = {
            first_name,
            last_name,
            email,
            username,
            password,
            gender,
            birth_month,
            birth_day,
            birth_year,
        };

        try {
            await axios.post('/sign-up', requests);

            openModal();
            setRegistered(true);
        } catch (error) {
            const e = error.response.data.errors;
            const bde = e.birth_month || e.birth_day || e.birth_year;

            setFirstnameError(e.first_name);
            setLastnameError(e.last_name);
            setEmailError(e.email);
            setUsernameError(e.username);
            setPasswordError(e.password);
            setGenderError(e.gender);
            setPasswordError(e.password);
            setBirthdateError(
                bde ? 'Please complete your whole birth date.' : null
            );
            setLoading(false);
        }
    }

    return (
        <section className='pd-t--lg pd-b--lg mg-l--auto mg-r--auto register__wrap'>
            <h2 className='text--black-light'>Create your account</h2>

            <form className='register' onSubmit={submit}>
                <InputField
                    id='first_name'
                    label='First name'
                    autoFocus={true}
                    {...firstNameData}
                />

                <InputField
                    id='last_name'
                    label='Last name'
                    {...lastNameData}
                />

                <InputField
                    id='email'
                    type='email'
                    label='Email address'
                    {...emailData}
                />

                <InputField id='username' label='Username' {...usernameData} />

                <InputField
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

                <div className='mg-t--lg'>
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

                <div className='mg-t--lg'>
                    <label
                        className={`text--bold ${
                            birthdate_error
                                ? 'text--danger'
                                : 'text--black-light'
                        }`}>
                        {birthdate_error || 'Birthdate'}
                    </label>

                    <div className='d--flex mg-t--xs'>
                        <select
                            className='bg--none font--md text--black pd-t--xs pd-b--xs pd-l--sm pd-r--sm b-rad--sm b--1 brdr--gray'
                            placeholder='Select month'
                            onChange={handleBirthMonthValue}>
                            <option value='January'>January</option>
                            <option value='February'>February</option>
                            <option value='March'>March</option>
                            <option value='April'>April</option>
                            <option value='May'>May</option>
                            <option value='June'>June</option>
                            <option value='July'>July</option>
                            <option value='August'>August</option>
                            <option value='September'>September</option>
                            <option value='October'>October</option>
                            <option value='November'>November</option>
                            <option value='December'>December</option>
                        </select>

                        <input
                            className='font--md text--black b--1 brdr--gray b-rad--sm pd-l--sm pd-r--sm mg-l--sm register__birthday-input'
                            type='text'
                            inputMode='numeric'
                            placeholder='DD'
                            onChange={handleBirthDayValue}
                        />

                        <select
                            className='bg--none font--md text--black b-rad--sm b--1 brdr--gray pd-t--xs pd-b--xs pd-l--sm pd-r--sm mg-l--sm'
                            placeholder='Select year'
                            onChange={handleBirthYearValue}>
                            {Children.map(generateYears(), year => (
                                <option value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    className='btn btn--primary full-width font--md text--bold pd-t--sm pd-b--sm b-rad--sm mg-t--lg'
                    disabled={loading}>
                    Sign up
                </button>
            </form>

            {registered && (
                <Portal>
                    <Modal
                        namespace='register'
                        title='Congratulations!'
                        type='success'
                        message={`You have successfully registered. Please check
                                your email (${email}) for the verification of
                                your account.`}
                    />
                </Portal>
            )}
        </section>
    );
};

export default RegisterComponent;
