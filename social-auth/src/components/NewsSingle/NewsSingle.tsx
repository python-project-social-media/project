import { useState } from "react";
import { News as NewsI } from "../../interfaces/News";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";

function NewsSingle(params: { news: NewsI | undefined }) {
  const [news, setNews] = useState(params.news);

  return (
    <div>
      {news ? (
        <div className="bg-stone-100/50 p-3 mt-6 rounded-md" key={news.id}>
          <div className="flex gap-2 items-center mb-2">
            {news.profile.profilePhotoUrl ? (
              <img
                src={"http://127.0.0.1:8000" + news.profile.profilePhotoUrl}
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
              date={news?.create || 0}
              locale="tr-TR"
              timeStyle={"mini-now"}
            />
          </div>
          <h3 className="text-lg font-semibold">{news.title}</h3>
          <p className="italic">{news.description}</p>
          {news?.image ? (
            <img
              src={"http://127.0.0.1:8000" + news.image}
              alt={news.title}
              className="h-48 mt-3"
            />
          ) : null}
        </div>
      ) : (
        <div>
          <div className="bg-stone-100/75 p-3 mt-6 rounded-md">
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
