import { LogIn } from "lucide-react";
import "../styles/Homepage.css";
import { useNavigate } from "react-router-dom";
const Header = ({ title, userId }: { title: string; userId: string }) => {
  const navigate = useNavigate();
  return (
    <>
      <header className="home-mobile-header">
        <div className="home-mobile-header-inner">
          <h1 className="home-mobile-title">{title}</h1>
          {userId ? (
            <span className="home-mobile-user">ID: {userId}</span>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="home-mobile-login-button"
            >
              <LogIn className="home-mobile-login-icon" />
              ログイン
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
