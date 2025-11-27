// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const InventoryListPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="home-container" style={{ borderColor: '#ffae00', marginTop: '20px' }}>
//       <h1>全食材リスト (Inventory)</h1>
//       <p>ここでは全ての在庫を一覧で確認・管理できます。</p>
      
//       <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
//           <li>牛乳 (2025/1/15)</li>
//           <li>卵 (2024/12/30)</li>
//           <li>リンゴ (期限切れ！)</li>
//       </ul>

//       <button onClick={() => navigate('/')} className="action-button primary" style={{ marginTop: '20px' }}>
//         ホーム画面に戻る
//       </button>
//     </div>
//   );
// };

// export default InventoryListPage;

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../Client'; // API_BASE_URLをclient.tsからインポート
import '../App.css'; 

// 🎯 APIエンドポイントの設定: ベースURLに '/items' を追加
const ITEMS_API_URL = `${API_BASE_URL}/items`; 

// 現在の日付を ISO形式 'YYYY-MM-DD' で取得するヘルパー関数
const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
};

interface ItemFormState {
    id: string; 
    registrationDate: string;
    name: string;
    expiryDate: string;
    quantity: number;
    category: string;
}

function ItemAddPage() {
  // 1. 一意のIDを生成 (クライアント側での一時的な識別用)
  const uniqueId = useMemo(() => Date.now().toString(), []);

  const [item, setItem] = useState<ItemFormState>({
    id: uniqueId,
    registrationDate: getTodayDate(),
    name: '',
    expiryDate: '',
    quantity: 1,
    category: '野菜',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false); // 2. 送信中の状態
  const navigate = useNavigate();

  // フォーム入力ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setItem(prevItem => ({
      ...prevItem,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };
  
  // 3. 非同期の登録処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // 二重送信防止

    // 💡 DBが期待する形式にデータを整形 (DB側でIDを生成する場合は item.id を除外)
    const dataToSend = {
        name: item.name,
        registered_on: item.registrationDate, 
        expiry_date: item.expiryDate,         
        quantity: item.quantity,
        category: item.category,
    };

    setIsSubmitting(true);

    try {
      const response = await axios.post(ITEMS_API_URL, dataToSend);

      // 登録成功
      console.log('登録成功:', response.data);
      alert(`${item.name} をDBに登録しました！`);
      
      navigate('/');
      
    } catch (error) {
      // 登録失敗
      console.error('登録エラーが発生しました:', error);
      
      let errorMessage = '食材の登録に失敗しました。';
      if (axios.isAxiosError(error) && error.response) {
          errorMessage += ` (Status: ${error.response.status} - ${error.response.data.message || 'サーバーエラー'})`;
      } else {
          errorMessage += ' ネットワーク接続を確認してください。';
      }
      alert(errorMessage);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-container">
      <h1>食材の新規登録</h1>

      <button 
        className="action-button secondary" 
        onClick={() => navigate('/')} 
        style={{ marginBottom: '20px' }}
      >
        &larr; ホームに戻る
      </button>

      <form onSubmit={handleSubmit} className="form-panel">
        
        {/* 番号 (ID) - 自動で一意に設定 */}
        <div className="form-group readonly">
            <label>番号 (ID):</label>
            <p className="readonly-value">{item.id}</p>
        </div>
        
        {/* 登録日 - カレンダーで変更可能 */}
        <div className="form-group">
            <label htmlFor="registrationDate">登録日:</label>
            <input
                type="date"
                id="registrationDate"
                name="registrationDate"
                value={item.registrationDate}
                onChange={handleChange}
                required
            />
        </div>

        {/* 食材名 - 必須入力 */}
        <div className="form-group">
          <label htmlFor="name">食材名:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={item.name}
            onChange={handleChange}
            placeholder="例: 牛肉、にんじん"
            required
          />
        </div>

        {/* 消費期限 - カレンダーから選択 */}
        <div className="form-group">
          <label htmlFor="expiryDate">消費期限:</label>
          <input
            type="date"
            id="expiryDate"
            name="expiryDate"
            value={item.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* 数量 */}
        <div className="form-group">
          <label htmlFor="quantity">数量:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={item.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        {/* カテゴリ */}
        <div className="form-group">
          <label htmlFor="category">カテゴリ:</label>
          <select
            id="category"
            name="category"
            value={item.category}
            onChange={handleChange}
            required
          >
            <option value="野菜">野菜</option>
            <option value="肉">肉</option>
            <option value="魚">魚</option>
            <option value="乳製品">乳製品</option>
            <option value="その他">その他</option>
          </select>
        </div>

        {/* 登録ボタン - 送信中は無効化 */}
        <button 
            type="submit" 
            className="action-button primary" 
            style={{ marginTop: '20px' }}
            disabled={isSubmitting} 
        >
          {isSubmitting ? '登録中...' : '食材を登録'}
        </button>
      </form>
    </div>
  );
}

export default ItemAddPage;