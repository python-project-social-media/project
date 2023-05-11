import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Profile as ProfileI } from "../../interfaces/Comment";
import AuthContext from "../../context/context";
import { toast } from "react-toastify";
import { Post as PostI } from "../../interfaces/Post";
import Post from "../../components/Post/Post";
import { Helmet } from "react-helmet";

function Profile() {
  const [profileCurr, setProfileCurr] = useState<ProfileI | number>(0);
  const [usersPosts, setUsersPosts] = useState<PostI[]>();
  const params = useParams();
  const { profile }: any = useContext(AuthContext);

  const getProfile = async () => {
    setProfileCurr(0);
    await fetch(`http://127.0.0.1:8000/api/profile/${params.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (response: Response) => {
      let data: { data: ProfileI } = await response.json();
      if (response.status === 200) {
        setProfileCurr(data.data);
      } else if (response.status === 404) {
        setProfileCurr(1);
      }
    });
  };

  const getUsersPosts = async () => {
    await fetch(`http://127.0.0.1:8000/api/profile/${params.id}/posts`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (response: Response) => {
      let data: PostI[] = await response.json();
      setUsersPosts(data);
      console.log(data);
    });
  };

  useEffect(() => {
    getProfile();
    getUsersPosts();
  }, [params]);

  const toggleFollow = async (pid: number) => {
    await fetch(`http://127.0.0.1:8000/api/profile/${pid}/follow`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Token " + localStorage.getItem("key"),
      },
    }).then(async (resp: Response) => {
      let data: { data: ProfileI; msg_tr: string } = await resp.json();
      setProfileCurr(data.data);
      toast.success(data.msg_tr);
    });
  };

  return (
    <div className="mt-5 without-header px-4 lg:px-16">
      <Helmet>
        {profileCurr && typeof profileCurr != "number" ? (
          <title>{profileCurr?.user?.username} • SportCom</title>
        ) : (
          <title>Profil • SportCom</title>
        )}
      </Helmet>
      {typeof profileCurr != "number" ? (
        <div className=" bg-stone-100/50 shadow-md hover:shadow-lg rounded-md duration-200 p-3">
          <div className="flex items-center gap-3">
            <div>
              {profileCurr?.profilePhotoUrl ? (
                <img
                  src={profileCurr?.profilePhotoUrl}
                  alt="PP"
                  className="rounded-full w-[3.5rem] h-[3.5rem] border border-[#C5C5C5]"
                />
              ) : (
                <div className="rounded-full select-none w-[3.5rem] h-[3.5rem] border font-semibold text-2xl bg-slate-300 border-[#C5C5C5] grid place-content-center">
                  {profileCurr?.user?.username.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xl font-semibold">
              {profileCurr?.user.username}
            </span>
            {localStorage.getItem("key") ? (
              profileCurr?.followers.includes(profile?.user?.id) ? (
                <button
                  onClick={() => {
                    toggleFollow(profileCurr?.user.id);
                  }}
                  className="from-[#34802d] to-[#5ebd55] bg-gradient-to-br text-white opacity-70 border-[#469c3e] border p-[2px] text-sm shadow-md hover:shadow-lg duration-200 rounded-tr-lg rounded-bl-lg"
                >
                  Takip Ediliyor ({profileCurr.followers?.length})
                </button>
              ) : (
                <button
                  onClick={() => {
                    toggleFollow(profileCurr?.user.id);
                  }}
                  className="from-[#34802d] to-[#5ebd55] bg-gradient-to-br text-white opacity-70 border-[#469c3e] border p-[2px] text-sm shadow-md hover:shadow-lg duration-200 rounded-tr-lg rounded-bl-lg"
                >
                  Takip Et ({profileCurr?.followers?.length})
                </button>
              )
            ) : (
              <div className="from-[#34802d] to-[#5ebd55] bg-gradient-to-br text-white cursor-no-drop opacity-70 border-[#469c3e] border p-[2px] text-sm shadow-md hover:shadow-lg duration-200 rounded-tr-lg rounded-bl-lg">
                Takip Et
              </div>
            )}
          </div>
          <p className="mt-2 font-medium">
            {profileCurr?.bio != "0"
              ? profileCurr?.bio
              : "Kullanıcı hakkında herhangi bir bilgi verilmedi."}
          </p>
        </div>
      ) : null}
      {profileCurr == 1 ? (
        <div className="text-xl text-center mt-8 font-semibold">
          Kullanıcı bulunamadı. 😞
        </div>
      ) : null}
      {profileCurr == 0 ? (
        <div className="text-xl text-center mt-8 font-semibold">
          Yükleniyor. ⚡
        </div>
      ) : null}

      {usersPosts && usersPosts.length > 0 ? (
        <div className="lg:w-1/2 w-4/5">
          <h3 className="mt-8 font-semibold text-xl en">Gönderileri</h3>
          {usersPosts.map((post: PostI) => {
            return (
              <div className="my-3">
                <Post post={post} key={post.id} />
              </div>
            );
          })}
        </div>
      ) : null}
      {usersPosts && usersPosts.length == 0 ? (
        <div className="text-lg mt-5 font-semibold">
          Kullanıcı gönderi paylaşmamış. 😶
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
