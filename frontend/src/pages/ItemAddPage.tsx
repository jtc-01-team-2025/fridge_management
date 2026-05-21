import { useState } from "react";

// 食材カテゴリーの定義
const FOOD_CATEGORIES = [
  { id: 1, label: "野菜" },
  { id: 2, label: "果物" },
  { id: 3, label: "肉類" },
  { id: 4, label: "魚介類" },
  { id: 5, label: "乳製品" },
  { id: 6, label: "卵" },
  { id: 7, label: "調味料" },
  { id: 8, label: "飲料" },
  { id: 9, label: "その他" },
];

export const ItemAddPage = ({
  onBack,
  onAddItem,
}: {
  onBack: () => void;
  onAddItem: (name: string, days: number, quantity: number, category: number) => Promise<void>;
}) => {
  const [itemName, setItemName] = useState("");
  const [days, setDays] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState(9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && days > 0 && quantity > 0 && category) {
      setIsLoading(true);
      setError(null);
      try {
        await onAddItem(itemName.trim(), days, quantity, category);
        onBack();
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
    // 1. App.css の「home-container」を使用して緑の枠線を適用
    <div className="home-container" style={{ maxWidth: '500px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>➕ 食材の新規登録</h1>
      
      {/* 2. 戻るボタンも action-button スタイルに合わせる */}
      <button
        onClick={onBack}
        className="action-button"
        style={{ marginBottom: '20px', padding: '8px 15px', fontSize: '0.9em' }}
      >
        &larr; ホームに戻る
      </button>

      {error && (
        <div style={{ backgroundColor: '#ffe0e0', color: '#cc0000', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
          ⚠️ {error}
        </div>
      )}

      {/* 3. フォーム部分を App.css のパネル風に調整 */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="itemName" style={{ fontWeight: 'bold', color: '#555' }}>食材名</label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="例: 豆腐"
            required
            disabled={isLoading}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #38c172', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="days" style={{ fontWeight: 'bold', color: '#555' }}>期限 (今日から何日後)</label>
          <input
            id="days"
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value) || 0)}
            min="1"
            required
            disabled={isLoading}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #38c172', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="quantity" style={{ fontWeight: 'bold', color: '#555' }}>数量</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
            required
            disabled={isLoading}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #38c172', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="category" style={{ fontWeight: 'bold', color: '#555' }}>カテゴリー</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(parseInt(e.target.value, 10))}
            required
            disabled={isLoading}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #38c172', fontSize: '1rem' }}
          >
            {FOOD_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. 登録ボタンを action-button primary に統一 */}
        <button
          type="submit"
          className="action-button primary"
          style={{ padding: '15px', fontSize: '1.1rem' }}
          disabled={isLoading || !itemName.trim() || days <= 0 || quantity <= 0 || !category}
        >
          {isLoading ? "登録中..." : "冷蔵庫へ入れる"}
        </button>
      </form>
    </div>
  );
};