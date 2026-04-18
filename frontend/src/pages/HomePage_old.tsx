import type { JSX } from "react";
import type { FoodTypeNew } from "../types/FoodType";

// APIのURL（デバッグ表示用）
const API_BASE_URL = "http://localhost:8000/api";

export const HomePage = ({
  items,
  urgentItems,
  togglePopup,
  navigate,
  getStatusComponent,
  userId,
}: {
  items: FoodTypeNew[];
  urgentItems: FoodTypeNew[];
  togglePopup: () => void;
  // navigate: (path: "home" | "add" | "delete" | "consume") => void;
  navigate: (path: string) => void;
  getStatusComponent: ({ date_expiration }: { date_expiration: string }) => JSX.Element;
  userId: string;
}) => (
  // 1. Tailwindのクラス(w-full max-w-4xl...)を削除し、App.cssの「home-container」に差し替え
  <div className="home-container">
    <h1 style={{ textAlign: "center", marginBottom: "30px" }}>🧊 冷蔵庫の在庫状況</h1>

    {/* セッションID表示 (控えめなデザインに変更) */}
    <div style={{ textAlign: "center", marginBottom: "20px", color: "#888", fontSize: "0.8em" }}>
      <span>ID: {userId}</span>
    </div>

    {/* 2. Flexレイアウトを App.css の「main-content」に差し替え */}
    <div className="main-content">
      {/* 操作ボタンパネル */}
      <div className="action-buttons-panel">
        <h3 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>アクション</h3>

        {/* 3. ボタンのクラスを App.css の「action-button primary」に統一 */}
        <button className="action-button primary" onClick={() => navigate("add")}>
          ➕ 食材の登録
        </button>

        <button className="action-button primary" onClick={() => navigate("consume")}>
          🗑️ 消費した食材の登録
        </button>

        <button
          className="action-button primary"
          onClick={togglePopup}
          /* 期限切れがある場合のみ赤色にする (インラインで指定) */
          style={
            urgentItems.length > 0 ? { backgroundColor: "#e3342f", borderColor: "#e3342f" } : {}
          }
        >
          ⚠️ 期限が近い食材 ({urgentItems.length}件)
        </button>

        <button className="action-button primary" onClick={() => navigate("delete")}>
          🗑️ 食材の削除
        </button>
      </div>

      {/* 登録された食材のリスト表示パネル */}
      <div className="item-list-panel">
        <h3>登録された食材リスト</h3>

        {items.length === 0 ? (
          <p style={{ color: "#999", fontStyle: "italic" }}>まだ食材が登録されていません。</p>
        ) : (
          <ul>
            {items.map((item) => (
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
                    <h4 style={{ margin: "0 0 5px 0" }}>{item.name}</h4>
                    <p style={{ margin: 0, fontSize: "0.9em", color: "#666" }}>
                      消費期限：{item.date_expiration}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.9em", color: "#444" }}>
                      残り: {item.quantity} 個
                    </p>
                  </div>
                  {getStatusComponent({ date_expiration: item.date_expiration })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* 下部のデバッグ情報は削除、またはシンプルに */}
    <div style={{ marginTop: "30px", fontSize: "12px", color: "#ccc", textAlign: "center" }}>
      Connected to API: {API_BASE_URL}
    </div>
  </div>
);
