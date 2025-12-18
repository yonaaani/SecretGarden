import "./SignInPage.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();

  useEffect(() => {
  if (location.state?.message) {
    toast.success(location.state.message, {
      autoClose: 3000,
      position: "top-right",
      style: { zIndex: 999999 },
    });
    // очищаємо стан, щоб toast не з’являвся знову при перезавантаженні
    window.history.replaceState({}, document.title);
  }
}, [location.state]);


const handleSignIn = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/User/Login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Email: email, Password: password }),
    });

    const result = await response.json();

    if (!response.ok || result?.isSuccess === false) {
      throw new Error(result?.message || "Login failed");
    }

    // ✅ Зберігаємо JWT токен
    localStorage.setItem("token", result.message);

    toast.success("Ви успішно увійшли!", {
      autoClose: 2000,
      style: { zIndex: 999999 },
      onClose: () => navigate("/profile"), // переходимо на профіль
    });
  } catch (err: any) {
    toast.error(err.message || "Login failed", {
      autoClose: 3000,
      style: { zIndex: 999999 },
    });
  }
};



  return (
    <div className="signin-layout">

      {/* Права частина: контент */}
      <div className="signin-right">
        <h1 className="signin-title">Sign In</h1>

        {/* Email input */}
        <div className="input-group">
          <img src="/email-icon.png" alt="Email" className="input-icon" />
          <span className="input-label">Email</span>
          <input type="email" placeholder="Enter your email" className="input-field" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
        </div>

        {/* Password input */}
       <div className="input-group">
        <img
          src={showPassword ? "/eye-open.png" : "/password-icon.png"}
          alt="Password"
          className="input-icon clickable-icon"
          onClick={() => setShowPassword(!showPassword)}
        />
        <span className="input-label">Password</span>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>


        {/* Forgot password */}
        <p className="forgot-password" onClick={() => console.log("Forgot password clicked")}>
          Forgot your password?
        </p>

        {/* Sign In button */}
        <img
          src="/sign-in-button.png"
          alt="Sign In"
          className="signin-button"
          onClick={handleSignIn}
        />
      </div>


      {/* Ліва частина: фон поверх правої */}
      <div className="signin-left">
        <img
          src="/sign-in-bg.png"
          alt="Sign In Background"
          className="signin-left-img"
        />

         <img
          src="/logo-beige.png"
          alt="Logo"
          className="signin-left-logo"
          onClick={() => navigate("/")}
        />

        <img
          src="/sign-up-button.png"
          alt="Sign Up"
          className="signin-left-signup"
          onClick={() => navigate("/signup")}
        />

       
        <ToastContainer style={{ zIndex: 999999 }} />

      </div>


    </div>
  );
};

export default SignInPage;
