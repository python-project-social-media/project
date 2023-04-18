import React, { useContext } from "react";
import AuthContext from "src/context/context";
import { Navigate, Outlet } from "react-router-dom";

const AuthProtect = () => {
  let { profile }: any = useContext(AuthContext);

  return !profile ? <Outlet /> : <Navigate to="/home" />;
};

export default AuthProtect;
