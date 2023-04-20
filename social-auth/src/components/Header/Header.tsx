import { Link } from "react-router-dom";
import "./Header.css";
import { useContext } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import AuthContext from "../../context/context";
import Wave from "src/assets/Wave.svg";
import { useLocation } from "react-router-dom";

function Header() {
  let { profile, logout, toggleSidebar }: any = useContext(AuthContext);
  const { pathname } = useLocation();

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
              <Link to={"/"} className="active">
                Anasayfa
              </Link>
            )}

            <Link to={"/post/all"}>En Popülerler</Link>
            <p>Haberler</p>
            <Link
              to={"/best-of-the-week"}
              className={pathname == "/best-of-the-week" ? "active" : ""}
            >
              Haftanın Enleri
            </Link>
          </div>
          <div className="auth-settings hidden md:flex items-center gap-4">
            {profile ? (
              <>
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
            <div className="h-6 bg-stone-400 w-[2px]"></div>
            <svg
              width="29"
              height="30"
              viewBox="0 0 29 30"
              className="w-6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M25.5119 16.5083C25.5858 16.0606 25.5858 15.5377 25.5858 15.0148C25.5858 14.492 25.5119 14.0442 25.5119 13.5213L28.6257 11.0572C28.9227 10.8333 28.9965 10.46 28.7742 10.0865L25.8081 4.93366C25.6596 4.63467 25.215 4.48597 24.9181 4.63467L21.2104 6.12825C20.4689 5.53099 19.5796 5.00805 18.6897 4.63467L18.1705 0.677093C18.0966 0.378823 17.7997 0.079834 17.4289 0.079834H11.4967C11.126 0.079834 10.8291 0.378823 10.7552 0.677093L10.1621 4.63467C9.27209 5.00805 8.45668 5.53092 7.64058 6.12825L3.93295 4.63467C3.56216 4.48597 3.19137 4.63467 3.04296 4.93366L0.0768454 10.0866C-0.0708713 10.3848 0.00288249 10.8333 0.225259 11.0573L3.41389 13.5213C3.41389 14.0442 3.34 14.492 3.34 15.0148C3.34 15.5377 3.41389 15.9855 3.41389 16.5083L0.300059 18.9725C0.00309163 19.1964 -0.0706621 19.5697 0.151575 19.9431L3.11769 25.096C3.26617 25.395 3.71079 25.5437 4.00768 25.395L7.71538 23.9014C8.45689 24.4987 9.34619 25.0216 10.2361 25.395L10.8292 29.3526C10.9037 29.726 11.1999 29.9498 11.5707 29.9498H17.503C17.8737 29.9498 18.1706 29.6508 18.2445 29.3526L18.8383 25.395C19.7276 25.0216 20.5437 24.4987 21.3591 23.9014L25.0668 25.395C25.4375 25.5437 25.8083 25.395 25.9568 25.096L28.9229 19.943C29.0713 19.6448 28.9968 19.1964 28.7744 18.9724L25.5119 16.5083ZM14.4629 20.2421C11.5706 20.2421 9.27222 17.9275 9.27222 15.0148C9.27222 12.1021 11.5706 9.78756 14.4629 9.78756C17.3551 9.78756 19.6536 12.1021 19.6536 15.0148C19.6536 17.9275 17.3551 20.2421 14.4629 20.2421Z"
                fill="black"
                fillOpacity="0.54"
              />
            </svg>
          </div>
          <div className="md:hidden block">
            {profile ? (
              <>
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
              </>
            ) : null}
          </div>
          <div className="md:hidden block">
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
