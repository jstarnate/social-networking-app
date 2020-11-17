import React, { FC, ReactElement } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './modules/Header';
import Sidebar from './modules/Sidebar';
import Rightbar from './modules/Rightbar';
import Timeline from './pages/home/Timeline';
import Profile from './pages/profile/Profile';
import Notifications from './pages/notifications/Notifications';
import Users from './pages/users/Users';
import PostView from 'pages/general/PostView';

const HomeComponent: FC = (): ReactElement => {
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
                    <Sidebar />

                    <Switch>
                        <Route path='/home' component={Timeline} />
                        <Route path='/profile' component={Profile} />
                        <Route
                            path='/notifications'
                            component={Notifications}
                        />
                        <Route path='/users' component={Users} />
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
