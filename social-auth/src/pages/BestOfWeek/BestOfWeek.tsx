import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/context";
import Post from "../../components/Post/Post";
import "./BestOfWeek.css";
import PostI from "../../interfaces/Post";

function BestOfWeek() {
  const [mostLiked, setMostLiked] = useState<PostI>();
  const [mostCommented, setMostCommented] = useState<PostI>();
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
  }, []);
  return (
    <div className="lg:px-16 px-8">
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
          <div className="min-w-[400px]">
            <Post post={mostCommented} key={mostCommented?.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BestOfWeek;
