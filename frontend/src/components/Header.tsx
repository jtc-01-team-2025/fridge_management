import type { Page } from "../types/FoodType";

const Header = ({
  navigate,
  // currentPage,
}: {
  navigate: (path: Page) => void;
  // currentPage: Page;
}) => {
  return (
    <>
      {/* <header className="w-full bg-indigo-700 shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
          <h2 className="text-2xl font-bold text-white tracking-wider">Fridge Manager</h2>
          <nav className="space-x-4">
            <button
              onClick={() => navigate("home")}
              className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "home" ? "border-b-2 border-white" : ""}`}
            >
              ホーム
            </button>
            <button
              onClick={() => navigate("add")}
              className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "add" ? "border-b-2 border-white" : ""}`}
            >
              登録
            </button>
            <button
              onClick={() => navigate("delete")}
              className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "delete" ? "border-b-2 border-white" : ""}`}
            >
              削除
            </button>
          </nav>
        </div>
      </header> */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          padding: "10px 30px",
          backgroundColor: "#38c172",
          color: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>冷蔵庫管理アプリ</h2>
          {/* ナビゲーションリンク */}
          <nav>
            <button
              onClick={() => navigate("home")}
              style={{
                marginRight: "20px",
                border: "none",
                padding: "0.5rem 1rem",
              }}
            >
              ホーム
            </button>
            <button
              onClick={() => navigate("add")}
              style={{
                marginRight: "20px",
                border: "none",
                padding: "0.5rem 1rem",
              }}
            >
              登録
            </button>
            <button
              onClick={() => navigate("delete")}
              style={{
                marginRight: "20px",
                border: "none",
                padding: "0.5rem 1rem",
              }}
            >
              削除
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
