import React, { useContext } from "react";
import AuthContext from "../../context/context";
import { Navigate, Outlet } from "react-router-dom";

const LoggedIn = () => {
  let { profile }: any = useContext(AuthContext);

  return profile ? <Outlet /> : <Navigate to="/" />;
};

export default LoggedIn;
