import { useEffect, useState, lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import RouteView from './modules/RouteView';
import Sidebar from './modules/Sidebar';
import Rightbar from './modules/Rightbar';
import Timeline from './views/Timeline';
import Spinner from 'helpers/Spinner';
import { UserWithId } from 'types/models';
import { set } from 'actions';
import { State } from 'types/redux';

interface AuthUser extends UserWithId {
    location: string | null;
    bio: string | null;
}

const storageUser = localStorage.getItem('user');

const Profile = lazy(() => import('./views/Profile'));
const EditProfile = lazy(() => import('./views/EditProfile'));
const Notifications = lazy(() => import('./views/Notifications'));
const Users = lazy(() => import('./views/Users'));
const PostView = lazy(() => import('./views/PostView'));
const ConnectedUsers = lazy(() => import('./views/ConnectedUsers'));

function HomeComponent() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const screenWidth = useSelector((state: State) => state.screenWidth);
    const dispatch = useDispatch();

    function getAuthUser() {
        axios.get('/api/users/auth').then(({ data }) => {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        });
    }

    function setStateOnResize(width: number) {
        if (width > 1024) {
            dispatch(set('openRightbar', false));
        }

        dispatch(set('screenWidth', width));
    }

    function checkWidth() {
        let timeout: number | null = null;

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }

            timeout = window.setTimeout(() => {
                setStateOnResize(window.innerWidth);
            }, 700);
        };
    }

    useEffect(() => {
        if (!storageUser) {
            getAuthUser();
        } else {
            setUser(JSON.parse(storageUser));
        }

        setStateOnResize(window.innerWidth);
        window.addEventListener('resize', checkWidth());
    }, []);

    return (
        <section
            className='d--flex mg-l--auto mg-r--auto home'
            data-testid='container'>
            <Sidebar user={user} />

            <Switch>
                <RouteView subTitle='Home' path='/home' component={Timeline} />

                <RouteView
                    title={user?.full_name || undefined}
                    subTitle='Profile'
                    path='/u/:username'>
                    <Suspense
                        fallback={<Spinner containerClassName='mg-t--md' />}>
                        <Profile />
                    </Suspense>
                </RouteView>

                <RouteView
                    exact={true}
                    title='Edit profile'
                    subTitle='Edit profile'
                    path='/profile/:username/edit'>
                    <Suspense
                        fallback={<Spinner containerClassName='mg-t--md' />}>
                        <EditProfile user={user} />
                    </Suspense>
                </RouteView>

                <RouteView
                    title='Notifications'
                    subTitle='Notifications'
                    path='/notifications'>
                    <Suspense
                        fallback={<Spinner containerClassName='mg-t--md' />}>
                        <Notifications />
                    </Suspense>
                </RouteView>

                <RouteView
                    title='Search people'
                    subTitle='Search people'
                    path='/users/search'>
                    <Suspense
                        fallback={<Spinner containerClassName='mg-t--md' />}>
                        <Users />
                    </Suspense>
                </RouteView>

                <RouteView
                    title='Home'
                    subTitle='View post'
                    path='/posts/:id/comments'>
                    <Suspense
                        fallback={<Spinner containerClassName='mg-t--xs' />}>
                        <PostView />
                    </Suspense>
                </RouteView>

                <RouteView
                    title='Followers'
                    subTitle='Followers'
                    path='/:username/connected/followers'>
                    <Suspense
                        fallback={<Spinner containerClassName='mg-t--md' />}>
                        <ConnectedUsers name='followers' />
                    </Suspense>
                </RouteView>

                <RouteView
                    title='Followed people'
                    subTitle='Followed people'
                    path='/:username/connected/following'>
                    <Suspense
                        fallback={<Spinner containerClassName='mg-t--md' />}>
                        <ConnectedUsers name='following' />
                    </Suspense>
                </RouteView>
            </Switch>

            {screenWidth > 785 && <Rightbar />}
        </section>
    );
}

export default HomeComponent;
