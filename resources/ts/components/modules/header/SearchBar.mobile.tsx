import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import Ellipsis from 'helpers/Ellipsis';
import BasicUserInfo from 'helpers/BasicUserInfo';
import { User } from 'types/models';

interface Props {
    closeEvent: () => void;
}

function MobileSearchBar({ closeEvent }: Props) {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showSuggestions, toggleSuggestions] = useState<boolean>(false);

    function search(event: FormEvent) {
        if (!query.length) {
            event.preventDefault();
        }
    }

    function getSearchSuggestions(event: ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;

        setQuery(value);

        if (value.length) {
            setLoading(true);
        }

        axios
            .get(`/api/users/search?sq=${value}`)
            .then(({ data }) => {
                setUsers(data.users);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <header className='pos--sticky full-width bg--white bb--1 brdr--primary-light header'>
            <form
                method='GET'
                action='/users/search'
                className='d--flex'
                onSubmit={search}>
                <input
                    className='flex--1 text--black-light pd--xs'
                    type='text'
                    placeholder='Search'
                    value={query}
                    onFocus={toggleSuggestions.bind(null, true)}
                    onChange={getSearchSuggestions}
                    autoFocus
                />
                <input className='d--none' type='submit' value='Search' />
                <button
                    className='btn pd--sm'
                    type='button'
                    onClick={closeEvent}>
                    <i className='fa fa-times font--lg text--gray'></i>
                </button>
            </form>

            {loading && (
                <div className='pos--abs full-width bg--white bt--1 bb--1 brdr--primary-light header__loading-spinner'>
                    <Ellipsis />
                </div>
            )}

            {!loading && showSuggestions && !!users.length && (
                <div className='pos--abs full-width bg--white bt--1 bb--1 brdr--primary-light header__search-suggestions'>
                    {users.map((user, i) => {
                        const bordered = i ? 'bt--1 brdr--primary-light' : '';

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
                        className='d--block font--sm text--primary-dark text--center bt--1 brdr--primary-light pd-t--xs pd-b--xs'
                        href={`/users/search?sq=${query}`}>
                        Show all
                    </a>
                </div>
            )}
        </header>
    );
}

export default MobileSearchBar;
