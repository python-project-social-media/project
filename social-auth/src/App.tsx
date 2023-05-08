import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/context";
import Login from "./pages/Login/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import AuthProtect from "./pages/Protected/AuthProtect";
import Footer from "./components/Footer/Footer";
import HomeLoggedIn from "./pages/HomeLoggedIn/HomeLoggedIn";
import BestOfWeek from "./pages/BestOfWeek/BestOfWeek";
import Sidebar from "./components/Sidebar/Sidebar";
import LoggedIn from "./pages/Protected/LoggedIn";
import Register from "./pages/Register/Register";
import PostDetail from "./pages/PostDetail/PostDetail";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddPost from "./pages/AddPost/AddPost";
import Posts from "./pages/Posts/Posts";
import Profile from "./pages/Profile/Profile";
import News from "./pages/News/News";
import NewsDetail from "./pages/NewsDetail/NewsDetail";
import AddNews from "./pages/AddNews/AddNews";
import Admin from "./pages/Protected/Admin";
import SearchPage from "./pages/SearchPage/SearchPage";
import NotFound from "./pages/NotFound/NotFound";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import UpdatePost from "./pages/UpdatePost/UpdatePost";
import UpdateNews from "./pages/UpdateNews/UpdateNews";

function App() {
  return (
    <div className="font-sans">
      <GoogleOAuthProvider clientId="796799461942-os8v3rqcun15nbre1icr48qleieoklk2.apps.googleusercontent.com">
        <Router>
          <AuthProvider>
            <Sidebar />
            <Header />
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            <Routes>
              <Route path="/home" element={<HomeLoggedIn />} />
              <Route path="/best-of-the-week" element={<BestOfWeek />} />
              <Route path="/post/:id" element={<PostDetail />} />
              <Route path="/post/all" element={<Posts />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/search/:search" element={<SearchPage />} />
              <Route element={<LoggedIn />}>
                <Route path="/post/:id/update" element={<UpdatePost />} />
                <Route path="/post/add" element={<AddPost />} />
              </Route>
              <Route element={<Admin />}>
                <Route path="/news/:id/update" element={<UpdateNews />} />
                <Route path="/news/add" element={<AddNews />} />
              </Route>
              <Route element={<AuthProtect />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
