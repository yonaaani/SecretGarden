import "./SignUpPage.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const formData = new FormData();

  formData.append("Name", data.name);
  formData.append("Email", data.email);
  formData.append("Password", data.password);

  const response = await fetch("http://localhost:5000/api/User", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || result?.isSuccess === false) {
    throw new Error(result?.message || "Registration failed");
  }

  return result;
}

const handleSignUp = async () => {
  try {
    await registerUser({ name, email, password });

    // Переходимо на SignInPage і передаємо повідомлення через state
    navigate("/signin", { state: { message: "Користувача успішно зареєстровано!" } });
  } catch (err: any) {
    // Помилку можна показати тут же на SignUpPage
    toast.error(err.message || "Registration failed", {
      position: "top-right",
      autoClose: 3000,
      style: { zIndex: 99999 },
    });
  }
};





  return (
    <div className="signup-layout">

      {/* Ліва частина: контент */}
      <div className="signup-left">
        {/* Лого зверху */}
        <img
          src="/logo.png"
          alt="Logo"
          className="signup-left-logo"
          onClick={() => navigate("/")}
        />

        <h1 className="signup-title">Sign Up</h1>

        {/* Name input */}
        <div className="input-group">
          <img src="/name-icon.png" alt="Name" className="input-icon" />
          <span className="input-label">Name</span>
          <input type="text" placeholder="Enter your name" className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Email input */}
        <div className="input-group">
          <img src="/email-icon.png" alt="Email" className="input-icon" />
          <span className="input-label">Email</span>
          <input type="email" placeholder="Enter your email" className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
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

        {/* Sign Up button */}
        <img
          src="/sign-up-mini.png"
          alt="Sign Up"
          className="signup-button"
          onClick={handleSignUp}
        />
      </div>

      {/* Права частина: фон */}
      <div className="signup-right">
        <img
          src="/sign-up-bg.png"
          alt="Sign Up Background"
          className="signup-right-bg"
        />
      </div>

      <img
          src="/sign-in-mini.png"
          alt="Sign Up"
          className="signin-left-signin"
          onClick={() => navigate("/signin")}
        />

         <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 999999 }} // 🔥 дуже високий, щоб бути над усім
        />



    </div>
  );
};

export default SignUpPage;
