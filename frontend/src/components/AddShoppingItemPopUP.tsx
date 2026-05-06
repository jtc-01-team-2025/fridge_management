import { useState } from "react";
import "../styles/PopUp.css";
import { categories } from "../constants";
import { registerShoppingItem } from "../Client";
import type { FoodCategory, ShoppingItem } from "../types/FoodType";

const AddShoppingItemPopUP = ({
  closePopup,
  onCreated,
  user_id,
}: {
  closePopup: () => void;
  onCreated: (item: ShoppingItem) => void;
  user_id: string;
}) => {
  const [itemName, setItemName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState<FoodCategory>("その他");
  const [unit, setUnit] = useState("個");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && quantity > 0) {
      setIsLoading(true);
      setError(null);
      try {
        closePopup();
        const created = await registerShoppingItem({
          user_id,
          name: itemName,
          quantity,
          unit,
          category,
        });
        onCreated({
          ...created,
          id: created.id.toString(),
          category: created.category as ShoppingItem["category"],
        });
      } catch (err) {
        console.error("登録エラー:", err);
        setError("商品の登録中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("正しい情報を入力してください。");
    }
  };

  return (
    <div className="container">
      <h2 className="popo-header">買い物リストに追加</h2>
      <p>購入する商品を追加</p>

      {error && (
        <div
          style={{
            backgroundColor: "#ffe0e0",
            color: "#cc0000",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <div className="popup-field">
          <label htmlFor="itemName" className="popup-label">
            商品名
          </label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="例: 豆腐"
            required
            disabled={isLoading}
            className="popup-input"
          />
        </div>
        <div className="popup-field">
          <label htmlFor="category" className="popup-label">
            カテゴリー
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as FoodCategory)}
            required
            disabled={isLoading}
            className="popup-input"
          >
            <option value="" disabled>
              選択してください
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            alignItems: "end",
          }}
        >
          <div className="popup-field">
            <label htmlFor="quantity" className="popup-label">
              数量
            </label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              required
              disabled={isLoading}
              className="popup-input"
            />
          </div>
          <div className="popup-field">
            <label htmlFor="unit" className="popup-label">
              単位
            </label>
            <input
              id="unit"
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              disabled={isLoading}
              className="popup-input"
            />
          </div>
        </div>
        <button
          type="submit"
          className="popup-submit-button"
          disabled={isLoading || !itemName.trim() || quantity <= 0}
        >
          {isLoading ? "登録中..." : "追加"}
        </button>
      </form>
    </div>
  );
};

export default AddShoppingItemPopUP;
