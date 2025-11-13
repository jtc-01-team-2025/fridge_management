import React from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={{ borderColor: '#ffae00', marginTop: '20px' }}>
      <h1>全食材リスト (Inventory)</h1>
      <p>ここでは全ての在庫を一覧で確認・管理できます。</p>
      
      <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
          <li>牛乳 (2025/1/15)</li>
          <li>卵 (2024/12/30)</li>
          <li>リンゴ (期限切れ！)</li>
      </ul>

      <button onClick={() => navigate('/')} className="action-button primary" style={{ marginTop: '20px' }}>
        ホーム画面に戻る
      </button>
    </div>
  );
};

export default InventoryListPage;
