import { useContext } from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import AuthContext from "../../context/context";
import { useLocation } from "react-router-dom";

function Sidebar() {
  const { pathname } = useLocation();

  function toggleSidebar() {
    const sidebar = document.querySelector(".sidebar");
    sidebar?.classList.toggle("-right-full");
    sidebar?.classList.toggle("right-0");
  }
  let { profile, logout }: any = useContext(AuthContext);

  return (
    <div className="h-full sidebar py-5 px-6 fixed lg:hidden block -right-full top-0 bg-[#F6F6F6] w-5/6 sm:w-3/4 z-50 shadow-md duration-300">
      <div className="flex justify-end ">
        <HiBars3BottomRight
          size={22}
          className="cursor-pointer text-[#3A902F]"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex flex-col items-end text-lg font-semibold text-[#37902F] gap-6 mt-5">
        {profile ? (
          <Link
            to={"/home"}
            className={pathname == "/home" ? "active" : ""}
            onClick={toggleSidebar}
          >
            Anasayfa
          </Link>
        ) : (
          <Link
            to={"/"}
            className={pathname == "/" ? "active" : ""}
            onClick={toggleSidebar}
          >
            Anasayfa
          </Link>
        )}
        <Link
          to={"/post/all"}
          className={pathname == "/post/all" ? "active w-fit" : "w-fit"}
          onClick={toggleSidebar}
        >
          Gönderiler
        </Link>
        <Link
          className={pathname == "/news" ? "active w-fit" : "w-fit"}
          to={"/news"}
          onClick={toggleSidebar}
        >
          Haberler
        </Link>
        <Link
          to={"/best-of-the-week"}
          className={pathname == "/best-of-the-week" ? "active w-fit" : "w-fit"}
          onClick={toggleSidebar}
        >
          Haftanın Enleri
        </Link>
        {profile ? (
          <div
            onClick={logout}
            className="register-button text-sm px-4 cursor-pointer"
          >
            Çıkış Yap
          </div>
        ) : (
          <Link to={"/login"} onClick={toggleSidebar}>
            <div className="text-sm font-normal register-button px-4">
              Giriş Yap
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
