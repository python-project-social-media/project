import "src/pages/Home/Home.css";
import HomeBall from "src/assets/Home-Ball.svg";
import download from "src/assets/ios-cloud-download-outline.svg";
import paw from "src/assets/ios-paw-outline.svg";
import people from "src/assets/ios-people-outline.svg";
import Mailbox from "src/assets/mailbox.svg";
import Chatting from "src/assets/Chatting.svg";
import Chat from "src/assets/Chat.svg";
import { Helmet } from "react-helmet";

function Home() {
  return (
    <>
      <Helmet>
        <title>Anasayfa • SportCom</title>
      </Helmet>
      <div className="flex justify-center">
        <div className="px-3 lg:px-16">
          <div className="flex flex-wrap w-full lg:justify-between justify-center mt-10 pt-5 items-center">
            <div>
              <h1 className="text-2xl mb-3 font-semibold">
                Günümüzdeki sporlara dair her şey.
              </h1>
              <h3>
                <i>
                  Arkadaşlarınızla iletişime geçin, paylaiımlar yapın <br /> ve
                  paylaşımlara göz atın.
                </i>
              </h3>
            </div>
            <img src={Chat} className="md:w-1/3 w-1/2" />
          </div>
          {/* Triple */}
          <div className="flex lg:justify-between justify-center lg:gap-0 gap-6 flex-wrap items-center mt-10 pt-5 font-bold">
            <div>
              <p>Business Solution</p>
              <p className="font-semibold">Interdum et malesuada ac ante…</p>
            </div>
            <div className="w-[2px] h-8 bg-stone-200 rounded-md md:block hidden"></div>
            <div>
              <p>Free project quote</p>
              <p className="font-semibold">Interdum et malesuada ac ante…</p>
            </div>
            <div className="w-[2px] h-8 bg-stone-200 rounded-md md:block hidden"></div>
            <div>
              <p>Nulla lobortis nunc</p>
              <p className="font-semibold">Interdum et malesuada ac ante…</p>
            </div>
          </div>
          {/* Size Sunduklarımız */}
          <div className="text-center my-8 py-5">
            <h2 className="font-bold text-3xl">Size Sunduklarmız</h2>
            <div className="flex justify-center">
              <div className="w-14 h-[0.4rem] mt-2 fade-bg-green rounded-lg"></div>
            </div>
            {/* Divs */}
            <div className="my-8 py-5">
              <div>
                <div className="flex items-center gap-4 flex-wrap lg:justify-evenly justify-center">
                  <div className="flex justify-center col-auto">
                    <img src={Mailbox} alt="Mailbox" className="w-56" />
                  </div>
                  <div className="lg:w-1/3 sm:w-72 w-64">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#37902F]"></div>
                      <div className="text-lg font-semibold">
                        Vivamus sit amet interdum
                      </div>
                    </div>
                    <div className="text-left">
                      Nam sollicitudin dignissim nunc, cursus ullamcorper eros
                      vulputate sed. Vestibulum sit amet tortor sit amet libero
                      lobortis.
                    </div>
                  </div>
                </div>
              </div>
              <div className="my-8">
                <div className="flex items-center gap-4 flex-wrap lg:justify-evenly justify-center">
                  <div className="lg:w-1/3 sm:w-72 w-64">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold">
                        Vivamus sit amet interdum
                      </div>
                      <div className="w-4 h-4 rounded-full bg-[#37902F]"></div>
                    </div>
                    <div className="text-left">
                      Nam sollicitudin dignissim nunc, cursus ullamcorper eros
                      vulputate sed. Vestibulum sit amet tortor sit amet libero
                      lobortis.
                    </div>
                  </div>
                  <div className="flex justify-center col-auto">
                    <img src={Chatting} alt="Mailbox" className="w-64" />
                  </div>
                </div>
              </div>
              <div className="my-10">
                <p className="text-xl font-semibold">
                  Vivamus sit amet interdum
                </p>
                <div className="flex justify-center mt-2">
                  <div className="w-4 h-4 rounded-full bg-[#37902F]"></div>
                </div>
                <p className="mt-5 text-center">
                  Vestibulum sit amet tortor sit amet libero lobortis semper at
                  et odio.
                </p>
              </div>
            </div>
            {/* Toluluklar */}
            <div className="relative">
              <div className="flex items-center flex-wrap justify-center gap-8">
                <div>
                  <div className="text-3xl font-bold text-[#006064]">+200M</div>
                  <div className="flex items-center gap-2">
                    <img src={download} className="w-6" />
                    <p className="text-lg font-semibold">İndirme</p>
                  </div>
                </div>
                <div className="w-[1px] bg-[#D8D8D8] h-7 sm:block hidden"></div>
                <div>
                  <div className="text-3xl font-bold text-[#006064]">+480M</div>
                  <div className="flex items-center gap-2">
                    <img src={people} className="w-8" />
                    <p className="text-lg font-semibold">Üye</p>
                  </div>
                </div>
                <div className="w-[1px] bg-[#D8D8D8] h-7 sm:block hidden"></div>
                <div>
                  <div className="text-3xl font-bold text-[#006064]">+18K</div>
                  <div className="flex items-center gap-2">
                    <img src={paw} className="w-5" />
                    <p className="text-lg font-semibold">Topluluk</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-16">
                <img src={HomeBall} className="w-72" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
