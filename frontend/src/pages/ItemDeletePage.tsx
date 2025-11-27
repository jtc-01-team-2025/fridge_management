import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../Client'; // API_BASE_URLをclient.tsからインポート
import '../App.css'; 

// 🎯 APIエンドポイントの設定
const ITEMS_API_URL = `${API_BASE_URL}/items`; 

// 食材データの型定義
interface InventoryItem {
    id: string; // 登録番号 (DBのユニークID)
    name: string;
    registrationDate: string;
    expiryDate: string;
}

function ItemDeletePage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 💡 登録済み食材リストの取得
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            // 実際には GET /api/items のようなエンドポイントにリクエスト
            const response = await axios.get(ITEMS_API_URL);
            
            // 取得したデータを InventoryItem 型に整形してセット
            // 🚨 ここはバックエンドのレスポンス構造に合わせて調整が必要です
            const formattedItems: InventoryItem[] = response.data.map((item: any) => ({
                id: item.id.toString(),
                name: item.name,
                registrationDate: item.registered_on || 'N/A', // DBのカラム名に合わせる
                expiryDate: item.expiry_date, // DBのカラム名に合わせる
            }));

            setItems(formattedItems);
        } catch (error) {
            console.error('食材リストの取得に失敗しました:', error);
            alert('食材リストの読み込み中にエラーが発生しました。');
        } finally {
            setIsLoading(false);
        }
    };

    // 💡 食材の削除処理
    const handleDelete = async (itemId: string, itemName: string) => {
        // ポップアップ表示
        if (!window.confirm(`本当に食材「${itemName} (ID: ${itemId})」を削除してもよろしいですか？`)) {
            return;
        }

        try {
            // 実際には DELETE /api/items/{id} のようなエンドポイントにリクエスト
            await axios.delete(`${ITEMS_API_URL}/${itemId}`);
            
            alert(`${itemName} のデータを削除しました。`);
            
            // 削除成功後、リストを再取得またはローカルで更新
            setItems(prevItems => prevItems.filter(item => item.id !== itemId));
            
        } catch (error) {
            console.error('削除処理に失敗しました:', error);
            alert(`削除に失敗しました。サーバーを確認してください。`);
        }
    };

    return (
        <div className="home-container" style={{ maxWidth: '900px', margin: 'auto' }}>
            <h1>食材の削除</h1>

            {/* ホームへ戻るボタン */}
            <button 
                className="action-button secondary" 
                onClick={() => navigate('/')} 
                style={{ marginBottom: '20px' }}
            >
                &larr; ホームに戻る
            </button>

            <div className="item-list-panel" style={{ width: '100%', maxHeight: '60vh', overflowY: 'auto', padding: '0' }}>
                <h3>登録食材一覧</h3>
                
                {isLoading ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>データを読み込み中...</p>
                ) : items.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '20px' }}>登録されている食材がありません。</p>
                ) : (
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>削除</th>
                                <th>登録番号</th>
                                <th>食材名</th>
                                <th>登録日</th>
                                <th>賞味期限</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <button 
                                            className="action-button small delete"
                                            onClick={() => handleDelete(item.id, item.name)}
                                        >
                                            削除
                                        </button>
                                    </td>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.registrationDate}</td>
                                    <td>{item.expiryDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ItemDeletePage;