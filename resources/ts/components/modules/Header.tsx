import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import MobileSearchBar from 'modules/header/SearchBar.mobile';
import { State } from 'types/redux';
import { set } from 'actions';

interface Props {
    title: string;
    path: string;
}

function Header({ title, path }: Props) {
    const [searchMode, toggleSearchMode] = useState<boolean>(false);
    const screenWidth = useSelector((state: State) => state.screenWidth);
    const dispatch = useDispatch();
    const { goBack } = useHistory();

    function showRightbar() {
        dispatch(set('openRightbar', true));
    }

    if (screenWidth <= 785 && searchMode) {
        return (
            <MobileSearchBar closeEvent={toggleSearchMode.bind(null, false)} />
        );
    }

    return (
        <header className='pos--sticky full-width d--flex ai--center bg--white bb--1 brdr--primary-light header'>
            {path !== '/home' && (
                <button className='btn pd--sm' onClick={goBack}>
                    <i className='fa fa-arrow-left font--md text--primary'></i>
                </button>
            )}

            <h3
                className={`text--black-light ${
                    path === '/home' ? 'pd-t--xs pd-b--xs mg-l--sm' : ''
                }`}>
                {title}
            </h3>

            {screenWidth <= 1024 && screenWidth > 785 && (
                <button
                    className='btn pd--sm mg-l--auto'
                    onClick={showRightbar}>
                    <i className='fa fa-bars font--md text--gray'></i>
                </button>
            )}

            {screenWidth <= 785 && (
                <button
                    className='btn pd--sm mg-l--auto'
                    onClick={toggleSearchMode.bind(null, true)}>
                    <i className='fa fa-search font--md text--gray'></i>
                </button>
            )}
        </header>
    );
}

export default Header;
