import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Post as PostI } from "../../interfaces/Post";
import { News as NewsI } from "../../interfaces/News";
import Post from "../../components/Post/Post";
import NewsSingle from "../../components/NewsSingle/NewsSingle";
import { Helmet } from "react-helmet";

function SearchPage() {
  const params = useParams();
  const [posts, setPosts] = useState<PostI[] | null>();
  const [news, setNews] = useState<NewsI[] | null>();

  useEffect(() => {
    setPosts(null);
    setNews(null);
    if (localStorage.getItem("key")) {
      fetch(`http://127.0.0.1:8000/api/post-news/search/${params.search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("key"),
        },
      }).then(async (resp: Response) => {
        if (resp.status === 200) {
          let data: [{ posts: PostI[]; news: NewsI[] }] = await resp.json();
          setPosts(data[0].posts);
          setNews(data[0].news);
        }
      });
    } else {
      fetch(`http://127.0.0.1:8000/api/post-news/search/${params.search}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (resp: Response) => {
        if (resp.status === 200) {
          let data: [{ posts: PostI[]; news: NewsI[] }] = await resp.json();
          setPosts(data[0].posts);
          setNews(data[0].news);
        }
      });
    }
  }, [params]);

  return (
    <>
      <Helmet>
        <title>{params.search} • SportCom</title>
      </Helmet>
      <div className="flex flex-wrap items-start without-header gap-6 lg:px-16 px-4">
        {posts && posts?.length > 0 ? (
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-1 mt-5">
              <span className="en">Gönderiler </span>
              <span className="text-base text-black">({posts.length})</span>
            </h3>
            {posts?.map((post: PostI) => {
              return (
                <div className="my-3">
                  <Post key={post.id} post={post} />
                </div>
              );
            })}
          </div>
        ) : null}
        {news && news?.length > 0 ? (
          <div className="flex-1">
            <h3 className="font-semibold text-xl mb-1 mt-5">
              <span className="en">Haberler </span>
              <span className="text-base text-black">({news.length})</span>
            </h3>
            {news?.map((news: NewsI) => {
              return (
                <div className="my-3">
                  <NewsSingle key={news?.id} news={news} />
                </div>
              );
            })}
          </div>
        ) : null}
        {news == null && posts == null ? (
          <div className="text-center w-full mt-12 text-xl font-semibold">
            Yükleniyor. ⚡
          </div>
        ) : null}
        {news && posts && posts.length == 0 && news.length == 0 ? (
          <div className="mt-12 text-center text-xl font-semibold w-full">
            '{params.search}' içeren herhangi bir gönderi veya haber bulunamadı.
            😞
          </div>
        ) : null}
      </div>
    </>
  );
}

export default SearchPage;
