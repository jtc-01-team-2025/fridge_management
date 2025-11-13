import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItemFormPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container" style={{ borderColor: '#646cff', marginTop: '20px' }}>
      <h1>食材登録 / 編集フォーム</h1>
      <p>この画面で新しい食材の情報を入力できます。</p>
      
      <form style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">食材名:</label>
          <input id="name" type="text" style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="expiry">期限日:</label>
          <input id="expiry" type="date" style={{ marginLeft: '10px', padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }} />
        </div>
        <button type="submit" className="action-button primary" style={{ width: '100%' }}>登録する</button>
      </form>

      <button onClick={() => navigate('/')} style={{ marginTop: '20px' }} className="action-button secondary">
        ホーム画面に戻る
      </button>
    </div>
  );
};

export default ItemFormPage;