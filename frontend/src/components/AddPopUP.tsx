import { useState } from "react";
import "../styles/PopUp.css";
import { API_BASE_URL, categories, locations } from "../constants";

const AddPopUP = ({ closePopup }: { closePopup: () => void }) => {
  const [itemName, setItemName] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddItem = () => async (name: string, date: Date, quantity: number) => {
    try {
      await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date_expiration: date.toISOString().split("T")[0], quantity }),
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
        await handleAddItem()(itemName.trim(), date, quantity);
        closePopup();
      } catch (err) {
        console.error("登録エラー:", err);
        setError("食材の登録中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("正しい情報を入力してください。");
    }
  };

  return (
    <div className="container">
      <h1 className="popo-header">食材を追加</h1>
      <p>新しい食材を冷蔵庫に追加</p>

      {/* <button
        // onClick={onBack}
        className="action-button"
        style={{ marginBottom: "20px", padding: "8px 15px", fontSize: "0.9em" }}
      >
        &larr; ホームに戻る
      </button> */}

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

      {/* 3. フォーム部分を App.css のパネル風に調整 */}
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
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="例: 豆腐"
            required
            disabled={isLoading}
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
            <label className="popup-label">単位</label>
            <input
              type="text"
              defaultValue="個"
              // onChange={(e) => setText(e.target.value)}
              required
              disabled={isLoading}
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
            value={date.toISOString().split("T")[0]}
            onChange={(e) => setDate(new Date(e.target.value))}
            required
            disabled={isLoading}
            className="popup-input"
          />
          {/* <input
            id="days"
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value) || 0)}
            min="1"
            required
            disabled={isLoading}
            className="popup-input"
          /> */}
        </div>
        <div className="popup-field">
          <label htmlFor="location" className="popup-label">
            保存場所
          </label>
          <select
            id="location"
            // required
            disabled={isLoading}
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
          // style={{ padding: "15px", fontSize: "1.1rem" }}
          disabled={isLoading || !itemName.trim() || !date || quantity <= 0}
        >
          {isLoading ? "登録中..." : "追加"}
        </button>
      </form>
    </div>
  );
};

export default AddPopUP;
