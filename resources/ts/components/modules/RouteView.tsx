import { FC, ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from 'modules/Header';

interface Props {
    path: string;
    title?: string;
    subTitle: string;
    exact?: boolean;
    component?: FC;
    children?: ReactNode;
}

function RouteView(props: Props) {
    return (
        <Route exact={props.exact} path={props.path}>
            <div className='flex--1'>
                {props.title && (
                    <Helmet>
                        <title>{props.title}</title>
                    </Helmet>
                )}

                <Header title={props.subTitle} path={props.path} />

                {props.component ? <props.component /> : props.children}
            </div>
        </Route>
    );
}

RouteView.defaultProps = {
    exact: false,
};

export default RouteView;
