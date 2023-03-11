import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/context";
import Login from "./pages/Login/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import AuthProtect from "./pages/Protected/AuthProtect";

function App() {
  return (
    <div className="font-sans">
      <GoogleOAuthProvider clientId="796799461942-os8v3rqcun15nbre1icr48qleieoklk2.apps.googleusercontent.com">
        <AuthProvider>
          <Header />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<AuthProtect />}>
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
