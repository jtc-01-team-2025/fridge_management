import React, { useState } from "react";
import "../styles/Login.css";
import { ChevronLeft, Refrigerator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);

    // ここでログイン処理を実装する
    if (email !== "" && password !== "") {
      const userId = `user-${Math.random().toString(36).substring(2, 11)}`;
      const ttlMs = 5 * 60 * 60 * 1000;
      localStorage.setItem(
        "app_user_session",
        JSON.stringify({ userId, expiresAt: Date.now() + ttlMs })
      );
      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 900);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginHero">
        <button type="button" onClick={() => navigate(-1)} className="loginBackButton">
          <ChevronLeft className="loginBackIcon" />
          戻る
        </button>
        <div className="login-circle login-circle-lg" />
        <div className="login-circle login-circle-md" />
        <div className="login-circle login-circle-sm" />

        <div className="loginBrand">
          <div className="loginBrandIconWrap">
            <Refrigerator className="loginBrandIcon" />
          </div>
          <div className="loginBrandText">
            <h1 className="loginBrandTitle">Fridge Management</h1>
            <p className="loginBrandSubtitle">スマート冷蔵庫管理</p>
          </div>
        </div>
      </div>
      <LoginForm formAction={handleSubmit} flag={isLoading} />
    </div>
  );
};

export default Login;
