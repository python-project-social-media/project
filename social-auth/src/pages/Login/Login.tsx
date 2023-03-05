import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useContext } from "react";
import AuthContext from "@/context/context";
function Login() {
  let { responseGoogle }: any = useContext(AuthContext);

  return (
    <>
      <Link to={"/"}>Home</Link>
      <h3>Login</h3>
      <div>
        <input type="text" placeholder="username" />
      </div>
      <div>
        <input type="password" placeholder="password" />
      </div>
      <GoogleLogin
        onSuccess={responseGoogle}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </>
  );
}

export default Login;
