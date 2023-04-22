import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
const AuthContext = createContext({});
import { useNavigate } from "react-router-dom";
import { Comment as CommentI } from "../interfaces/Comment";
import { toast } from "react-toastify";
import { Post as PostI } from "../interfaces/Post";
import { useLocation } from "react-router-dom";

export default AuthContext;

export const AuthProvider = ({ children }: any) => {
  const [profile, setProfile] = useState();
  const [googleDataState, setGoogleDataState] = useState();
  const [key, setKey] = useState<string>();
  const [post, setPost] = useState<PostI | undefined | null>(null);
  const [posts, setPosts] = useState<PostI[]>();
  const [comments, setComments] = useState<CommentI[] | undefined>(undefined);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (localStorage.getItem("key")) {
      getUserByKeyGoogle(localStorage.getItem("key")!, googleDataState);
    } else if (localStorage.getItem("nkey")) {
      getUserByKey(localStorage.getItem("nkey")!);
    }
  }, [key]);

  const getProfile = async (id: number) => {
    let response = await fetch(`http://localhost:8000/api/profile/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      setProfile(data["data"]);
    });
  };

  const GoogleGetProfile = async (id: number, googleData: any) => {
    let postData: {} = {
      user: id,
      profilePhotoUrl: googleData?.picture,
    };
    await fetch(`http://localhost:8000/api/profile/${id}/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    }).then(async (resp: Response) => {
      let data = await resp.json();
      setProfile(data["data"]);
    });
  };

  const getUserByKeyGoogle = async (key: string, googleData: any) => {
    await fetch("http://127.0.0.1:8000/api/auth/user/", {
      method: "GET",
      headers: {
        Authorization: "Token " + key,
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      GoogleGetProfile(data["pk"], googleData);
    });
  };

  const isPostDetail = (path: string) => {
    let arr: string[] = path.split("/");
    if (arr.length == 3 && arr[2].match(/^-?\d+$/)) {
      return true;
    }
    return false;
  };

  const getUserByKey = async (key: string) => {
    await fetch("http://127.0.0.1:8000/api/auth/user/", {
      method: "GET",
      headers: {
        Authorization: "Token " + key,
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      getProfile(data["pk"]);
    });
  };

  const addProfile = async (data: any) => {
    await fetch("http://localhost:8000/api/profile/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (resp: Response) => {
      let data = await resp.json();
      if (data["msg_en"] == "Profile already exists. 😥") {
        return;
      }
      setProfile(data["data"]);
    });
  };

  const getComments = async (post_id: number) => {
    await fetch(`http://127.0.0.1:8000/api/post/${post_id}/comments`, {
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

  const deleteComment = async (cid: string, pid: number) => {
    await fetch(`http://127.0.0.1:8000/api/answer/${cid}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("key"),
      },
    }).then(async (resp: Response) => {
      if (resp.status === 200) {
        let data: any = await resp.json();
        getComments(pid).then(() => {
          GetPost(pid);
          toast.success(data.msg_tr);
        });
      }
    });
  };

  const responseGoogle = async (tokens: {}) => {
    await fetch("http://localhost:8000/api/rest-auth/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: tokens.credential,
      }),
    }).then(async (resp: Response) => {
      if (resp.status == 200) {
        let googleData: any = await jwt_decode(tokens.credential);
        setGoogleDataState(googleData);
        let data: any = await resp.json();
        setKey(data["key"]);
        localStorage.setItem("key", data["key"]);
        toast.success("Başarıyla giriş yapıldı. 🫡");
      }
    });
  };

  const login = async (username: string, password: string) => {
    await fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    }).then(async (resp: Response) => {
      if (resp.status == 200) {
        let data: any = await resp.json();
        setKey(data["key"]);
        localStorage.setItem("key", data["key"]);
        toast.success("Başarıyla giriş yapıldı. 🫡");
      }
    });
  };

  const register = async (
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    passworda: string
  ) => {
    await fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        first_name: first_name,
        last_name: last_name,
        password1: password,
        password2: passworda,
      }),
    }).then(async (resp: Response) => {
      if (resp.status == 200) {
        let data: any = await resp.json();
        navigate("/login");
        toast.success("Başarıyla kayıt olundu. 👾");
      }
    });
  };

  const getAllPosts = async () => {
    await fetch("http://127.0.0.1:8000/api/post/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("key"),
      },
    }).then(async (response: Response) => {
      if (response.status == 200) {
        let data: { data: PostI[] } = await response.json();
        setPosts(data.data);
      }
    });
  };

  const deletePost = async (pid: number) => {
    await fetch(`http://127.0.0.1:8000/api/post/${pid}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + localStorage.getItem("key"),
      },
    }).then(async (response: Response) => {
      if (response.status === 200) {
        let data = await response.json();
        if (pathname == "/post/all") {
          getAllPosts().then(() => {
            toast.success(data.msg_tr);
          });
        } else {
          toast.success(data.msg_tr);
        }
        navigate("/post/all");
      }
    });
  };

  const logout = async () => {
    await fetch("http://127.0.0.1:8000/api/auth/logout/", {
      method: "POST",
      headers: {
        Authorization: "Token " + localStorage.getItem("key"),
      },
    }).then(() => {
      setKey(undefined);
      setProfile(undefined);
      localStorage.removeItem("key");
      localStorage.removeItem("nkey");
      localStorage.removeItem("profile");
      navigate("/");
      toast.success("Başarıyla çıkış yapıldı. 😇");
    });
  };

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar?.classList.toggle("-right-full");
    sidebar?.classList.toggle("right-0");
  };

  const GetPost = async (pid: number) => {
    await fetch(`http://127.0.0.1:8000/api/post/${pid}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    }).then(async (resp: Response) => {
      let data = await resp.json();
      if (resp.status == 200) {
        if (data.data) {
          setPost(data.data);
        }
      } else if (resp.status == 400) {
        setPost(null);
      }
    });
  };

  let contextData = {
    profile: profile,
    comments: comments,
    post: post,
    posts: posts,
    responseGoogle: responseGoogle,
    addProfile: addProfile,
    logout: logout,
    login: login,
    getAllPosts: getAllPosts,
    register: register,
    toggleSidebar: toggleSidebar,
    deletePost: deletePost,
    getComments: getComments,
    GetPost: GetPost,
    deleteComment: deleteComment,
    isPostDetail: isPostDetail,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
