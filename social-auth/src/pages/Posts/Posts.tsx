import { useContext, useEffect } from "react";
import { Post as PostI } from "../../interfaces/Post";
import Post from "../../components/Post/Post";
import AuthContext from "../../context/context";
import { Link } from "react-router-dom";

function Posts() {
  const { posts, getAllPosts }: any = useContext(AuthContext);
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="grid place-content-center my-5 without-header lg:px-16 px-4">
      <Link to={"/post/add"} key={1}>
        Gönderi Ekle
      </Link>
      {posts && posts.length > 0 ? (
        posts.map((post: PostI) => {
          return (
            <div className="my-3 w-full">
              <Post post={post} key={post.id} />
            </div>
          );
        })
      ) : posts == undefined ? (
        <div className="mesi">
          <div className="my-3">
            <Post post={undefined} />
          </div>
          <div className="my-3">
            <Post post={undefined} />
          </div>
          <div className="my-3">
            <Post post={undefined} />
          </div>
        </div>
      ) : (
        <h3 className="font-semibold text-xl">Gönderi yok. 😢</h3>
      )}
    </div>
  );
}

export default Posts;
