import { ChangeEvent, Children, FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import InputField from 'helpers/InputField';
import { set } from 'actions';
import { generateMonths, generateYears } from 'utilities/generators';

const useQuery = () => new URLSearchParams(useLocation().search);

function Filterer() {
    const [email, setEmail] = useState<string | null>(null);
    const [location, setLocation] = useState<string | null>(null);
    const [birth_month, setBirthMonth] = useState<string | null>(null);
    const [birth_year, setBirthYear] = useState<number | null>(null);
    const dispatch = useDispatch();
    const query = useQuery();
    const sq = query.get('sq');

    function handleInputValue(
        fn: CallableFunction,
        event: ChangeEvent<HTMLInputElement>
    ) {
        fn(event.target.value);
    }

    function handleSelectValue(
        fn: CallableFunction,
        event: ChangeEvent<HTMLSelectElement>
    ) {
        fn(event.target.value);
    }

    async function filterUsers(event: FormEvent) {
        event.preventDefault();

        dispatch(set('usersLoading', true));

        const requests = {
            sq: sq || '',
            email,
            location,
            birth_month,
            birth_year,
        };
        const { data } = await axios.post('/api/users/filter', requests);

        dispatch(set('users', data.users));
        dispatch(set('usersLoading', false));
    }

    return (
        <section>
            <h2 className='text--black'>Filter people</h2>

            <form className='mg-t--md' onSubmit={filterUsers}>
                <InputField
                    id='filter-email'
                    label='Email address'
                    value={email}
                    onChangeEvent={handleInputValue.bind(null, setEmail)}
                />

                <InputField
                    containerClassName='mg-t--md'
                    id='filter-location'
                    label='Location'
                    value={location}
                    onChangeEvent={handleInputValue.bind(null, setLocation)}
                />

                <div className='d--flex ai--center mg-t--md'>
                    <div className='half-width'>
                        <label className='text--bold text--black-light'>
                            Birth month
                        </label>

                        <select
                            className='d--block full-width bg--white font--md text--black pd--xs b-rad--sm b--1 brdr--gray'
                            onChange={handleSelectValue.bind(
                                null,
                                setBirthMonth
                            )}>
                            <option value=''>Select month</option>
                            {Children.map(generateMonths(), (month: string) => (
                                <option value={month}>{month}</option>
                            ))}
                        </select>
                    </div>

                    <div className='half-width mg-l--auto'>
                        <label className='text--bold text--black-light'>
                            Birth year
                        </label>

                        <select
                            className='d--block full-width bg--white font--md text--black pd--xs b-rad--sm b--1 brdr--gray'
                            onChange={handleSelectValue.bind(
                                null,
                                setBirthYear
                            )}>
                            <option value=''>Select year</option>
                            {Children.map(generateYears(), (year: number) => (
                                <option value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button className='btn btn--primary full-width text--white text--bold b-rad--sm pd-t--xs pd-b--xs mg-t--md'>
                    Filter
                </button>
            </form>
        </section>
    );
}

export default Filterer;
