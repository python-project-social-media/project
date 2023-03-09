import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
const AuthContext = createContext({});

export default AuthContext;

export const AuthProvider = ({ children }: any) => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (localStorage.getItem("profile")) {
      setProfile(jwt_decode(localStorage.getItem("profile")!));
    } else {
      setProfile(undefined);
    }
  }, []);

  const addProfile = async (data: any) => {
    let response = await fetch("http://localhost:8000/api/profile/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (resp: Response) => {
      let data = await resp.json();
      setProfile(jwt_decode(data));
      localStorage.setItem("profile", data);
    });
  };

  const responseGoogle = async (tokens: any) => {
    let resp: Promise<Response | void> = fetch(
      "http://localhost:8000/api/rest-auth/google/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: tokens.credential,
        }),
      }
    ).then(async (resp: Response) => {
      if (resp.status == 200) {
        let data: any = await resp.json();
        let user_data: any = jwt_decode(tokens.credential);
        let addProfileData = {
          user: data.user.pk,
          profilePhotoUrl: user_data.picture,
        };
        addProfile(addProfileData);
      }
    });
  };

  let contextData = {
    profile: profile,
    responseGoogle: responseGoogle,
    addProfile: addProfile,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
