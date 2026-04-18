import type { FoodTypeNew } from "../types/FoodType";
import "../styles/Homepage.css";
import { Refrigerator, ShoppingCart, ChefHat, MessageCircle, User } from "lucide-react";
import Inventory from "../components/Inventory";

const navItems = [
  { path: "/", label: "在庫", icon: Refrigerator },
  { path: "/shopping", label: "買い物", icon: ShoppingCart },
  { path: "/recipes", label: "レシピ", icon: ChefHat },
  { path: "/chat", label: "相談", icon: MessageCircle },
  { path: "/profile", label: "設定", icon: User },
];

export const HomePage = ({
  items,
  urgentItems,
  navigate,
  userId,
}: {
  items: FoodTypeNew[];
  urgentItems: FoodTypeNew[];
  navigate: (path: string) => void;
  userId: string;
}) => (
  <div className="home-mobile">
    {/* Mobile Header */}
    <header className="home-mobile-header">
      <div className="home-mobile-header-inner">
        <h1 className="home-mobile-title">在庫</h1>
        <span className="home-mobile-user">ID: {userId}</span>
      </div>
    </header>

    {/* Main Content */}
    <main className="home-mobile-main">
      <Inventory inventory={items} expiringItems={urgentItems} />
    </main>

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
                // onClick={() => navigate(item.path)}
                onClick={() => navigate("home")}
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
  </div>
);
