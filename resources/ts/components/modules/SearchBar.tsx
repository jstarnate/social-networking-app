import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import BasicUserInfo from 'helpers/BasicUserInfo';
import Ellipsis from 'helpers/Ellipsis';
import { User } from 'types/models';
import useOutsideClick from 'hooks/useOutsideClick';

function SearchBar() {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>('');
    const [showSuggestions, toggleSuggestions] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const searchComponent = useRef<HTMLElement>(null);

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

    useOutsideClick(searchComponent, toggleSuggestions.bind(null, false));

    return (
        <section ref={searchComponent} className='pos--rel'>
            <form
                method='GET'
                action='/users/search'
                className='d--flex b--1 brdr--primary b-rad--sm'
                onSubmit={submitForm}>
                <input
                    className='flex--1 text--black pd-t--xs pd-b--xs pd-l--xs search__input'
                    type='text'
                    name='sq'
                    placeholder='Search by name or username'
                    value={query}
                    onFocus={toggleSuggestions.bind(null, true)}
                    onChange={getSearchSuggestions}
                />

                <button className='btn pd-l--sm pd-r--sm search__submit'>
                    <i className='fa fa-search text--primary'></i>
                </button>
            </form>

            {loading && (
                <div className='pos--abs full-width bg--white b--1 brdr--primary search__loading-spinner'>
                    <Ellipsis />
                </div>
            )}

            {!loading && showSuggestions && !!users.length && (
                <BrowserRouter>
                    <div className='pos--abs full-width bg--white b--1 brdr--primary search__suggestions'>
                        {users.map((user: User, i) => {
                            const bordered = i ? 'bt--1 brdr--primary' : '';

                            return (
                                <BasicUserInfo
                                    key={i}
                                    imageClassName='search__profile-photo'
                                    className={`d--flex ai--center pd--xs ${bordered} search__suggestion`}
                                    avatarSize={35}
                                    {...user}
                                />
                            );
                        })}

                        <a
                            className='d--block font--sm text--primary-dark text--center bt--1 brdr--primary pd-t--xs pd-b--xs'
                            href={`/users/search?sq=${query}`}>
                            Show all
                        </a>
                    </div>
                </BrowserRouter>
            )}
        </section>
    );
}

export default SearchBar;
