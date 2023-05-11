import { useState, useContext } from "react";
import { News as NewsI } from "../../interfaces/News";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import tr from "javascript-time-ago/locale/tr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import AuthContext from "../../context/context";

function NewsSingle(params: { news: NewsI | null | undefined }) {
  const [news, setNews] = useState(params.news);
  const { profile, deleteNews }: any = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  TimeAgo.addLocale(tr);
  return (
    <div>
      {news != undefined && news != null ? (
        <div
          className="bg-[#F6F6F6]/60 border border-stone-200 block p-3 rounded-md shadow-lg hover:shadow-xl duration-200"
          key={news.id}
        >
          <div className="flex justify-between items-center mb-2">
            <Link
              to={`/profile/${news.profile.user.id}`}
              className="flex gap-2 items-center"
            >
              {news.profile.profilePhotoUrl ? (
                <img
                  src={news.profile.profilePhotoUrl}
                  alt={news.profile.user.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="rounded-full select-none w-8 h-8 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                  {news.profile.user.username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span>{news.profile.user.username}</span>
              <p className="font-bold scale-110">•</p>
              <ReactTimeAgo
                className="whitespace-nowrap"
                date={new Date(news?.create) || 0}
                locale="tr-TR"
                timeStyle={"mini-now"}
              />
            </Link>
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
          <Link to={`/news/${news.id}`}>
            <h3 className="text-lg font-semibold">{news.title}</h3>
            <p className="italic">{news.description}</p>
            {news?.image ? (
              <img
                src={"http://127.0.0.1:8000" + news.image}
                alt={news.title}
                className="w-1/2 mt-3"
              />
            ) : null}
          </Link>
        </div>
      ) : (
        <div>
          <div className="bg-[#F6F6F6]/60 p-3 rounded-md shadow-lg hover:shadow-xl duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full w-8 h-8 border font-semibold text-sm grid place-content-center fade-bg"></div>
                <div className="w-28 h-3 rounded-lg fade-bg"></div>
              </div>
            </div>
            <h3 className="fade-bg w-2/3 h-2 rounded-lg"></h3>
            <p className="fade-bg w-9/12 mt-2 h-2 rounded-lg"></p>
            <p className="fade-bg w-5/6 mt-2 h-2 rounded-lg"></p>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsSingle;
