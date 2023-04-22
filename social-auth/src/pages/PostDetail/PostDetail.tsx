import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import Comment from "../Comment/Comment";
import { toast } from "react-toastify";
import AuthContext from "../../context/context";
import { Comment as CommentI } from "../../interfaces/Comment";

function PostDetail() {
  const { comments, getComments, post, GetPost }: any = useContext(AuthContext);

  const [text, setText] = useState<string>("");
  const params = useParams();

  const addComment = async () => {
    if (!text) {
      toast.info("Yorumunuzu girmediniz. 😒");
      return;
    }
    if (text && text?.length < 8) {
      toast.info("Yorumunuzun uzunluğu minimum 8 olmalı. 🤨");
      return;
    }
    if (text && text?.length > 120) {
      toast.info("Yorumunuzun uzunluğu maksimum 120 olmalı. 😥");
      return;
    }
    if (!localStorage.getItem("key")) {
      toast.info("Bu işlemi yapabilmek için giriş yapmalısınız. 😶");
      return;
    }
    await fetch(`http://127.0.0.1:8000/api/post/${params?.id!}/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("key"),
      },
      body: JSON.stringify({
        text: text,
      }),
    }).then(async (resp: Response) => {
      if (resp.status === 200) {
        let comment: HTMLInputElement | null =
          document.querySelector(".comment");
        if (comment != null) {
          comment.value = "";
        }
        await getComments(params?.id!);
        toast.success("Yorumunuz kaydedildi. 🎉");
        GetPost(params?.id!);
      }
    });
  };

  useEffect(() => {
    GetPost(params.id!);
    getComments(params.id);
  }, [params]);

  return (
    <>
      <div className="px-4 lg:px-24 mt-10 without-header">
        {post !== null && post !== undefined ? (
          <>
            <Post key={post?.id} post={post!} />
            <div className="relative mt-3 max-w-md w-full">
              <input
                onChange={(e) => {
                  setText(e.target.value);
                }}
                className="bg-stone-200 comment shadow-md hover:shadow-lg w-full pr-[5.2rem] duration-200 p-2 rounded-lg outline-none"
                placeholder="Yorumunuz 🎉"
              />
              <button
                onClick={addComment}
                className="bg-[#37902F] text-center hover:bg-[#34802d] text-sm duration-200 shadow-md hover:shadow-lg absolute right-0 top-0 rounded-r-md h-[40px] text-white p-1"
              >
                Gönder 🕊️
              </button>
              <div
                className={
                  text.length > 120 ? `text-red-500 mt-1 italic` : `mt-1 italic`
                }
              >
                {text?.length}/120
              </div>
            </div>
            {comments == undefined || (comments && comments.length > 0) ? (
              <p className="mt-6 mb-3 font-semibold text-xl">Yorumlar</p>
            ) : null}
            <div>
              {comments && comments.length > 0
                ? comments.map((comment: CommentI) => {
                    return (
                      <div className="my-3">
                        <Comment
                          key={comment?.id}
                          comment={comment}
                          pid={post?.id}
                        />
                      </div>
                    );
                  })
                : null}
              {comments == undefined ? (
                <>
                  <div className="mt-3"></div>
                  <Comment comment={undefined} pid={post?.id} />
                  <div className="my-3"></div>
                  <Comment comment={undefined} pid={post?.id} />
                  <div className="my-3"></div>
                  <Comment comment={undefined} pid={post?.id} />
                </>
              ) : null}
            </div>
            {comments && comments.length == 0 ? (
              <h1 className="mt-3 font-semibold text-lg">
                Bu gönderiye yorum yapılmamış. 👽
              </h1>
            ) : null}
          </>
        ) : post === undefined ? (
          <Post post={undefined} />
        ) : (
          <div className="text-center mt-5 text-xl font-semibold">
            Gönderi bulunamadı. 🥲
          </div>
        )}
      </div>
    </>
  );
}

export default PostDetail;
