import { Link } from "react-router-dom";
import "./Header.css";
import { useContext, useState } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { BsSearch } from "react-icons/bs";
import AuthContext from "../../context/context";
import Wave from "src/assets/Wave.svg";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function Header() {
  let { profile, logout, toggleSidebar }: any = useContext(AuthContext);
  const { pathname } = useLocation();
  const [search, setSearch] = useState<string>("");

  return (
    <div className="flex justify-center z-50">
      <div className="px-3 w-full lg:px-12">
        <div className="header flex justify-between items-center p-3">
          <img
            src={Wave}
            alt="Design"
            className="w-64 absolute right-0 -z-30 top-0"
          />
          <Link to={"/"} className="icon">
            <img
              src="https://www.freepnglogos.com/uploads/sport-png/sport-run-for-fun-south-cambs-district-council-24.png"
              alt="SportCom"
              className="w-9 h-9"
            />
          </Link>
          <div className="links gap-6 hidden md:flex text-[#37902F] font-semibold">
            {profile ? (
              <Link
                to={"/home"}
                className={pathname == "/home" ? "active" : ""}
              >
                Anasayfa
              </Link>
            ) : (
              <Link to={"/"} className={pathname == "/" ? "active" : ""}>
                Anasayfa
              </Link>
            )}

            <Link
              to={"/post/all"}
              className={pathname == "/post/all" ? "active" : ""}
            >
              Gönderiler
            </Link>
            <Link to={"/news"} className={pathname == "/news" ? "active" : ""}>
              Haberler
            </Link>
            <Link
              to={"/best-of-the-week"}
              className={pathname == "/best-of-the-week" ? "active" : ""}
            >
              Haftanın Enleri
            </Link>
          </div>
          <div className="search flex ">
            <div
              className="w-full mx-auto flex flex-1 items-stretch
            "
            >
              <input
                type="text"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="bg-gradient-to-br w-full from-stone-100 to-stone-200 border-stone-200 border rounded-l-lg text-sm shadow-md outline-none px-1 py-[2px]"
              />
              {search!.length > 0 ? (
                <Link
                  to={`/search/${search}`}
                  className="bg-gradient-to-br from-stone-100 to-stone-200 border-stone-200 border  rounded-r-lg grid place-content-center shadow-md outline-none px-1 py-[2px]"
                >
                  {" "}
                  <BsSearch />
                </Link>
              ) : (
                <div
                  onClick={() => {
                    toast.info("Aramak için bir şey girin.");
                  }}
                  className="bg-gradient-to-br from-stone-100 to-stone-200 border-stone-200 border  rounded-r-lg grid place-content-center shadow-md outline-none px-1 py-[2px]"
                >
                  {" "}
                  <BsSearch />
                </div>
              )}
            </div>
          </div>
          <div className="auth-settings hidden lg:flex items-center gap-4">
            {profile ? (
              <>
                <Link to={`/profile/${profile?.user?.id}`}>
                  {profile.profilePhotoUrl ? (
                    <img
                      src={profile.profilePhotoUrl}
                      className="rounded-full select-none w-8 h-8 "
                    />
                  ) : (
                    <div className="rounded-full select-none w-8 h-8 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                      {profile.user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="register-button hover:shadow-md duration-200 text-sm"
                >
                  ÇIKIŞ YAP
                </button>
              </>
            ) : (
              <>
                <Link to={"/login"}>
                  <div className="text-sm font-normal">GİRİŞ</div>
                </Link>
                <Link
                  to={"/register"}
                  className="register-button hover:shadow-md duration-200 text-sm"
                >
                  KAYIT OL
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden block">
            {profile ? (
              <>
                <Link to={`/profile/${profile?.user?.id}`}>
                  {profile.profilePhotoUrl ? (
                    <img
                      src={profile.profilePhotoUrl}
                      className="rounded-full select-none w-8 h-8 "
                    />
                  ) : (
                    <div className="rounded-full select-none w-8 h-8 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                      {profile.user.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </Link>
              </>
            ) : null}
          </div>
          <div className="lg:hidden block">
            <HiBars3BottomRight
              size={22}
              className="cursor-pointer z-50"
              onClick={toggleSidebar}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
