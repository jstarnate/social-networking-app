import React, { FC, ReactElement } from 'react';

const SearchBar: FC = (): ReactElement => {
    return (
        <form className='d--flex mg-l--md'>
            <input
                className='font--md text--black pd-t--xs pd-b--xs pd-l--xs header__search-input'
                type='text'
                placeholder='Search name or username'
            />
            <button className='btn bg--white pd-l--sm pd-r--sm header__search-submit'>
                <i className='fa fa-search font--md text--gray'></i>
            </button>
        </form>
    );
};

export default SearchBar;
