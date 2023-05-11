import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/context";
import Post from "../../components/Post/Post";
import { AiOutlineSearch } from "react-icons/ai";
import "./BestOfWeek.css";
import { Post as PostI } from "../../interfaces/Post";
import { Search as SearchI } from "../../interfaces/Filter";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

function BestOfWeek() {
  const [mostLiked, setMostLiked] = useState<PostI>();
  const [mostCommented, setMostCommented] = useState<PostI>();
  const [mostSearched, setMostSearched] = useState<SearchI>();
  useEffect(() => {
    if (localStorage.getItem("key")) {
      fetch("http://127.0.0.1:8000/api/post/most-commented", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Token " + localStorage.getItem("key"),
        },
      }).then(async (resp: Response) => {
        let data = await resp.json();
        if (data.data) {
          setMostCommented(data.data[0]);
        }
      });
      fetch("http://127.0.0.1:8000/api/post/most-liked", {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Token " + localStorage.getItem("key"),
        },
      }).then(async (resp: Response) => {
        let data = await resp.json();
        if (data.data) {
          setMostLiked(data.data[0]);
        }
      });
    } else {
      fetch("http://127.0.0.1:8000/api/post/most-commented", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }).then(async (resp: Response) => {
        let data = await resp.json();
        if (data.data) {
          setMostCommented(data.data[0]);
        }
      });
      fetch("http://127.0.0.1:8000/api/post/most-liked", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }).then(async (resp: Response) => {
        let data = await resp.json();
        if (data.data) {
          setMostLiked(data.data[0]);
        }
      });
    }
    fetch("http://127.0.0.1:8000/api/most-searched", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      setMostSearched(data);
    });
  }, []);
  return (
    <div className="lg:px-16 px-8">
      <Helmet>
        <title>Haftanın En İyileri • SportCom</title>
      </Helmet>
      <div>
        <h3 className="font-semibold text-lg mb-1 mt-5">
          <span className="en">En</span>
          <span className="en-rest ml-[0.3rem]">çok beğenilen gönderi</span>
        </h3>
        <div className="max-w-[400px]">
          <Post post={mostLiked} key={mostLiked?.id} />
        </div>
      </div>
      <div className="flex justify-end flex-1">
        <div className="max-w-[300x]">
          <h3 className="font-semibold text-lg mb-1 mt-5">
            <span className="en">En</span>
            <span className="en-rest ml-[0.3rem]">çok yorum alan gönderi</span>
          </h3>
          <div className="min-w-[200px] max-w-[500px]">
            <Post post={mostCommented} key={mostCommented?.id} />
          </div>
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1 mt-5">
          <span className="en">En</span>
          <span className="en-rest ml-[0.3rem]">çok aranan filtre</span>
        </h3>
        <Link
          to={`/search/${mostSearched?.text}`}
          className="bg-[#F6F6F6] text-lg block shadow-md rounded-md w-fit p-2"
        >
          <div className="flex gap-3 items-center">
            <span>{mostSearched?.text}</span>
            <div className="ml-auto flex items-center gap-4">
              <span>{mostSearched?.count}</span>
              <AiOutlineSearch size={20} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default BestOfWeek;
