import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import NewIncident from './Pages/NewIncident';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" component={Login} exact />
                <Route path="/register" component={Register} />
                <ProtectedRoute path="/profile" component={Profile} />
                <ProtectedRoute path="/incidents/new" component={NewIncident} />
            </Switch>
        </BrowserRouter>
    );
}

