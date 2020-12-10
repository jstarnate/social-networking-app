import React, {
    FC,
    ReactElement,
    useEffect,
    useState,
    lazy,
    Suspense,
} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Echo from 'laravel-echo';
import Header from './modules/Header';
import Sidebar from './modules/Sidebar';
import Rightbar from './modules/Rightbar';
import Timeline from './pages/home/Timeline';
import Notifications from './pages/notifications/Notifications';
import Users from './pages/users/index';
import PostView from 'pages/general/PostView';
import Spinner from 'helpers/Spinner';
import { UserWithId } from 'types/models';
import 'pusher-js';

interface EchoData {
    count: number;
}

const storageUser = localStorage.getItem('user');
const Profile = lazy(() => import('./pages/profile/Profile'));
const ProfileLoader = () => (
    <div className='flex--1 mg-t--lg'>
        <Spinner />
    </div>
);

const HomeComponent: FC = (): ReactElement => {
    const [user, setUser] = useState<UserWithId | null>(null);
    const [notifCount, setNotifCount] = useState<number>(0);
    const echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.PUSHER_APP_KEY,
        cluster: process.env.PUSHER_APP_CLUSTER,
    });

    async function getAuthUser() {
        const { data } = await axios.get('/users/auth');

        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    async function updateNotifStatus() {
        await axios.put('/notifications/status/update');
        setNotifCount(0);
    }

    async function getNotifCount() {
        const { data } = await axios.get('/notifications/count');
        setNotifCount(data.count);
    }

    useEffect(() => {
        if (!storageUser) {
            getAuthUser();
        } else {
            setUser(JSON.parse(storageUser));
        }

        getNotifCount();
    }, []);

    useEffect(() => {
        if (storageUser) {
            const { id } = JSON.parse(storageUser);

            echo.channel(`comment.count.${id}`).listen(
                'UserCommented',
                (data: EchoData) => {
                    setNotifCount(data.count);
                }
            );
        }
    }, [user]);

    return (
        <>
            <Helmet>
                <title>Home</title>
            </Helmet>

            <Header />

            <Router>
                <section
                    className='d--flex mg-l--auto mg-r--auto home'
                    data-testid='container'>
                    <Sidebar
                        user={user}
                        notifCount={notifCount}
                        updateNotifStatus={updateNotifStatus}
                    />

                    <Switch>
                        <Route path='/home' component={Timeline} />
                        <Route path='/u/:username'>
                            <Suspense fallback={<ProfileLoader />}>
                                <Profile />
                            </Suspense>
                        </Route>
                        <Route
                            path='/notifications'
                            component={Notifications}
                        />
                        <Route path='/users/search' component={Users} />
                        <Route
                            path='/posts/:id/comments'
                            component={PostView}
                        />
                    </Switch>

                    <Rightbar />
                </section>
            </Router>
        </>
    );
};

export default HomeComponent;
