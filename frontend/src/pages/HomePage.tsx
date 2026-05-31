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

    {/* <nav className="home-mobile-nav">
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
        {Object.keys(groupedItems).length === 0 && items.length === 0 ? (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              まだ食材が登録されていません。
            </p>
          ) : Object.keys(groupedItems).length > 0 ? (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} style={{ marginBottom: "30px" }}>
                <h4
                  style={{
                    color: "#38c172",
                    borderBottom: "2px solid #38c172",
                    paddingBottom: "5px",
                    marginBottom: "15px",
                    fontSize: "1.1em"
                  }}
                >
                  {category} ({categoryItems.length}件)
                </h4>

                <ul>
                  {categoryItems.map((item) => (
                    <li key={item.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>消費期限：{item.date_expiration}</p>
                          <p>残り: {item.quantity} 個</p>
                        </div>
                      </div>
                    </li>
                  ))}
                  </ul>
              </div>
            ))
          ) : (
            <ul>
              {items.map(item => (
                <li key={item.id}>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>消費期限：{item.date_expiration}</p>
                    <p>残り: {item.quantity} 個</p>
                  </div>

                  {getStatusComponent({
                    date_expiration: item.date_expiration
                  })}
                </li>
              ))}
            </ul>
          )}
            </div> */}
  </div>
);
