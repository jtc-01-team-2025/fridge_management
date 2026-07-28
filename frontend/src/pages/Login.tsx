import React, { useState } from "react";
import "../styles/Login.css";
import { ChevronLeft, Refrigerator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { supabase } from "../lib/supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.session) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supabase_session: {
            access_token: data.session.access_token,
            token_type: data.session.token_type,
            expires_in: data.session.expires_in,
            expires_at: data.session.expires_at,
            refresh_token: data.session.refresh_token,
            user: data.session.user,
          },
        }),
      });

      if (!res.ok) {
        setIsLoading(false);
        return;
      }

      const ttlMs = 5 * 60 * 60 * 1000;
      localStorage.setItem(
        "app_user_session",
        JSON.stringify({ userId: data.session.user.id, expiresAt: Date.now() + ttlMs })
      );

      setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 900);
    } catch {
      setIsLoading(false);
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
