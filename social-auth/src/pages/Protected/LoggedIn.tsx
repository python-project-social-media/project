import AuthContext from "../../context/context";
import { Navigate, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

const LoggedIn = () => {
  let key = localStorage.getItem("key");
  const [flag, setFlag] = useState<boolean>(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/auth/user/", {
      method: "GET",
      headers: {
        Authorization: "Token " + key,
      },
    }).then(async (resp: Response) => {
      if (resp.status === 200) {
        let data: any = await resp.json();
        if (data.pk) {
          setFlag(true);
        } else {
          setFlag(false);
        }
      } else {
        setFlag(false);
      }
    });
  }, [key]);

  return key && flag == true ? <Outlet /> : <Navigate to="/" />;
};

export default LoggedIn;
