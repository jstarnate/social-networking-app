import { Switch, Route, NavLink, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Headline from 'modules/profile/Headline';
import Posts from 'modules/profile/Posts';
import { State } from 'types/redux';

function Profile() {
    const screenWidth = useSelector((state: State) => state.screenWidth);
    const { url, path } = useRouteMatch();

    return (
        <div className='profile'>
            <Headline />

            <div className='d--flex bb--1 brdr--primary mg-t--sm'>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={url}
                    exact>
                    {screenWidth >= 650 ? (
                        <span>Posts</span>
                    ) : (
                        <i className='fa fa-pencil-square'></i>
                    )}
                </NavLink>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={`${url}/likes`}>
                    {screenWidth >= 650 ? (
                        <span>Likes</span>
                    ) : (
                        <i className='fa fa-heart'></i>
                    )}
                </NavLink>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={`${url}/comments`}>
                    {screenWidth >= 650 ? (
                        <span>Comments</span>
                    ) : (
                        <i className='fa fa-comments'></i>
                    )}
                </NavLink>
                <NavLink
                    className='flex--1 font--md text--primary text--center pd-t--sm pd-b--sm'
                    activeClassName='profile__active-tab'
                    to={`${url}/bookmarks`}>
                    {screenWidth >= 650 ? (
                        <span>Bookmarks</span>
                    ) : (
                        <i className='fa fa-bookmark'></i>
                    )}
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
        </div>
    );
}

export default Profile;
