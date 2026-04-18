import { useState } from "react";
import "../styles/PopUp.css";
import { API_BASE_URL, categories, locations } from "../constants";
import type { FoodTypeNew } from "../types/FoodType";

const EditPopUP = ({
  inventory,
  closePopup,
}: {
  inventory: FoodTypeNew;
  closePopup: () => void;
}) => {
  const [itemName, setItemName] = useState(inventory.name);
  const [date, setDate] = useState<Date>(new Date(inventory.date_expiration));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(inventory.quantity);

  const handleUpdateItem = () => async (id: number, quantity: number) => {
    try {
      await fetch(`${API_BASE_URL}/items/${id}/consume/?consume_item=${quantity}`, {
        method: "PUT",
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && date && quantity > 0) {
      setIsLoading(true);
      setError(null);
      try {
        await handleUpdateItem()(inventory.id, quantity);
        closePopup();
      } catch (err) {
        console.error("更新エラー:", err);
        setError("食材の更新中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("正しい情報を入力してください。");
    }
  };

  return (
    <div className="container">
      <h1 className="popo-header">食材を編集</h1>
      <p>食材の情報を更新します</p>

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
            食材名
          </label>
          <input
            id="itemName"
            type="text"
            value={inventory.name}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="例: 豆腐"
            required
            disabled={true}
            className="popup-input"
          />
        </div>
        <div className="popup-field">
          <label htmlFor="itemName" className="popup-label">
            カテゴリー
          </label>
          <select
            id="category"
            // required
            disabled={true}
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
              // value={inventory.quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              max={inventory.quantity}
              required
              disabled={isLoading}
              className="popup-input"
            />
          </div>
          <div className="popup-field">
            <label className="popup-label">単位</label>
            <input
              type="text"
              defaultValue="個"
              // onChange={(e) => setText(e.target.value)}
              required
              disabled={true}
              className="popup-input"
            />
          </div>
        </div>
        <div className="popup-field">
          <label htmlFor="days" className="popup-label">
            賞味期限
          </label>
          <input
            id="days"
            type="date"
            value={inventory.date_expiration || ""}
            onChange={(e) => setDate(new Date(e.target.value))}
            required
            disabled={true}
            className="popup-input"
          />
        </div>
        <div className="popup-field">
          <label htmlFor="location" className="popup-label">
            保存場所
          </label>
          <select
            id="location"
            disabled={true}
            className="popup-input"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="popup-submit-button"
          disabled={isLoading || !itemName.trim() || !date || quantity <= 0}
        >
          {isLoading ? "更新中..." : "更新"}
        </button>
      </form>
    </div>
  );
};

export default EditPopUP;
