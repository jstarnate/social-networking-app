import React, { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet';

const Notifications: FC = (): ReactElement => {
    return (
        <section>
            <Helmet>
                <title>Notifications</title>
            </Helmet>

            <h1>Notifications</h1>
        </section>
    );
};

export default Notifications;
