import { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { News } from "../../interfaces/News";
import NewsSingle from "../../components/NewsSingle/NewsSingle";
import AuthContext from "../../context/context";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { Helmet } from "react-helmet";

function NewsDetail() {
  const [news, setNews] = useState<News | undefined | null>(undefined);
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const { profile, deleteNews }: any = useContext(AuthContext);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const GetNews = async () => {
    await fetch(`http://127.0.0.1:8000/api/news/${params.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      if (resp.status == 200) {
        if (data.data) {
          setNews(data.data);
        }
      } else if (resp.status == 400) {
        setNews(null);
      }
    });
  };

  useEffect(() => {
    GetNews();
  }, [params.id]);

  return (
    <div className="lg:px-16 px-4">
      <Helmet>
        {news ? (
          <title>{news?.title.slice(0, 11)}... • SportCom</title>
        ) : (
          <title>Haber Detayı • SportCom</title>
        )}
      </Helmet>
      <div className="grid place-items-center mt-8">
        <div className="lg:w-4/5 md:w-5/6 w-full">
          {news != null && news != undefined ? (
            <div
              className="bg-[#F6F6F6]/60 border my-3 border-stone-200 block p-3 rounded-md shadow-lg hover:shadow-xl duration-200"
              key={news?.id}
            >
              <div className="flex gap-2 justify-between items-center mb-2">
                <Link to={`/profile/${news?.profile.id}`}>
                  <div className="flex gap-2 items-center">
                    {news?.profile.profilePhotoUrl ? (
                      <img
                        src={news?.profile.profilePhotoUrl}
                        alt={news?.profile.user.username}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="rounded-full select-none w-8 h-8 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                        {news?.profile.user.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span>{news?.profile.user.username}</span>
                  </div>
                </Link>

                <div>
                  {pathname != "/home" ? (
                    <div className="flex items-center gap-3">
                      {profile?.id == news?.profile_id &&
                      profile.user.is_superuser ? (
                        <AiFillEdit
                          onClick={() => {
                            navigate(`/news/${news?.id}/update`);
                          }}
                          className="cursor-pointer"
                        />
                      ) : null}
                      {profile?.id == news?.profile_id &&
                      profile.user.is_superuser ? (
                        <RiDeleteBin5Fill
                          color="red"
                          className="cursor-pointer"
                          onClick={async () => {
                            await deleteNews(news.id).then(() => {
                              navigate("/news");
                            });
                          }}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
              <Link to={`/news/${news?.id}`}>
                <h3 className="text-lg font-semibold">{news?.title}</h3>
                <p className="italic">{news?.description}</p>
                {news?.image ? (
                  <img
                    src={"http://127.0.0.1:8000" + news?.image}
                    alt={news?.title}
                    className="h-64 my-3"
                  />
                ) : null}
                <span className="font-light italic">
                  Eklenme tarihi :{" "}
                  {new Date(news?.edit!).toLocaleString(undefined, options)}
                </span>
              </Link>
            </div>
          ) : news == undefined ? (
            <>
              <NewsSingle news={undefined} />
            </>
          ) : (
            <h3 className="text-xl font-semibold">Haber bulunamadı. 😒</h3>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
