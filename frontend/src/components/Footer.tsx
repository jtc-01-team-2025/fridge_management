import { ChefHat, MessageCircle, Refrigerator, ShoppingCart, User } from "lucide-react";
import "../styles/Homepage.css";
const Footer: React.FC = () => {
  const navItems = [
    { path: "/", label: "在庫", icon: Refrigerator },
    { path: "/shopping", label: "買い物", icon: ShoppingCart },
    { path: "/recipes", label: "レシピ", icon: ChefHat },
    { path: "/chat", label: "相談", icon: MessageCircle },
    { path: "/profile", label: "設定", icon: User },
  ];

  const normalizePath = (path: string): string => (path.startsWith("/") ? path : `/${path}`);

  const navigate = (path: string): void => {
    const target = normalizePath(path);
    window.location.href = target;
  };
  return (
    <>
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          marginTop: "40px",
          color: "#888",
          borderTop: "1px solid #eee",
        }}
      >
        <p>© 2026 Frige Manager App</p>
      </footer>
      <nav className="home-mobile-nav">
      <div className="home-mobile-nav-inner">
        <div className="home-mobile-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = window.location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={isActive ? "home-mobile-nav-item active" : "home-mobile-nav-item"}
              >
                <Icon
                  className={isActive ? "home-mobile-nav-icon active" : "home-mobile-nav-icon"}
                />{" "}
                <span className="home-mobile-nav-label">{item.label}</span>{" "}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
    </>
  );
};

export default Footer;
