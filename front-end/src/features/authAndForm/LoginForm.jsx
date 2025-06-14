import { useState } from "react";
import "./LoginForm.css";
import { login, signup } from "./authService";

import person_icon from "../../assets/person-icon.png"
import email_icon from "../../assets/email-icon.png"
import password_icon from "../../assets/password.png"

function LoginForm({ onSuccess }) {
  const [isSignup, setIsSignup] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, password, email } = e.target.elements;

    const payload = {
      username: username.value,
      password: password.value,
      ...(isSignup && { email: email.value }),
    };

    try {
      if (isSignup) {
        await signup(payload);
      } else {
        await login(payload);
      }

      onSuccess(payload.username);
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

    } catch (err) {
      setError(`Помилка: ${err.message}`);
    }
  };

return (
    <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__switch">
            <button type="button" onClick={() => setIsSignup(false)} className={!isSignup ? "submit_active" : "submit_unactive"}>
            Login</button>

            <button type="button" onClick={() => setIsSignup(true)} className={isSignup ? "submit_active" : "submit_unactive"}>
            Sign Up</button>
        </div>
    

        <div className="login__inputs">

            
            <div className={`input animated-email ${!isSignup ? "hidden" : ""}`}>
                <img src={email_icon} alt="" />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required={isSignup}
                    className="login__input"
                />
            </div>
            
            <div className="input">
                <img src={person_icon} alt="" />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    className="login__input"
                />
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    className="login__input"
                />
            </div>
        </div>

        <div className="remember_me">
          <span>Залишатися в системі?</span>
          
          <div className="divForCheckbox">
            <label className="checkbox-label">
              <input 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="custom-checkbox"></span>
            </label>
          </div>
          
        </div>



        {error && <div className="login__error">{error}</div>}


        <button type="submit" className="login__submit_button">
            {isSignup ? "Зареєструватися" : "Увійти"}
        </button>

    </form>
  );
}

export default LoginForm;
