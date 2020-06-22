import React from "react";
import { Route, Redirect } from "react-router-dom";

const isLoggedIn = () => {
  const auth = localStorage.getItem("auth");
  return auth ? true : false;
};

export function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export function PublicRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isLoggedIn() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
