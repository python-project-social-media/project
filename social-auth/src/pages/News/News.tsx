import { useContext, useEffect, useState } from "react";
import { News as NewsI } from "../../interfaces/News";
import { Link } from "react-router-dom";
import { BiNews } from "react-icons/bi";
import NewsSingle from "../../components/NewsSingle/NewsSingle";
import AuthContext from "../../context/context";
import { Helmet } from "react-helmet";

function News() {
  const { profile }: any = useContext(AuthContext);

  const [news, setNews] = useState();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/news/all", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (resp: Response) => {
      if (resp.status == 200) {
        let data = await resp.json();
        setNews(data.data);
      }
    });
  }, []);

  return (
    <div className="without-header grid place-items-center mt-10">
      <Helmet>
        <title>Haberler • SportCom</title>
      </Helmet>
      <div className="lg:w-1/2 w-3/4">
        {profile && profile.user.is_superuser ? (
          <Link
            to={"/news/add"}
            className="bg-gradient-to-br font-semibold flex items-center justify-between from-stone-100/50 to-stone-200/50 text-[#37902f] border border-stone-200 rounded-lg p-1"
          >
            Haber Ekle
            <BiNews size={20} />
          </Link>
        ) : null}
        {news != undefined && news != null ? (
          news?.map((singlenews: NewsI) => {
            return (
              <div className="my-3">
                <NewsSingle key={singlenews.id} news={singlenews} />
              </div>
            );
          })
        ) : news == undefined ? (
          <div>
            <div className="my-3">
              <NewsSingle news={undefined} />
            </div>
            <div className="my-3">
              <NewsSingle news={undefined} />
            </div>
            <div className="my-3">
              <NewsSingle news={undefined} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default News;
