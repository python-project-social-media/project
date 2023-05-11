import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useContext, useState } from "react";
import AuthContext from "src/context/context";
import { FaUserAlt } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";
import { Helmet } from "react-helmet";

function Login() {
  let { responseGoogle, login }: any = useContext(AuthContext);

  const [username, setUsername]: any = useState("");
  const [password, setPassword]: any = useState("");

  return (
    <>
      <Helmet>
        <title>Giriş Yap • SportCom</title>
      </Helmet>
      <div className="grid place-items-center mb-[0.68rem]">
        <div className="mb-6 mt-12 lg:w-1/2 w-4/5">
          <div>
            <div className="flex items-center gap-1 font-semibold ml-2">
              <FaUserAlt />
              <span>Kullanıcı Adı</span>
            </div>
            <input
              type="text"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="bg-[#EFEFEF] border-2 border-[#D9D9D9] outline-none rounded-[6px] shadow-md focus:outline-none p-[2px] w-full hover:shadow-lg duration-300"
            />
          </div>
          <div className="mt-5">
            <div className="flex items-center gap-1 font-semibold ml-2">
              <AiFillLock />
              <span>Şifre</span>
            </div>
            <input
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="bg-[#EFEFEF] border-2 border-[#D9D9D9] outline-none rounded-[6px] shadow-md focus:outline-none p-[2px] w-full hover:shadow-lg duration-300"
            />
          </div>
        </div>
      </div>
      <div className="grid place-items-center">
        <div className="flex items-center justify-between lg:w-1/2 w-4/5">
          <div>
            Hesabın yok mu?{" "}
            <Link
              to={"/register"}
              className="text-[#33B627] italic font-semibold"
            >
              Kayıt Ol
            </Link>
          </div>
          <button
            onClick={() => {
              login(username, password);
            }}
            className="bg-[#37902F] text-white py-[2px] px-8 shadow-md hover:shadow-lg duration-200 rounded-br-lg rounded-tl-lg"
          >
            Giriş Yap
          </button>
        </div>
      </div>
      <div className="grid place-items-center">
        <div className="mt-5 lg:w-1/2 w-4/5">
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Login;
