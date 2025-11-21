

import React, { useState, useEffect, useCallback } from 'react';

// === 型定義 (TypeScript環境を想定) ===
/**
 * @typedef {Object} FoodItem
 * @property {number} id - アイテムID
 * @property {string} name - 食材名
 * @property {string} date_purchase - 登録日 (YYYY-MM-DD)
 * @property {string} date_expiration - 賞味期限 (YYYY-MM-DD)
 * 
 * export interface FoodType {
  itemitemID: number; // アイテムの一意の識別子
  name: string; // アイテム名
  category: string; // カテゴリ（例: 乳製品）
  date_purchase: string; // 購入日 (ISO 8601形式: YYYY-MM-DD)
  date_expiration: string; // 消費期限 (ISO 8601形式: YYYY-MM-DD)
}
 */

// === モックデータとAPIシミュレーション ===
// 最初のロード時に使用するダミーデータ
let currentItems = [
    { itemID: 101, name: '鶏むね肉', date_purchase: '2024-11-01', date_expiration: '2024-11-10' },
    { itemID: 102, name: '卵 (10個パック)', date_purchase: '2024-11-05', date_expiration: '2024-11-20' },
    { itemID: 103, name: 'キャベツ', date_purchase: '2024-11-15', date_expiration: '2024-11-25' },
    { itemID: 104, name: '牛乳', date_purchase: '2024-11-18', date_expiration: '2024-11-22' },
];

/**
 * 登録済み食材リストを取得するAPIをシミュレートします。
 * 実際にはここでバックエンドのGET APIを呼び出します。
 * @returns {Promise<FoodItem[]>}
 */
const mockFetchItems = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('API: 食材リスト取得完了 (モック)');
            // currentItemsのコピーを返す
            resolve([...currentItems]);
        }, 500);
    });
};

/**
 * 食材を削除するAPIをシミュレートします。
 * 実際にはここでバックエンドのDELETE/POST APIを呼び出します。
 * @param {number} itemID - 削除対象のアイテムID
 * @returns {Promise<void>}
 */
const mockDeleteItem = (itemID) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 例としてID 104だけ失敗をシミュレート
            if (itemID === 104) { 
                console.error(`API: 削除失敗 (ID: ${itemID}) (モック)`);
                reject(new Error("削除に失敗しました。ネットワークエラーかもしれません。"));
            } else {
                // 成功した場合、モックデータからアイテムを削除 (DB反映をシミュレート)
                currentItems = currentItems.filter(item => item.id !== itemID);
                console.log(`API: 食材削除成功 (ID: ${itemID}) (モック)`);
                resolve();
            }
        }, 800);
    });
};

// === ConfirmationModal (確認ポップアップ) コンポーネント ===
const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, isProcessing }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100 opacity-100">
                <p className="text-lg font-semibold text-gray-800 mb-6 text-center">{message}</p>
                <div className="flex justify-around space-x-4">
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                処理中...
                            </>
                        ) : 'はい'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        いいえ
                    </button>
                </div>
            </div>
        </div>
    );
};

// === ItemDeletePage コンポーネント ===
const ItemDeletePage = () => {
    /** @type {[FoodItem[], (items: FoodItem[]) => void]} */
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    /** @type {[number | null, (id: number | null) => void]} */
    const [itemToDeleteId, setItemToDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    // 初期データ取得 (コンポーネントマウント時)
    useEffect(() => {
        const loadItems = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchedItems = await mockFetchItems();
                setItems(fetchedItems);
            } catch (err) {
                console.error("データ取得エラー:", err);
                setError("食材リストの取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        };
        loadItems();
    }, []);

    // 削除ボタンクリックハンドラ (モーダル表示)
    const handleDeleteClick = useCallback((itemID) => {
        setSuccessMessage(null); // 新しい削除処理開始前に成功メッセージをクリア
        setError(null);
        setItemToDeleteId(itemID);
        setIsModalOpen(true);
    }, []);

    // モーダルで「いいえ」が押されたときのハンドラ
    const handleCancelDelete = useCallback(() => {
        setIsModalOpen(false);
        setItemToDeleteId(null);
    }, []);

    // モーダルで「はい」が押されたときのハンドラ (API呼び出しとDB反映)
    const handleDeleteConfirm = useCallback(async () => {
        if (itemToDeleteId === null || isDeleting) return;

        setIsModalOpen(false);
        setIsDeleting(true);
        setError(null);
        setSuccessMessage(null);

        const itemNameToDelete = items.find(item => item.id === itemToDeleteId)?.name || 'アイテム';

        try {
            // バックエンドAPIを呼び出す
            await mockDeleteItem(itemToDeleteId);
            
            // 削除成功後、ローカルの状態を更新
            setItems(prevItems => prevItems.filter(item => item.id !== itemToDeleteId));
            setSuccessMessage(`「${itemNameToDelete}」の削除が完了し、DBに反映されました。`);

        } catch (err) {
            console.error("削除処理エラー:", err);
            setError(err.message || "アイテムの削除中に不明なエラーが発生しました。");
        } finally {
            setIsDeleting(false);
            setItemToDeleteId(null);
        }
    }, [itemToDeleteId, isDeleting, items]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
                <p className="ml-4 text-xl font-medium text-gray-600">データをロード中...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
            <header className="mb-8 text-center sm:text-left">
                <h1 className="text-4xl font-extrabold text-gray-900 border-b-4 border-red-500 pb-2 inline-block">
                    🗑️ 食材削除ページ
                </h1>
                <p className="text-gray-600 mt-2">登録済みの食材を一覧から選択し、データベースから削除できます。</p>
            </header>

            <main className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-5xl mx-auto">
                {/* 成功/エラーメッセージ表示 */}
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-lg" role="alert">
                        <p className="font-bold">成功</p>
                        <p>{successMessage}</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg" role="alert">
                        <p className="font-bold">エラー</p>
                        <p>{error}</p>
                    </div>
                )}
                
                {items.length === 0 ? (
                    <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-xl font-medium mb-2">リストが空です</p>
                        <p>現在、冷蔵庫に登録されている食材はありません。</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto shadow-md rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-red-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tl-lg">
                                        食材名
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        登録日
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        賞味期限
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider rounded-tr-lg">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {items.map((item) => {
                                    const isExpired = item.date_expiration < new Date().toISOString().split('T')[0];
                                    return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.date_purchase}
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                            isExpired ? 'text-red-600 font-bold' : 'text-gray-800'
                                        }`}>
                                            {item.date_expiration}
                                            {isExpired && <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">期限切れ</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                            <button
                                                onClick={() => handleDeleteClick(item.id)}
                                                disabled={isDeleting}
                                                className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                            >
                                                削除
                                            </button>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* 削除確認モーダル */}
            <ConfirmationModal
                isOpen={isModalOpen}
                message={`「${items.find(item => item.id === itemToDeleteId)?.name || 'このアイテム'}」を本当に削除しますか？`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleCancelDelete}
                isProcessing={isDeleting}
            />
        </div>
    );
};

// ルーティング環境をシミュレートするため、Appコンポーネントでラップしてエクスポートします
const App = () => {
    // 実際は <Routes> や <MainLayout> の中に ItemDeletePage が配置されます
    return <ItemDeletePage />;
};

export default App;