import React, {
    ChangeEvent,
    FC,
    FormEvent,
    ReactElement,
    useState,
} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import { User } from 'types/models';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Ellipsis from 'helpers/Ellipsis';

const SearchBar: FC = (): ReactElement => {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    async function getSearchSuggestions(event: ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;

        setQuery(value);

        if (value.length) {
            setLoading(true);
        }

        try {
            const { data } = await axios.get(`/api/users/search?sq=${value}`);

            setUsers(data.users);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        }
    }

    function submitForm(event: FormEvent) {
        if (!query.length) {
            event.preventDefault();
        }
    }

    return (
        <form
            method='GET'
            action='/users/search'
            className='d--flex mg-l--md pos--rel'
            onSubmit={submitForm}>
            <input
                className='font--md text--black pd-t--xs pd-b--xs pd-l--xs header__search-input'
                type='text'
                name='sq'
                placeholder='Search name or username'
                value={query}
                onChange={getSearchSuggestions}
            />

            <button className='btn bg--white pd-l--sm pd-r--sm header__search-submit'>
                <i className='fa fa-search font--md text--gray'></i>
            </button>

            {loading && (
                <section className='pos--abs full-width bg--white b--1 brdr--gray-light header__loading-spinner'>
                    <Ellipsis />
                </section>
            )}

            {!loading && !!users.length && (
                <Router>
                    <section className='pos--abs full-width bg--white b--1 brdr--gray-light header__search-suggestions'>
                        {users.map((user: User, i) => (
                            <BasicUserInfo
                                key={i}
                                className='d--flex ai--center pd--xs bt--1 brdr--gray-light header__search-suggestion'
                                avatarSize={35}
                                {...user}
                            />
                        ))}

                        <a
                            className='d--block font--sm text--primary-dark text--center bt--1 brdr--gray-light pd-t--xs pd-b--xs'
                            href={`/users/search?sq=${query}`}>
                            Show all
                        </a>
                    </section>
                </Router>
            )}
        </form>
    );
};

export default SearchBar;
