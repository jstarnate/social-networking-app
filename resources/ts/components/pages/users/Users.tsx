import React, { FC, ReactElement } from 'react';
import { Helmet } from 'react-helmet';

const Users: FC = (): ReactElement => {
    return (
        <section>
            <Helmet>
                <title>Users</title>
            </Helmet>

            <h1>Users</h1>
        </section>
    );
};

export default Users;
