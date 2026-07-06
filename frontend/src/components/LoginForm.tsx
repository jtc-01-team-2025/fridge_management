import React, { useState } from "react";
import "../styles/Login.css";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";

interface LoginFormProps {
  formAction: (email: string, password: string) => Promise<void>;
  flag: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ formAction, flag }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  return (
    <>
      <div className="loginContentWrap">
        <div className="loginCard">
          <h2 className="loginCardTitle">ログイン</h2>
          <p className="loginCardDescription">メールアドレスとパスワードを入力してください</p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await formAction(email, password);
              setEmail("");
              setPassword("");
            }}
            className="login-form"
          >
            <div className="login-field-group">
              <label className="login-label">メールアドレス</label>
              <div className={"login-input-shell " + (focused === "email" ? "is-focused" : "")}>
                <Mail className={"login-input-icon " + (focused === "email" ? "is-focused" : "")} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="example@email.com"
                  className="login-input"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="login-field-group">
              <label className="login-label">パスワード</label>
              <div className={"login-input-shell " + (focused === "password" ? "is-focused" : "")}>
                <Lock
                  className={"login-input-icon " + (focused === "password" ? "is-focused" : "")}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="••••••••"
                  className="login-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-password-toggle"
                >
                  {showPassword ? (
                    <EyeOff className="login-toggle-icon" />
                  ) : (
                    <Eye className="login-toggle-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="login-forgot-wrap">
              <button type="button" className="login-forgot-button">
                パスワードを忘れた方
              </button>
            </div>
            <button type="submit" disabled={flag} className="login-submit-button">
              {flag ? (
                <>
                  <span className="login-spinner" />
                  ログイン中...
                </>
              ) : (
                <>
                  ログイン
                  <ArrowRight className="login-submit-icon" />
                </>
              )}
            </button>
          </form>
          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">または</span>
            <div className="login-divider-line" />
          </div>

          <div className="login-social-list">
            <button type="button" className="login-social-button">
              <svg className="login-social-icon" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Googleでログイン
            </button>

            {/* <button type="button" className="login-social-button">
                    <svg className="login-social-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.56-1.32 3.1-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Appleでログイン
                  </button> */}
          </div>
          <p className="login-signup-text">
            アカウントをお持ちでない方は{" "}
            <button type="button" className="login-signup-button">
              新規登録
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
