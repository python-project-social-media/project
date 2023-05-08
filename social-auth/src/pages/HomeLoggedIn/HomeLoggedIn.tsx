import { Link } from "react-router-dom";
import AuthContext from "../../context/context";
import { useContext, useEffect, useState } from "react";
import { Post as PostI } from "../../interfaces/Post";
import { News as NewsI } from "../../interfaces/News";
import Post from "../../components/Post/Post";
import NewsSingle from "../../components/NewsSingle/NewsSingle";
import { BiNews } from "react-icons/bi";
import { Profile as ProfileI } from "../../interfaces/Profile";
import { Navigation, Pagination, EffectCards } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "./HomeLoggedIn.css";
function HomeLoggedIn() {
  const { profile }: any = useContext(AuthContext);
  const [followings, setFollowings] = useState<ProfileI[] | undefined | null>();
  const [news, setNews] = useState<NewsI[] | undefined | null>();
  const [posts, setPosts] = useState<PostI[]>();

  useEffect(() => {
    if (profile) {
      fetch("http://127.0.0.1:8000/api/post/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + localStorage.getItem("key"),
        },
      }).then(async (response: Response) => {
        if (response.status == 200) {
          let data: { data: PostI[] } = await response.json();
          setPosts(data.data.splice(0, 5));
        }
      });
    } else {
      fetch("http://127.0.0.1:8000/api/post/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (response: Response) => {
        if (response.status == 200) {
          let data: { data: PostI[] } = await response.json();
          setPosts(data.data.splice(0, 5));
        }
      });
    }
    getNews();
    getFollows();
  }, []);

  const getFollows = async () => {
    await fetch("http://127.0.0.1:8000/api/profile/followings", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Token " + localStorage.getItem("key"),
      },
    }).then(async (resp: Response) => {
      let data: ProfileI[] = await resp.json();
      setFollowings(data);
      console.log(data);
    });
  };

  const getNews = async () => {
    await fetch("http://127.0.0.1:8000/api/news/all", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (resp: Response) => {
      let data: { data: NewsI[] } = await resp.json();
      setNews(data.data.splice(0, 4));
    });
  };

  return (
    <div className="lg:px-14 px-6 mt-5">
      <h3 className="text-lg font-semibold">
        <span>Hoşgeldin, </span>
        <span className="en">{profile?.user?.username}</span>
      </h3>
      <div className="flex flex-wrap gap-6">
        <div className="flex-1">
          {posts && posts.length > 0 ? (
            <div>
              {posts.map((post: PostI) => {
                return (
                  <div className="my-3 w-full">
                    <Post post={post} key={post.id} />
                  </div>
                );
              })}
              <Link to={`/post/all`} className="text-left block text-base en">
                Daha Fazla...
              </Link>
            </div>
          ) : posts == undefined ? (
            <div className="flex flex-1 flex-col gap-4 mt-3">
              <Post post={undefined} />
              <Post post={undefined} />
              <Post post={undefined} />
            </div>
          ) : (
            <h3 className="font-semibold text-xl">Gönderi yok. 😢</h3>
          )}
        </div>
        <div className="flex-1">
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
            <div>
              {news?.map((singlenews: NewsI) => {
                return (
                  <div className="my-3">
                    <NewsSingle key={singlenews.id} news={singlenews} />
                  </div>
                );
              })}
              <Link to={`/news`} className="text-right block text-base en">
                Daha Fazla...
              </Link>
            </div>
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
      <div>
        {followings && followings.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Takip Ettiklerin</h3>
            <Swiper
              spaceBetween={60}
              modules={[Navigation]}
              slidesPerView={4}
              navigation={true}
            >
              {followings.map((profile: ProfileI) => {
                return (
                  <SwiperSlide>
                    <Link
                      to={`/profile/${profile.user.id}`}
                      className="bg-stone-200 block border rounded-md shadow-md hover:shadow-lg duration-200 border-stone-300 p-3"
                    >
                      <div>
                        <div className="grid place-content-center">
                          {profile.profilePhotoUrl ? (
                            <img
                              src={profile.profilePhotoUrl}
                              className="rounded-full select-none w-16 h-16 "
                            />
                          ) : (
                            <div className="rounded-full select-none w-16 h-16 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                              {profile.user.username.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-2 font-semibold">
                          {profile.user.username}
                        </div>
                        <div className="flex gap-6 justify-center">
                          <div>
                            <span className="text-green-400 font-semibold">
                              {profile.followers.length}
                            </span>{" "}
                            Takipçi
                          </div>
                          <div>
                            <span className="text-green-400 font-semibold">
                              {profile.following.length}
                            </span>{" "}
                            Takip Edilen
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HomeLoggedIn;
