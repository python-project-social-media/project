import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { Post as PostI } from "../../interfaces/Post";
import { Comment as CommentI } from "../../interfaces/Comment";
import Comment from "../Comment/Comment";
import { toast } from "react-toastify";

function PostDetail() {
  const [post, setPost] = useState<PostI>();
  const [comments, setComments] = useState<CommentI[]>();
  const [text, setText] = useState<string>();
  const params = useParams();

  const getComments = (post_id: string) => {
    fetch(`http://127.0.0.1:8000/api/post/${post_id}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (resp: Response) => {
      if (resp.status == 200) {
        let data: any = await resp.json();
        setComments(data.data);
      }
    });
  };

  const addComment = () => {
    fetch(`http://127.0.0.1:8000/api/post/${params?.id!}/answer`, {
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
        toast.success("Yorumunuz başarıyla kaydedildi. 🎉");
        getComments(params?.id!);
      }
    });
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/post/${params?.id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      if (resp.status == 200) {
        setPost(data.data);
        getComments(params?.id!);
      }
    });
  }, []);

  return (
    <>
      <div className="px-4 lg:px-24 mt-10">
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
        </div>
        {comments && comments.length > 0 ? (
          <p className="mt-6 mb-3 font-semibold text-xl">Yorumlar</p>
        ) : null}
        <div>
          {comments && comments.length > 0
            ? comments.map((comment) => {
                return (
                  <div className="my-3">
                    <Comment key={comment.id} comment={comment} />
                  </div>
                );
              })
            : null}
        </div>

        {comments && comments.length == 0 ? (
          <h1 className="mt-5 font-semibold text-lg">
            Bu gönderiye yorum yapılmamış. 👽
          </h1>
        ) : null}
      </div>
    </>
  );
}

export default PostDetail;
