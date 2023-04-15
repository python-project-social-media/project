import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { Post as PostI } from "../../interfaces/Post";
import { Comment as CommentI } from "../../interfaces/Comment";
import AuthContext from "../../context/context";

function PostDetail() {
  const [post, setPost] = useState<PostI>();
  const [comments, setComments] = useState<CommentI[]>();
  const params = useParams();

  const getComments = (post_id: string) => {
    let resp: Promise<Response | void> = fetch(
      `http://127.0.0.1:8000/api/post/${post_id}/comments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (resp: Response) => {
      if (resp.status == 200) {
        let data: any = await resp.json();
        setComments(data);
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
        getComments(data.data.id);
      }
    });
  }, []);

  return (
    <div className="px-4 lg:px-24 mt-10">
      <Post key={post?.id} post={post!} />
    </div>
  );
}

export default PostDetail;
