import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default App;
