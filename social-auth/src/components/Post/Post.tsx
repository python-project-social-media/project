import { BsThreeDots } from "react-icons/bs";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { TfiCommentAlt } from "react-icons/tfi";
import "./Post.css";
import tr from "javascript-time-ago/locale/tr";
import TimeAgo from "javascript-time-ago";
import { useState, useContext, useEffect } from "react";
import { Post as PostI } from "../../interfaces/Post";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/context";
import { useLocation } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { toast } from "react-toastify";

function Post(params: { post: PostI | undefined }) {
  const { profile, deletePost, isPostDetail }: any = useContext(AuthContext);
  const [Post, setPost] = useState<PostI | undefined>(params.post);
  const [like, setLike] = useState<boolean>(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  TimeAgo.addLocale(tr);

  useEffect(() => {
    setPost(params.post);
  }, [params]);

  const postliketoggle = async () => {
    if (localStorage.getItem("key")) {
      await fetch(`http://127.0.0.1:8000/api/post/${Post?.id}/toggle`, {
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("key"),
        },
      }).then(async (resp: Response): Promise<void> => {
        let data = await resp.json();
        setPost(data.data);
        setLike(data.like);
      });
    } else {
      toast.info("Bu işlemi yapabilmek için giriş yapmalısınız. 😶");
    }
  };

  return (
    <>
      {params.post != undefined ? (
        <div className="shadow-lg w-full bg-[#F6F6F6] rounded-md max-w-md p-3">
          <div className="p-0">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-3">
                <Link
                  to={`/profile/${Post?.profile.user.id}`}
                  className="flex items-center gap-2"
                >
                  {Post?.profile?.profilePhotoUrl ? (
                    <img
                      src={Post?.profile?.profilePhotoUrl}
                      alt="PP"
                      className="rounded-full w-8 h-8 border border-[#C5C5C5]"
                    />
                  ) : (
                    <div className="rounded-full select-none w-8 h-8 border font-semibold text-sm bg-slate-300 border-[#C5C5C5] grid place-content-center">
                      {Post?.profile?.user?.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <p>{Post?.profile?.user?.username}</p>
                  <p className="font-bold scale-110">•</p>
                  <ReactTimeAgo
                    date={Post?.create || 0}
                    locale="tr-TR"
                    timeStyle={"mini-now"}
                  />
                </Link>
                {profile?.id == Post?.profile_id &&
                pathname != "/best-of-the-week" ? (
                  <RiDeleteBin5Fill
                    color="red"
                    className="cursor-pointer"
                    onClick={async () => {
                      await deletePost(Post?.id).then(() => {
                        if (isPostDetail(pathname)) {
                          navigate("/posts");
                        }
                      });
                    }}
                  />
                ) : null}
              </div>
              <Link to={`/post/${Post?.id}`} className="mb-3 block">
                {Post?.text}
                {Post?.file != "" ? (
                  <img
                    src={"http://127.0.0.1:8000" + Post?.file}
                    className="w-3/5 my-4"
                  />
                ) : null}
              </Link>
            </div>
            <div className="flex items-center justify-around">
              <div className="flex items-center gap-1">
                <TfiCommentAlt className="cursor-pointer" />
                <p>{Post?.comment_count}</p>
              </div>
              <div className="flex items-center gap-1">
                {like ? (
                  <AiFillHeart
                    className="cursor-pointer"
                    onClick={postliketoggle}
                    color="red"
                    size={19}
                  />
                ) : (
                  <AiOutlineHeart
                    className="cursor-pointer"
                    onClick={postliketoggle}
                    color="black"
                    size={19}
                  />
                )}
                <p>{Post?.like_count}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="shadow-lg bg-[#F6F6F6] rounded-md max-w-md p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full w-8 h-8 border font-semibold text-sm grid place-content-center fade-bg"></div>
              <div className="w-28 h-3 rounded-lg fade-bg"></div>
            </div>
            <BsThreeDots />
          </div>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <p className="my-2 w-5/6 h-2 rounded-lg fade-bg"></p>
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-1">
              <TfiCommentAlt className="cursor-pointer" color="gray" />
              <p className="w-3 h-2 rounded-lg fade-bg"></p>
            </div>
            <div className="flex items-center gap-1">
              <AiFillHeart className="cursor-pointer" color="gray" size={19} />
              <p className="w-3 h-2 rounded-lg fade-bg"></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
