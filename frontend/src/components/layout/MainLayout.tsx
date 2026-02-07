import React from "react";
import { Outlet, Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
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
          <Link to="/" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/inventory" style={{ color: "white", textDecoration: "none" }}>
            Inventory
          </Link>
        </nav>
      </div>
    </header>
  );
};

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      {/* 共通のヘッダー */}
      <Header />

      <main className="main-page-content">
        {/*
          💡 ここに子ルート（HomePage, ItemFormPageなど）がレンダリングされます
        */}
        <Outlet />
      </main>

      {/* フッターなどが必要であればここに追加 */}
    </div>
  );
};

export default MainLayout;
