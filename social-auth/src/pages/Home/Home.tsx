import { Link } from "react-router-dom";
import AuthContext from "../../context/context";
import React, { useContext } from "react";
function Home() {
  let { profile, logout }: any = useContext(AuthContext);
  return (
    // <div className="flex justify-center">
    //   <div className="px-3 lg:px-16">
    //     <div className="flex justify-between mt-8 items-center">
    //       <div className="col-auto">
    //         <h1 className="text-xl font-semibold">
    //           Günümüzdeki sporlara dair her şey.
    //         </h1>
    //         <h3>
    //           <i>
    //             Arkadaşlarınızla iletişime geçin, paylaiımlar yapın <br /> ve
    //             paylaşımlara göz atın.
    //           </i>
    //         </h3>
    //       </div>

    //       <div className="absolute right-0 top-1">
    //         <img
    //           src={"social-auth/src/assets/design.png"}
    //           alt="Design"
    //           className="w-8"
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <>
      {profile ? (
        <>
          <div>Hi {profile.user.username}</div>
          <div onClick={logout}>Logout</div>
        </>
      ) : (
        <Link to={"/login"}>Login</Link>
      )}
    </>
  );
}

export default Home;
