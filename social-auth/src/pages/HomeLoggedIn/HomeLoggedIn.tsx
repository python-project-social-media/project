import { Link } from "react-router-dom";
import NewsSingle from "../../components/NewsSingle/NewsSingle";
import Post from "../../components/Post/Post";

function HomeLoggedIn() {
  return (
    <div className="lg:px-10 h-screen px-6 mt-5">
      <div className="flex justify-evenly gap-6 items-start">
        <div className="flex flex-1 flex-col gap-4">
          <h3 className="font-semibold text-xl mb-1 mt-5">
            <span className="en">Size</span>
            <span className="en-rest ml-[0.3rem]">önerilen gönderiler</span>
          </h3>
          <div className="flex-1">
            <Post post={undefined} />
          </div>
          <div className="flex-1">
            <Post post={undefined} />
          </div>
          <div className="flex-1">
            <Post post={undefined} />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-1 flex-col gap-4">
            <h3 className="font-semibold text-xl mb-1 mt-5">
              <span className="en">Size</span>
              <span className="en-rest ml-[0.3rem]">önerilen haberler</span>
            </h3>
            <NewsSingle news={undefined} />
            <NewsSingle news={undefined} />
            <NewsSingle news={undefined} />
            <Link
              to={"/news"}
              className="text-green-500/75 text-right font-medium"
            >
              Daha fazla...
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeLoggedIn;
