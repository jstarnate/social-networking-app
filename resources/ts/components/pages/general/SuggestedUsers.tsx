import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUser from './SuggestedUser';
import { State } from 'types/redux';

const SuggestedUsers: FC = (): ReactElement => {
    const suggestedUsers = useSelector((state: State) => state.suggestedUsers);

    return (
        <section>
            <div className='d--flex ai--center'>
                <h3 className='text--black-light'>Find friends</h3>
                <Link
                    className='font--sm text--primary-dark text--bold mg-l--auto'
                    to='/users/search'>
                    Show all
                </Link>
            </div>

            <div>
                {suggestedUsers.map(user => (
                    <SuggestedUser key={user.id} {...user} />
                ))}
            </div>
        </section>
    );
};

export default SuggestedUsers;
