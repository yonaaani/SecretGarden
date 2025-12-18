import "./AuthPage.css";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="element">
      <div className="element-wrapper">
        <img className="vector" alt="Vector" src="/line.svg" />
        <img
          className="img"
          alt="Group"
          src="/logo.png"
          style={{ cursor: "pointer", zIndex: 9999 }}
          onClick={() => navigate("/")} // переходимо на головну сторінку
        />
         <div className="box">
         <div style={{ backgroundImage: "url(/rectangle-3.png)" }} className="group-image"/>

        <div className="div">
            <img
                src="/auth-flower.gif"
                alt="Not authenticated"
                className="auth-gif"
              />
            <p className="text-wrapper">Увійдіть або зареєструйтесь, щоб продовжити!</p>
            <div className="group-2">
              <p className="drop-your-bloom-her">

                <span className="span">УПС! СХ</span>

                <span className="text-wrapper-2">O</span>

                <span className="span">ЖЕ, ВИ ЩЕ НЕ УВ</span>

                <span className="text-wrapper-2">I</span>

                <span className="span">ЙШЛИ В СИСТ</span>

                <span className="text-wrapper-2">E</span>

                <span className="span">МУ</span>
        
              </p>
            </div>
            <img
                src="/sign-in-button.png"
                className="sign-in-button"
                onClick={() => navigate("/signin")}
              />
          </div>

        </div>
      </div>

    </div>
  );
};

export default AuthPage;
