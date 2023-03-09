import React, { useContext } from "react";
import AuthContext from "../../context/context";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtect = () => {
  let { profile }: any = useContext(AuthContext);
  return profile ? <Navigate to="/" /> : <Outlet />;
};

export default AuthProtect;
