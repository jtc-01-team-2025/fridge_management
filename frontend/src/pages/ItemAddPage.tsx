import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 外部から提供された FoodType をここで使用すると仮定します。
// 実際のプロジェクトでは、これを別のファイルから import します。
export interface FoodType {
  itemID: number; // アイテムの一意の識別子
  name: string; // アイテム名
  category: string; // カテゴリ（このフォームでは使用しないが、型定義に含める）
  date_purchase: string; // 登録日 (ISO 8601形式: YYYY-MM-DD)
  date_expiration: string; // 消費期限 (ISO 8601形式: YYYY-MM-DD)
}

// フォームの状態の型を定義
// フォームは登録日と消費期限を string で持つため、itemID や category は含めない
interface FormDataType {
  itemName: string;
  registeredDate: string;
  expiryDate: string;
}

// 今日の日付を YYYY-MM-DD 形式で取得するヘルパー関数
const getTodayDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// フォームの初期状態
const initialFormState: FormDataType = {
  itemName: '',
  registeredDate: getTodayDate(),
  expiryDate: '',
};

// 仮のAPIエンドポイント
const API_ENDPOINT = '/api/v1/inventory/items'; 

// コンポーネント本体
const ItemAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataType>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // エラーメッセージ表示用

  // フォーム入力変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError(null); // 入力変更時にエラーをリセット
  };

  // 登録ボタンクリックハンドラ（非同期処理）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // --- バリデーションチェック ---
    if (!formData.itemName || !formData.expiryDate) {
        setError('すべての項目を入力してください。');
        return;
    }
    
    // 消費期限が登録日より過去ではないかチェック
    if (formData.expiryDate < formData.registeredDate) {
        setError('消費期限は登録日よりも後の日付を設定してください。');
        return;
    }
    
    // DB側でIDが自動採番されない場合、暫定的なIDを生成
    // 実際は、API側で自動生成するのが最も安全です。
    const uniqueId: number = Date.now(); 

    // ★ 修正点: APIに送信するデータを FoodType の命名規則に合わせる
    const itemData: Omit<FoodType, 'category'> = {
        itemID: uniqueId, 
        name: formData.itemName,
        date_purchase: formData.registeredDate, // registeredDate -> date_purchase
        date_expiration: formData.expiryDate,   // expiryDate -> date_expiration
    };
    
    setIsSubmitting(true);
    setError(null);
    
    try {
        console.log("APIに送信するデータ:", itemData);

        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        if (response.ok) {
            alert(`${formData.itemName} の登録に成功しました！`);
            setFormData(initialFormState); 
        } else {
            const errorText = await response.text(); 
            throw new Error(`登録失敗 (${response.status}): ${errorText}`);
        }
    } catch (err) {
        console.error("登録処理中にエラーが発生しました:", err);
        setError(`食材の登録に失敗しました。\n詳細: ${err instanceof Error ? err.message : '不明なエラー'}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container" style={{ borderColor: '#ffae00', marginTop: '20px', padding: '20px' }}>
      <h1>🧺 食材の登録 (New Item Registration)</h1>
      <p>新しい食材の情報を入力し、登録してください。</p>
      
      {/* エラーメッセージの表示 */}
      {error && (
          <div style={errorStyle}>
              ⚠️ {error}
          </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* 食材名（ユーザー入力） */}
        <div style={formGroupStyle}>
          <label htmlFor="itemName" style={labelStyle}>食材名:</label>
          <input
            id="itemName"
            name="itemName"
            type="text"
            value={formData.itemName}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="例: 卵"
          />
        </div>

        {/* 登録日（自動設定かつカレンダーから変更可能） */}
        <div style={formGroupStyle}>
          <label htmlFor="registeredDate" style={labelStyle}>登録日:</label>
          <input
            id="registeredDate"
            name="registeredDate"
            type="date" 
            value={formData.registeredDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* 消費期限（カレンダー選択） */}
        <div style={formGroupStyle}>
          <label htmlFor="expiryDate" style={labelStyle}>消費期限:</label>
          <input
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        
        {/* 登録ボタン (送信中は無効化) */}
        <button 
          type="submit" 
          className="action-button primary" 
          style={{ marginTop: '10px' }}
          disabled={isSubmitting} 
        >
          {isSubmitting ? '登録中...' : '食材を登録する'}
        </button>
      </form>
      
      <button onClick={() => navigate('/')} className="action-button secondary" style={{ marginTop: '20px' }}>
        ホーム画面に戻る
      </button>
    </div>
  );
};

export default ItemAddPage;

// --- スタイルの定義 ---
const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const labelStyle: React.CSSProperties = {
  marginBottom: '5px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const errorStyle: React.CSSProperties = {
    padding: '10px',
    backgroundColor: '#ffe0e0', // 薄い赤
    color: '#cc0000', // 濃い赤
    border: '1px solid #cc0000',
    borderRadius: '5px',
    marginBottom: '15px',
    fontWeight: 'bold',
};



