import { Switch, Route, NavLink, useRouteMatch } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Headline from 'modules/profile/Headline';
import Posts from 'modules/profile/Posts';

interface ProfileProps {
    name: string | undefined;
}

function Profile({ name }: ProfileProps) {
    const { url, path } = useRouteMatch();

    return (
        <section className='flex--1 profile'>
            <Helmet>
                <title>{name}</title>
            </Helmet>

            <Headline />

            <div className='d--flex bb--1 brdr--primary mg-t--sm'>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={url}
                    exact>
                    Posts
                </NavLink>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={`${url}/likes`}>
                    Likes
                </NavLink>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={`${url}/comments`}>
                    Comments
                </NavLink>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={`${url}/bookmarks`}>
                    Bookmarks
                </NavLink>
            </div>

            <Switch>
                <Route exact path={path} component={Posts} />
                <Route path={`${path}/likes`}>
                    <Posts section='likes' />
                </Route>
                <Route path={`${path}/comments`}>
                    <Posts section='comments' />
                </Route>
                <Route path={`${path}/bookmarks`}>
                    <Posts section='bookmarks' />
                </Route>
            </Switch>
        </section>
    );
}

export default Profile;
