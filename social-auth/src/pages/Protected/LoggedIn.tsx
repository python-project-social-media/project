import React, { useContext } from "react";
import AuthContext from "src/context/context";
import { Navigate, Outlet } from "react-router-dom";

const LoggedIn = () => {
  let { profile }: any = useContext(AuthContext);
  console.log("varsa");

  return profile ? <Outlet /> : <Navigate to="/" />;
};

export default LoggedIn;
