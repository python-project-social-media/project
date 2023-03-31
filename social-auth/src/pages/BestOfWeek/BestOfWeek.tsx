import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/context";
import Post from "../../components/Post/Post";
import "./BestOfWeek.css";

function BestOfWeek() {
  const [post, setPost] = useState({});
  const { MostLikedPost }: any = useContext(AuthContext);
  useEffect((): any => {
    fetch("http://127.0.0.1:8000/api/post/most-liked", {
      method: "GET",
      headers: {
        Authorization: "Token " + localStorage.getItem("key"),
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      console.log(data);
      setPost(data.data[0]);
    });
  }, []);
  return (
    <div className="lg:px-10 px-8">
      <h3 className="font-semibold text-lg mb-1 mt-5">
        <span className="en">En</span> çok beğenilen gönderi
      </h3>
      <Post post={post} />
    </div>
  );
}

export default BestOfWeek;
