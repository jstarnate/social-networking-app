import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import User from 'modules/users/User';
import { State } from 'types/redux';

function SuggestedUsers() {
    const suggestedUsers = useSelector((state: State) => state.suggestedUsers);

    return (
        <section className='mg-t--md'>
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
                    <User
                        key={user.id}
                        className='bg--primary-pale b--1 brdr--primary-light b-rad--sm mg-t--md'
                        namespace='rightbar'
                        {...user}
                    />
                ))}
            </div>
        </section>
    );
}

export default SuggestedUsers;
