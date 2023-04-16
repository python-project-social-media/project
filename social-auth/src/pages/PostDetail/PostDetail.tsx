import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { Post as PostI } from "../../interfaces/Post";
import { Comment as CommentI } from "../../interfaces/Comment";
import Comment from "../Comment/Comment";

function PostDetail() {
  const [post, setPost] = useState<PostI>();
  const [comments, setComments] = useState<CommentI[]>();
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
        console.table(data.data);
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
