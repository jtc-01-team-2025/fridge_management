import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'; // 1. useNavigate をインポート
import { fetchData, type ApiResponse } from "../Client"; 
import '../App.css'; // スタイルを適用

// 食材データの型定義（仮）
interface InventoryItem {
  name: string;
  expiry: string;
  isUrgent: boolean;
}

function HomePage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const navigate = useNavigate(); // 2. navigate 関数を取得

  // API 疎通確認ロジック
  useEffect(() => {
    fetchData()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  // 期限が近い食材のダミーデータ（実際のデータ取得ロジックは今後実装）
  const items: InventoryItem[] = [
    { name: 'リンゴ', expiry: '10/1', isUrgent: true },
    { name: 'バナナ', expiry: '10/31', isUrgent: true },
    { name: '豚肉', expiry: '12/20', isUrgent: false },
  ];
  
  return (
    <div className="home-container">
      <h1>ホーム画面</h1>
      
      {/* メインコンテンツエリア */}
      <div className="main-content">
        
        {/* 左側: 登録された商品のリスト */}
        <div className="item-list-panel">
          <h3>登録された商品のリスト (期限が迫ってくる順)</h3>
          <ul>
            {items.map((item, index) => (
              <li key={index} className={item.isUrgent ? 'urgent' : ''}>
                {item.name} <span className="expiry-date">({item.expiry})</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* 右側: 操作ボタン群 */}
        <div className="action-buttons-panel">
          
          {/* 💡 食材の登録へ (パス: /item/add へ遷移) */}
          <button 
            className="action-button primary"
            onClick={() => navigate('/item/add')}
          >
            食材の登録へ
          </button>
          
          {/* 💡 期限が近い、期限切れの食材 (パス: /inventory へ遷移) 
             ここではフィルタリング済みのリストとして InventoryListPage を再利用します */}
          <button 
            className="action-button secondary"
            onClick={() => navigate('/inventory')}
          >
            期限が近い、期限切れの食材 (リストへ)
          </button>

          {/* 食材の削除ボタン (今回は詳細な遷移先がないため仮の動作) */}
          <button className="action-button secondary">
            (食材の削除)
          </button>
        </div>
      </div>

      {/* API 疎通確認結果 (デバッグ用として下部に移動) */}
      <div style={{ marginTop: "30px", padding: "10px", backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <strong>API ステータス (デバッグ):</strong>
        {data ? <p>Response: {data.message}</p> : <p>Loading from API...</p>}
      </div>
    </div>
  );
}

export default HomePage;