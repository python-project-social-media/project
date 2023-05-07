import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { News } from "../../interfaces/News";
import { type } from "os";

function NewsDetail() {
  const [news, setNews] = useState<News | undefined | null>();

  const params = useParams();

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
        Authorization: "Token " + localStorage.getItem("key"),
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
  }, [params]);

  return (
    <div className="lg:px-16 px-4">
      <div className="grid place-items-center mt-8">
        <div className="lg:w-4/5 md:w-5/6 w-full">
          <div
            className="bg-[#F6F6F6]/60 border my-3 border-stone-200 block p-3 rounded-md shadow-lg hover:shadow-xl duration-200"
            key={news?.id}
          >
            <Link
              to={`/profile/${news?.profile.id}`}
              className="flex gap-2 items-center mb-2"
            >
              {news?.profile.profilePhotoUrl ? (
                <img
                  src={"http://127.0.0.1:8000" + news?.profile.profilePhotoUrl}
                  alt={news?.profile.user.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="rounded-full select-none w-8 h-8 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                  {news?.profile.user.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span>{news?.profile.user.username}</span>
            </Link>
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
              <span className="font-semibold">
                Eklenme tarihi :{" "}
                {new Date(news?.edit!).toLocaleString(undefined, options)}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
