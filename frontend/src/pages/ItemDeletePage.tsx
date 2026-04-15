import { useState } from "react";
import { ExpirationStatus } from "../components/Expiration";
import type { FoodTypeNew } from "../types/FoodType";

export const ItemDeletePage = ({
  items,
  onBack,
  onDeleteItems,
}: {
  items: FoodTypeNew[];
  onBack: () => void;
  onDeleteItems: (ids: number[]) => Promise<void>;
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleSelect = (id: number) => {
    // 複数選択を許可する場合は以下を使用
    setSelectedItems((prev) =>
    prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;

    if (!window.confirm(`選択した ${selectedItems.length} 件を削除してもよろしいですか？`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDeleteItems(selectedItems);
      setSelectedItems([]);
      onBack();
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除中にエラーが発生しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    // 1. App.css の「home-container」で全体の枠線を統一
    <div className="home-container">
      <h1 style={{ textAlign: "center", color: "#333" }}>🗑️ 食材の削除</h1>

      <button
        onClick={onBack}
        className="action-button"
        style={{ marginBottom: "20px", padding: "8px 15px", fontSize: "0.9em" }}
      >
        &larr; ホームに戻る
      </button>

      {/* 2. リスト表示エリアを App.css の「item-list-panel」に準拠 */}
      <div
        className="item-list-panel"
        style={{ backgroundColor: "#fff5f5", borderColor: "#feb2b2" }}
      >
        <h3 style={{ color: "#c53030", marginBottom: "15px" }}>削除する食材を選択してください</h3>

        {items.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            冷蔵庫は空っぽです。
          </p>
        ) : (
          <ul style={{ maxHeight: "400px", overflowY: "auto" }}>
            {items.map((item) => {
              const isSelected = selectedItems.includes(item.id);
              return (
                <li
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#fff5f5" : "white",
                    border: isSelected ? "2px solid #f56565" : "1px solid #eee",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      {/* チェックボックス風の円 */}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          border: "2px solid",
                          borderColor: isSelected ? "#f56565" : "#ddd",
                          backgroundColor: isSelected ? "#f56565" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                        }}
                      >
                        {isSelected && "✓"}
                      </div>

                      <div>
                        <h4 style={{ margin: 0 }}>{item.name}</h4>
                        <p style={{ margin: 0, fontSize: "0.8em", color: "#666" }}>
                          期限: {item.date_expiration}
                        </p>
                      </div>
                    </div>
                    <ExpirationStatus date_expiration={item.date_expiration} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 3. 下部の操作エリア */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span style={{ fontWeight: "bold", color: "#666" }}>選択中: {selectedItems.length} 件</span>

        <button
          onClick={handleDelete}
          disabled={selectedItems.length === 0 || isDeleting}
          className="action-button primary"
          style={{
            backgroundColor: selectedItems.length > 0 ? "#e3342f" : "#ccc",
            borderColor: selectedItems.length > 0 ? "#cc1f1a" : "#bbb",
            padding: "12px 30px",
            minWidth: "150px",
          }}
        >
          {isDeleting ? "削除中..." : "選択した食材を削除"}
        </button>
      </div>
    </div>
  );
};
