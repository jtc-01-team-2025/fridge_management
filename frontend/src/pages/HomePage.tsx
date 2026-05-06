import type { FoodTypeNew } from "../types/FoodType";
import "../styles/Homepage.css";
import Inventory from "../components/Inventory";
import Header from "../components/Header";


export const HomePage = ({
  items,
  urgentItems,
  userId,
}: {
  items: FoodTypeNew[];
  urgentItems: FoodTypeNew[];
  userId: string;
}) => (
  <div className="home-mobile">
    <Header title="在庫" userId={userId} />
    {/* Main Content */}
    <main className="home-mobile-main">
      <Inventory inventory={items} expiringItems={urgentItems} />
    </main>
  </div>
);
