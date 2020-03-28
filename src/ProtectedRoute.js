import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({component: Component, ...rest}) => {
  return (
    <Route
      {...rest}
      render={props => {
        const token = localStorage.getItem('token');
        if (token) {
          return <Component {...props} />;
        }
        return <Redirect to="/" />
      }}
    />
  );
}

export default ProtectedRoute;
