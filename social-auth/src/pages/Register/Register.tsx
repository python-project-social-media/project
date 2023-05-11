import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useContext, useState } from "react";
import AuthContext from "src/context/context";
import { FaUserAlt, FaUserAstronaut, FaUserSecret } from "react-icons/fa";
import { AiFillLock } from "react-icons/ai";
import { MdEmail } from "react-icons/md";
import { Helmet } from "react-helmet";

function Register() {
  let { register }: any = useContext(AuthContext);

  const [username, setUsername]: any = useState("");
  const [email, setEmail]: any = useState("");
  const [name, setName]: any = useState("");
  const [surname, setSurname]: any = useState("");
  const [password, setPassword]: any = useState("");
  const [passwordA, setPasswordA]: any = useState("");

  return (
    <>
      <Helmet>
        <title>Kayıt Ol • SportCom</title>
      </Helmet>
      <div className="grid place-items-center mb-[0.68rem]">
        <div className="mb-6 mt-12 lg:w-1/2 w-11/12">
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
          <div className="mt-5 flex gap-3 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-1 font-semibold ml-2">
                <FaUserAstronaut />
                <span>Ad</span>
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="bg-[#EFEFEF] w-full border-2 border-[#D9D9D9] outline-none rounded-[6px] shadow-md focus:outline-none p-[2px] w-full hover:shadow-lg duration-300"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 font-semibold ml-2">
                <FaUserSecret />
                <span>Soyad</span>
              </div>
              <input
                type="text"
                onChange={(e) => {
                  setSurname(e.target.value);
                }}
                className="bg-[#EFEFEF] border-2 border-[#D9D9D9] outline-none rounded-[6px] shadow-md focus:outline-none p-[2px] w-full hover:shadow-lg duration-300"
              />
            </div>
          </div>
          <div className="mt-5">
            <div className="flex items-center gap-1 font-semibold ml-2">
              <MdEmail />
              <span>Email</span>
            </div>
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
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
          <div className="mt-5">
            <div className="flex items-center gap-1 font-semibold ml-2">
              <AiFillLock />
              <span>Şifre (Yeniden)</span>
            </div>
            <input
              type="password"
              onChange={(e) => {
                setPasswordA(e.target.value);
              }}
              className="bg-[#EFEFEF] border-2 border-[#D9D9D9] outline-none rounded-[6px] shadow-md focus:outline-none p-[2px] w-full hover:shadow-lg duration-300"
            />
          </div>
        </div>
      </div>
      <div className="grid place-items-center">
        <div className="flex items-center justify-between lg:w-1/2 w-11/12">
          <div>
            Zaten hesabın var mı?{" "}
            <Link to={"/login"} className="text-[#33B627] italic font-semibold">
              Giriş Yap
            </Link>
          </div>
          <button
            onClick={() => {
              register(username, name, surname, email, password, passwordA);
            }}
            className="bg-[#37902F] text-white py-[2px] px-8 shadow-md hover:shadow-lg duration-200 rounded-br-lg rounded-tl-lg"
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </>
  );
}

export default Register;
