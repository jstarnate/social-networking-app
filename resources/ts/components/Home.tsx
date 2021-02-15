import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Echo from 'laravel-echo';
import ViewWrap from './modules/ViewWrap';
import Sidebar from './modules/Sidebar';
import Rightbar from './modules/Rightbar';
import EditProfile from './views/EditProfile';
import Timeline from './views/Timeline';
import Notifications from './views/Notifications';
import Users from './views/Users';
import PostView from './views/PostView';
import ConnectedUsers from './views/ConnectedUsers';
import Spinner from 'helpers/Spinner';
import { UserWithId } from 'types/models';
import { set } from 'actions';
import 'pusher-js';

interface AuthUser extends UserWithId {
    location: string | null;
    bio: string | null;
}

interface EchoData {
    count: number;
}

const storageUser = localStorage.getItem('user');
const Profile = lazy(() => import('./views/Profile'));
const ProfileLoader = () => (
    <div className='flex--1 mg-t--lg'>
        <Spinner />
    </div>
);

function HomeComponent() {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [notifCount, setNotifCount] = useState<number>(0);
    const dispatch = useDispatch();
    const echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.PUSHER_APP_KEY,
        cluster: process.env.PUSHER_APP_CLUSTER,
    });

    async function getAuthUser() {
        const { data } = await axios.get('/api/users/auth');

        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    async function getNotifCount() {
        const { data } = await axios.get('/api/notifications/count');
        setNotifCount(data.count);
    }

    function setStateOnResize(width: number) {
        if (width > 1024) {
            dispatch(set('openSidebar', false));
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

        getNotifCount();
        setStateOnResize(window.innerWidth);
        window.addEventListener('resize', checkWidth());
    }, []);

    useEffect(() => {
        if (storageUser) {
            const { id } = JSON.parse(storageUser);

            echo.channel(`notify.user.${id}`).listen(
                'SendUnreadNotifsCount',
                (data: EchoData) => {
                    setNotifCount(data.count);
                }
            );
        }
    }, [storageUser]);

    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>

            <Router>
                <section
                    className='d--flex mg-l--auto mg-r--auto home'
                    data-testid='container'>
                    <Sidebar user={user} notifCount={notifCount} />

                    <Switch>
                        <Route path='/home'>
                            <ViewWrap>
                                <Timeline />
                            </ViewWrap>
                        </Route>

                        <Route path='/u/:username'>
                            <ViewWrap>
                                <Suspense fallback={<ProfileLoader />}>
                                    <Profile name={user?.full_name || null} />
                                </Suspense>
                            </ViewWrap>
                        </Route>

                        <Route exact path='/profile/:username/edit'>
                            <ViewWrap>
                                <EditProfile user={user} />
                            </ViewWrap>
                        </Route>

                        <Route path='/notifications'>
                            <ViewWrap>
                                <Notifications />
                            </ViewWrap>
                        </Route>

                        <Route path='/users/search'>
                            <ViewWrap>
                                <Users />
                            </ViewWrap>
                        </Route>

                        <Route path='/posts/:id/comments'>
                            <ViewWrap>
                                <PostView />
                            </ViewWrap>
                        </Route>

                        <Route path='/:username/connected/followers'>
                            <ViewWrap>
                                <ConnectedUsers name='followers' />
                            </ViewWrap>
                        </Route>

                        <Route path='/:username/connected/following'>
                            <ViewWrap>
                                <ConnectedUsers name='following' />
                            </ViewWrap>
                        </Route>
                    </Switch>

                    <Rightbar />
                </section>
            </Router>
        </>
    );
}

export default HomeComponent;
