import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import authService from './services/authService';
  
const PrivateRoute = ({ component: Component, ...rest }: any) => (
  <Route {...rest} render={(props) => {
    const isAuthenticated = authService.isAuthenticated();
    if (!isAuthenticated) {    
      return <Redirect to={{ pathname: '/login' }} />
    }
  
    return <Component {...props} />
  }} />
);
  
export default PrivateRoute;