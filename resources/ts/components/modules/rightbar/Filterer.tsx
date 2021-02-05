import { ChangeEvent, FormEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import eachMonthOfInterval from 'date-fns/eachMonthOfInterval';
import eachYearOfInterval from 'date-fns/eachYearOfInterval';
import InputField from 'helpers/InputField';
import Select from 'helpers/Select';
import { set } from 'actions';

const currentYear = new Date().getFullYear();
const generateYears = eachYearOfInterval({
    start: new Date(currentYear - 100, 0),
    end: new Date(currentYear, 0),
});
const generateMonths = eachMonthOfInterval({
    start: new Date(currentYear, 0),
    end: new Date(currentYear, 11),
});
const years = generateYears.map(date => date.getFullYear());
const months = generateMonths.map(date =>
    date.toLocaleDateString('default', { month: 'long' })
);
const useQuery = () => new URLSearchParams(useLocation().search);
const sq = useQuery().get('sq');

// <input type='text'> change event
function handleInputValue(
    fn: CallableFunction,
    event: ChangeEvent<HTMLInputElement>
) {
    fn(event.target.value);
}

// <select> change event
function handleSelectValue(
    fn: CallableFunction,
    event: ChangeEvent<HTMLSelectElement>
) {
    fn(event.target.value);
}

function Filterer() {
    const [location, setLocation] = useState<string | null>(null);
    const [birth_month, setBirthMonth] = useState<string | null>(null);
    const [birth_year, setBirthYear] = useState<number | null>(null);
    const dispatch = useDispatch();

    async function filterUsers(event: FormEvent) {
        event.preventDefault();

        dispatch(set('usersLoading', true));

        const requests = {
            sq: sq || '',
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
                    containerClassName='mg-t--md'
                    id='filter-location'
                    label='Location'
                    value={location}
                    onChangeEvent={handleInputValue.bind(null, setLocation)}
                />

                <div className='d--flex ai--center mg-t--md'>
                    <Select
                        containerClassName='half-width'
                        className='d--block full-width bg--white font--md text--black pd--xs b-rad--sm b--1 brdr--gray'
                        label='Birth month'
                        defaultOption='Select month'
                        items={months}
                        changeEvent={handleSelectValue.bind(
                            null,
                            setBirthMonth
                        )}
                    />

                    <Select
                        containerClassName='half-width mg-l--auto'
                        className='d--block full-width bg--white font--md text--black pd--xs b-rad--sm b--1 brdr--gray'
                        label='Birth year'
                        defaultOption='Select year'
                        items={years}
                        changeEvent={handleSelectValue.bind(null, setBirthYear)}
                    />
                </div>

                <button className='btn btn--primary full-width text--white text--bold b-rad--sm pd-t--xs pd-b--xs mg-t--md'>
                    Filter
                </button>
            </form>
        </section>
    );
}

export default Filterer;
