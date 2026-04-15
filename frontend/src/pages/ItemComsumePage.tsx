import { useState } from "react";
import { ExpirationStatus } from "../components/Expiration";
import type { FoodTypeNew } from "../types/FoodType";

export const ItemConsumePage = ({
  items,
  onBack,
  onConsumeItems,
}: {
  items: FoodTypeNew[];
  onBack: () => void;
  onConsumeItems: (id: number, quantity: number) => Promise<void>;
}) => {
  const [consumeMap, setConsumeMap] = useState<Record<number, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConsume = async (id: number) => {
    const quantity = consumeMap[id] || 1;

    if (!window.confirm(`${quantity} 個消費しますか？`)) {
      return;
    }

    setIsProcessing(true);
    try {
      await onConsumeItems(id, quantity);
    } catch (err) {
      console.error("消費エラー:", err);
      alert("消費処理中にエラーが発生しました。");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="home-container">
      <h1 style={{ textAlign: "center", color: "#333" }}>
        🍴 食材を消費
      </h1>

      <button
        onClick={onBack}
        className="action-button"
        style={{ marginBottom: "20px", padding: "8px 15px", fontSize: "0.9em" }}
      >
        &larr; ホームに戻る
      </button>

      <div className="item-list-panel">
        <h3 style={{ marginBottom: "15px" }}>消費する個数を入力してください</h3>

        {items.length === 0 ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            冷蔵庫は空っぽです。
          </p>
        ) : (
          <ul style={{ maxHeight: "400px", overflowY: "auto" }}>
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
                  <div>
                    <h4 style={{ margin: 0 }}>{item.name}</h4>

                    <p style={{ margin: 0, fontSize: "0.8em", color: "#666" }}>
                      期限: {item.date_expiration}
                    </p>

                    <p style={{ margin: 0, fontSize: "0.8em", color: "#444" }}>
                      残り: {item.quantity} 個
                    </p>
                  </div>

                  <ExpirationStatus date_expiration={item.date_expiration} />
                </div>

                {/* 消費入力エリア */}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={consumeMap[item.id] || 1}
                    onChange={(e) =>
                      setConsumeMap({
                        ...consumeMap,
                        [item.id]: Number(e.target.value),
                      })
                    }
                    style={{
                      width: "70px",
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                    }}
                  />

                  <button
                    className="action-button primary"
                    disabled={isProcessing}
                    onClick={() => handleConsume(item.id)}
                    style={{ padding: "8px 15px" }}
                  >
                    消費
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};