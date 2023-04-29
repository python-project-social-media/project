import React, { useContext } from "react";
import AuthContext from "../../context/context";
import { Navigate, Outlet } from "react-router-dom";

const Admin = () => {
  let { profile }: any = useContext(AuthContext);

  return profile && profile.user.is_superuser ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  );
};

export default Admin;
