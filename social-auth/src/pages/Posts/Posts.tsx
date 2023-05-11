import { useContext, useEffect } from "react";
import { Post as PostI } from "../../interfaces/Post";
import Post from "../../components/Post/Post";
import AuthContext from "../../context/context";
import { Link } from "react-router-dom";
import { BiMessageSquareAdd } from "react-icons/bi";
import { Helmet } from "react-helmet";

function Posts() {
  const { posts, getAllPosts, profile }: any = useContext(AuthContext);
  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="grid place-items-center my-5 without-header px-4">
      <Helmet>
        <title>Gönderiler • SportCom</title>
      </Helmet>
      <div className="lg:w-3/5 w-11/12">
        {profile ? (
          <Link
            to={"/post/add"}
            className="bg-gradient-to-br font-semibold flex items-center justify-between from-stone-100/50 to-stone-200/50 text-[#37902f] border border-stone-200 rounded-lg p-1"
          >
            Gönderi Ekle
            <BiMessageSquareAdd size={20} />
          </Link>
        ) : null}
        {posts && posts.length > 0 ? (
          posts.map((post: PostI) => {
            return (
              <div className="my-3 w-full">
                <Post post={post} key={post.id} />
              </div>
            );
          })
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
    </div>
  );
}

export default Posts;
