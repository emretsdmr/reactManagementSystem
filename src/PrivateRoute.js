import React, {useEffect} from 'react';
import { useAuth } from './Auth/Auth';
import { Routes, Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state: {isAuthenticated} } = useAuth();
  return (
    <Routes>
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate
            to={{ pathname: "/login", state: { referer: props?.location } }}
          />
        )
      }
    />
    </Routes>
  );

}

export default PrivateRoute;