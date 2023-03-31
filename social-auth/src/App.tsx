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

function App() {
  return (
    <div className="font-sans overflow-x-hidden">
      <div className="h-full sidebar absolute md:hidden block -right-full top-0 bg-[#F6F6F6] w-1/2 z-20 shadow-md duration-300">
        messi
      </div>
      <GoogleOAuthProvider clientId="796799461942-os8v3rqcun15nbre1icr48qleieoklk2.apps.googleusercontent.com">
        <Router>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/home" element={<HomeLoggedIn />} />
              <Route path="/best-of-the-week" element={<BestOfWeek />} />
              <Route element={<AuthProtect />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
            <Footer />
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
