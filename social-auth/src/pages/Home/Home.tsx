import AuthContext from "@/context/context";
import React, { useContext } from "react";
import "@/index.css";
function Home() {
  let { profile }: any = useContext(AuthContext);
  return (
    <div className="flex justify-center">
      <div className="px-3 lg:px-14">
        <div className="flex mt-8">
          <div className="text-side">
            <h1 className="text-lg font-semibold">
              Günümüzdeki sporlara dair her şey.
            </h1>
            <h3>
              <i>
                Arkadaşlarınızla iletişime geçin, paylaiımlar yapın ve
                paylaşımlara göz atın.
              </i>
            </h3>
          </div>
          <div className="svg">burada svg olacak</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
