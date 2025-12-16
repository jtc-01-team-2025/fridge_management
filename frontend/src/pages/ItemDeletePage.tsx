// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AlertTriangle, Trash2, X, Check } from 'lucide-react';

import { useState } from "react";
import { ExpirationStatus } from "../components/Expiration";
import type { FoodTypeNew } from "../types/FoodType";

// // ===========================================
// // 1. 型定義 (TypeScriptエラー解消のために必須)
// // ===========================================

// interface FridgeItem {
//   id: number;
//   name: string;
//   date_purchase: string;
//   date_expiration: string;
// }

// interface ModalState {
//   isOpen: boolean;
//   message: string | null;
//   onConfirm: () => void;
//   onCancel: () => void;
//   isProcessing: boolean;
// }

// // ===========================================
// // 2. ダミーのAPI関数 (ビルドを通すための一時的な措置)
// // ===========================================

// // 実際にはバックエンドのFastAPIエンドポイントを呼び出します
// // const API_BASE_URL = 'http://localhost:8000/api/items';

// const fetchItems = async (): Promise<FridgeItem[]> => {
//   // TODO: 実際のAPI呼び出しに置き換える
//   console.log("Fetching items from API...");
//   // ダミーデータ
//   return [
//     { id: 1, name: "牛乳", date_purchase: "2024-10-20", date_expiration: "2024-11-01" },
//     { id: 2, name: "卵 (10個)", date_purchase: "2024-10-25", date_expiration: "2024-11-15" },
//     { id: 3, name: "ほうれん草", date_purchase: "2024-10-28", date_expiration: "2024-10-31" },
//   ] as FridgeItem[];
// };

// const deleteItem = async (itemID: number): Promise<void> => {
//   // TODO: 実際のAPI呼び出しに置き換える
//   console.log(`Deleting item with ID: ${itemID}`);
//   // 成功をシミュレート
//   await new Promise(resolve => setTimeout(resolve, 800));
// };

// // ===========================================
// // 3. コンポーネント定義
// // ===========================================

// const ConfirmModal: React.FC<ModalState> = ({ isOpen, message, onConfirm, onCancel, isProcessing }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all">
//         <div className="flex flex-col items-center">
//           <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-pulse" />
//           <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
//             {message || "本当にこのアイテムを削除しますか？"}
//           </h3>
//           <div className="flex space-x-4 mt-2 w-full">
//             <button
//               onClick={onCancel}
//               disabled={isProcessing}
//               className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition duration-150 disabled:opacity-50"
//             >
//               <X className="w-4 h-4 inline mr-1" />
//               キャンセル
//             </button>
//             <button
//               onClick={onConfirm}
//               disabled={isProcessing}
//               className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition duration-150 disabled:bg-red-300 flex items-center justify-center"
//             >
//               {isProcessing ? (
//                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <><Check className="w-4 h-4 inline mr-1" /> 削除する</>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// export const ItemDeletePage = () => {
//   const [items, setItems] = useState<FridgeItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [modalState, setModalState] = useState<ModalState>({
//     isOpen: false,
//     message: null,
//     onConfirm: () => {},
//     onCancel: () => setModalState({ ...modalState, isOpen: false }),
//     isProcessing: false,
//   });
//   const navigate = useNavigate();

//   // アイテム一覧を取得する処理
//   const loadItems = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const fetchedItems = await fetchItems();
//       setItems(fetchedItems);
//     } catch (err) {
//       console.error("Failed to fetch items:", err);
//       setError("食材リストの取得に失敗しました。");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadItems();
//   }, [loadItems]);

//   // 削除ボタンクリック時のモーダル表示
//   const handleDeleteClick = (item: FridgeItem) => {
//     setModalState({
//       isOpen: true,
//       message: `「${item.name}」を本当に削除しますか？`,
//       onConfirm: () => confirmDelete(item.id),
//       onCancel: () => setModalState({ ...modalState, isOpen: false }),
//       isProcessing: false,
//     });
//   };

//   // 削除実行処理
//   const confirmDelete = async (itemID: number) => {
//     setModalState(s => ({ ...s, isProcessing: true }));
//     setError(null);
//     try {
//       await deleteItem(itemID);
//       // 削除成功: リストから削除されたアイテムをフィルタリング
//       setItems(prevItems => prevItems.filter(item => item.id !== itemID));
//       setModalState({ ...modalState, isOpen: false });
//     } catch (err) {
//       console.error("Deletion failed:", err);
//       setError(`「ID: ${itemID}」の削除に失敗しました。`);
//       setModalState(s => ({ ...s, isProcessing: false, isOpen: false }));
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-4 text-center">
//         <p className="text-lg text-gray-500">データを読み込み中...</p>
//         <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg shadow-md mx-auto max-w-lg mt-10">
//         <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
//         <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
//         <p>{error}</p>
//         <button 
//           onClick={() => navigate('/')} 
//           className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
//         >
//           ホームに戻る
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 max-w-4xl mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">アイテム削除</h1>

//       {items.length === 0 ? (
//         <div className="text-center py-12 bg-gray-50 rounded-xl shadow-inner">
//           <p className="text-xl text-gray-600 font-medium">冷蔵庫に削除できるアイテムはありません。</p>
//           <button 
//             onClick={() => navigate('/item/add')} 
//             className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-md hover:bg-green-600 transition"
//           >
//             アイテムを追加する
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {items.map((item) => (
//             <div 
//               key={item.id} 
//               className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md transition duration-200 hover:shadow-lg border-l-4 border-red-500"
//             >
//               <div className="flex flex-col">
//                 <p className="text-lg font-semibold text-gray-800">{item.name}</p>
//                 <div className="text-sm text-gray-500 mt-1 space-y-0.5">
//                   <p>購入日: {item.date_purchase}</p>
//                   <p>期限日: <span className="font-medium text-red-600">{item.date_expiration}</span></p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => handleDeleteClick(item)}
//                 className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition duration-150 shadow-inner"
//                 aria-label={`${item.name}を削除`}
//               >
//                 <Trash2 className="w-5 h-5" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
      
//       {/* 削除確認モーダル */}
//       <ConfirmModal {...modalState} />
//     </div>
//   );
// };

// --- 4. ItemDeletePage コンポーネント (API連携) ---
export const ItemDeletePage = ({
  items,
  onBack,
  onDeleteItem,
}: {
  items: FoodTypeNew[];
  onBack: () => void;
  onDeleteItem: (id: number) => Promise<void>;
}) => {
  // item.id を使用するように変更
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) {
      console.log("削除する食材が選択されていません。");
      return;
    }

    // 削除処理の実行 (Promise.allで並列実行)
    await Promise.all(selectedItems.map((id) => onDeleteItem(id)));

    setSelectedItems([]);
    onBack(); // 削除後にホームに戻る
  };

  return (
    <div className="p-6 md:p-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">🗑️ 食材の削除</h1>

      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
      >
        &larr; ホームに戻る
      </button>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner min-h-[300px]">
        {items.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10">削除可能な食材はありません。</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className={`flex justify-between items-center p-4 rounded-lg shadow-sm cursor-pointer transition duration-200 border-2 ${
                  selectedItems.includes(item.id)
                    ? "bg-red-100 border-red-500"
                    : "bg-white border-gray-100 hover:bg-gray-50"
                }`}
                onClick={() => toggleSelect(item.id)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                      selectedItems.includes(item.id)
                        ? "bg-red-500 border-red-500"
                        : "bg-white border-gray-400"
                    }`}
                  >
                    {selectedItems.includes(item.id) && (
                      <span className="text-white text-xs font-bold">✓</span>
                    )}
                  </div>
                  <div className="item-info">
                    <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">消費期限：{item.date_expiration}</p>
                  </div>
                </div>
                <ExpirationStatus date_expiration={item.date_expiration} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 pt-4 border-t flex justify-end">
        <button
          onClick={handleDelete}
          disabled={selectedItems.length === 0}
          className={`font-bold py-3 px-6 rounded-xl transition duration-150 shadow-lg ${
            selectedItems.length > 0
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          選択した{selectedItems.length}件を削除
        </button>
      </div>
    </div>
  );
};