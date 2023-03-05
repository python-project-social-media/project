import AuthContext from "@/context/context";
import React, { useContext } from "react";
import { Link } from "react-router-dom";

function Home() {
  let { profile }: any = useContext(AuthContext);
  return (
    <div>
      <Link to={"/login"}>Login</Link>
    </div>
  );
}

export default Home;
