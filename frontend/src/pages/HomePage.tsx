// import React, { useEffect, useMemo, useState, type JSX } from "react";
// // 外部ライブラリのインポートはすべて削除

import type { JSX } from "react";
import type { FoodTypeNew } from "../types/FoodType";

// // --- 1. FoodType の定義 ---
// interface FoodType {
//   id: number;
//   name: string;
//   date_expiration: string; // YYYY-MM-DD 形式
// }

// // --- 2. ダミーデータとAPI代替 ---

// // ダミーデータ生成関数
// const generateDummyItems = (): FoodType[] => {
//   const today = new Date();
//   // const formatDate = (date: Date) => today.toISOString().split('T')[0];
//   const formatDate = (today: Date) => today.toISOString().split("T")[0];

//   const dummyData: FoodType[] = [
//     {
//       id: 1,
//       name: "牛乳",
//       date_expiration: formatDate(new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000)),
//     }, // 明日
//     {
//       id: 2,
//       name: "卵 (Lサイズ)",
//       date_expiration: formatDate(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
//     }, // 7日後
//     { id: 3, name: "鶏むね肉", date_expiration: formatDate(new Date(today.getTime())) }, // 今日が期限
//     {
//       id: 4,
//       name: "キャベツ",
//       date_expiration: formatDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)),
//     }, // 30日後
//     {
//       id: 5,
//       name: "納豆",
//       date_expiration: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
//     }, // 期限切れ
//     {
//       id: 6,
//       name: "レタス",
//       date_expiration: formatDate(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)),
//     },
//   ];

//   // 期限が迫っている順にソートして返す
//   return dummyData.sort(
//     (a, b) => new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime()
//   );
// };

// // --- 3. コンポーネントの定義 (PopUp, Footer) ---

// const Footer = () => (
//   <footer className="w-full text-center p-4 mt-8 bg-gray-100 text-gray-600 text-sm border-t">
//     <p>© 2025 Refrigerator Manager App</p>
//   </footer>
// );

// const PopUp = ({
//   isVisible,
//   onClose,
//   children,
// }: {
//   isVisible: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }) => {
//   if (!isVisible) return null;
//   console.log("PopUp isVisible:", isVisible);
//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300">
//         <div className="flex justify-between items-start border-b pb-3 mb-4">
//           <h2 className="text-xl font-semibold text-red-700">🚨 期限アラート</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-900 text-2xl leading-none"
//           >
//             &times;
//           </button>
//         </div>
//         {children}
//         <div className="mt-6 pt-4 border-t flex justify-end">
//           <button
//             onClick={onClose}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-150 shadow-md"
//           >
//             閉じる
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- 4. ページコンポーネント (統合) ---

// type ExpirationStatusType = {
//   date_expiration: string;
// };
// const ExpirationStatus = ({ date_expiration }: ExpirationStatusType) => {
//   let label = "";
//   let className = "py-1 px-3 rounded-full text-xs font-semibold whitespace-nowrap";
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   // import { useEffect, useState } from "react";
//   // import { useNavigate } from 'react-router-dom';
//   // import { fetchData, type ApiResponse } from "../Client";
//   // import '../App.css';
//   // import { useMemo } from 'react';
//   // import { generateTestItems } from '../utils/generateDummyData';

//   const expire = new Date(date_expiration);
//   expire.setHours(0, 0, 0, 0);

//   const diffMs = expire.getTime() - today.getTime();
//   const diffDays = diffMs / (1000 * 60 * 60 * 24);

//   if (diffDays < 0) {
//     className += " bg-red-200 text-red-800 border border-red-300";
//     label = "期限切れ";
//   } else if (diffDays <= 7) {
//     className += " bg-yellow-200 text-yellow-800 border border-yellow-300 animate-pulse";
//     label = "1週間以内";
//   } else {
//     className += " bg-green-200 text-green-800 border border-green-300";
//     label = "安全";
//   }
//   return <span className={className}>{label}</span>;
// };

// // --- ItemDeletePage の機能統合 ---
// const ItemDeletePage = ({
//   items,
//   onBack,
//   onDeleteItem,
// }: {
//   items: FoodType[];
//   onBack: () => void;
//   onDeleteItem: (id: number) => void;
// }) => {
//   const [selectedItems, setSelectedItems] = useState<number[]>([]);

//   const toggleSelect = (id: number) => {
//     setSelectedItems((prev) =>
//       prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
//     );
//   };

//   const handleDelete = () => {
//     if (selectedItems.length === 0) {
//       console.log("削除する食材が選択されていません。");
//       return;
//     }

//     // 削除処理の実行
//     selectedItems.forEach((id) => onDeleteItem(id));
//     setSelectedItems([]);
//     onBack(); // 削除後にホームに戻る
//   };

//   return (
//     <div className="p-6 md:p-10 bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto">
//       <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">🗑️ 食材の削除</h1>

//       <button
//         onClick={onBack}
//         className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
//       >
//         &larr; ホームに戻る
//       </button>

//       <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner min-h-[300px]">
//         {items.length === 0 ? (
//           <p className="text-gray-500 italic text-center py-10">削除可能な食材はありません。</p>
//         ) : (
//           <ul className="space-y-3">
//             {items.map((item) => (
//               <li
//                 key={item.id}
//                 className={`flex justify-between items-center p-4 rounded-lg shadow-sm cursor-pointer transition duration-200 border-2 ${
//                   selectedItems.includes(item.id)
//                     ? "bg-red-100 border-red-500"
//                     : "bg-white border-gray-100 hover:bg-gray-50"
//                 }`}
//                 onClick={() => toggleSelect(item.id)}
//               >
//                 {" "}
//                 {/* 修正: '>'をonClick属性の行に結合 */}
//                 <div className="flex items-center space-x-4">
//                   <div
//                     className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
//                       selectedItems.includes(item.id)
//                         ? "bg-red-500 border-red-500"
//                         : "bg-white border-gray-400"
//                     }`}
//                   >
//                     {selectedItems.includes(item.id) && (
//                       <span className="text-white text-xs font-bold">✓</span>
//                     )}
//                   </div>
//                   <div className="item-info">
//                     <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
//                     <p className="text-sm text-gray-500">消費期限：{item.date_expiration}</p>
//                   </div>
//                 </div>
//                 <ExpirationStatus date_expiration={item.date_expiration} />
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="mt-8 pt-4 border-t flex justify-end">
//         <button
//           onClick={handleDelete}
//           disabled={selectedItems.length === 0}
//           className={`font-bold py-3 px-6 rounded-xl transition duration-150 shadow-lg ${
//             selectedItems.length > 0
//               ? "bg-red-600 hover:bg-red-700 text-white"
//               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//           }`}
//         >
//           選択した{selectedItems.length}件を削除
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- ItemAddPage の機能統合 (簡単なデモ用) ---
// const ItemAddPage = ({
//   onBack,
//   onAddItem,
// }: {
//   onBack: () => void;
//   onAddItem: (name: string, days: number) => void;
// }) => {
//   const [itemName, setItemName] = useState("");
//   const [days, setDays] = useState(7); // 期限を7日後に設定

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (itemName.trim()) {
//       onAddItem(itemName, days);
//       onBack();
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
//       <h1 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">
//         ➕ 食材の新規登録
//       </h1>
//       <button
//         onClick={onBack}
//         className="mb-6 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
//       >
//         &larr; ホームに戻る
//       </button>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label htmlFor="itemName" className="block text-sm font-medium text-gray-700">
//             食材名
//           </label>
//           <input
//             id="itemName"
//             type="text"
//             value={itemName}
//             onChange={(e) => setItemName(e.target.value)}
//             placeholder="例: 豆腐"
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>
//         <div>
//           <label htmlFor="days" className="block text-sm font-medium text-gray-700">
//             期限 (今日から何日後)
//           </label>
//           <input
//             id="days"
//             type="number"
//             value={days}
//             onChange={(e) => setDays(parseInt(e.target.value) || 0)}
//             min="1"
//             required
//             className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-150 shadow-lg transform hover:scale-[1.01]"
//         >
//           登録
//         </button>
//       </form>
//     </div>
//   );
// };

// // --- HomePage コンポーネント (統合) ---

// const HomePage = ({
//   items,
//   urgentItems,
//   togglePopup,
//   navigate,
//   getStatusComponent,
// }: {
//   items: FoodType[];
//   urgentItems: FoodType[];
//   togglePopup: () => void;
//   navigate: (path: "home" | "add" | "delete") => void;
//   getStatusComponent: ({ date_expiration }: ExpirationStatusType) => JSX.Element;
// }) => (
//   <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 md:p-10 mx-auto">
//     <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-3">
//       🧊 冷蔵庫在庫管理ホーム
//     </h1>

//     <div className="flex flex-col md:flex-row gap-8">
//       {/* アクションボタンパネル */}
//       <div className="md:w-1/3 flex flex-col space-y-4">
//         <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">アクション</h3>
//         <button
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-150 shadow-lg transform hover:scale-[1.02]"
//           onClick={() => navigate("add")}
//         >
//           ➕ 食材の登録
//         </button>

//         {/* 期限が近い、期限切れの食材 (ポップアップ表示) */}
//         <button
//           className={`w-full font-bold py-3 px-4 rounded-xl transition duration-150 shadow-lg border-2 ${
//             urgentItems.length > 0
//               ? "bg-red-50 border-red-500 text-red-700 hover:bg-red-100 animate-pulse"
//               : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
//           }`}
//           onClick={togglePopup}
//         >
//           ⚠️ 期限が近い食材 ({urgentItems.length}件)
//         </button>

//         {/* 食材の削除ボタン */}
//         <button
//           className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-xl transition duration-150 shadow-md"
//           onClick={() => navigate("delete")}
//         >
//           🗑️ 食材の削除
//         </button>
//       </div>

//       {/* 登録された食材のリスト表示パネル */}
//       <div className="md:w-2/3 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
//         <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
//           登録された食材リスト (期限が迫る順)
//         </h3>

//         {items.length === 0 ? (
//           <p className="text-gray-500 italic">まだ食材が登録されていません。</p>
//         ) : (
//           <ul className="space-y-3">
//             {items.map((item) => (
//               <li
//                 key={item.id}
//                 className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-gray-100"
//               >
//                 {" "}
//                 {/* 修正: '>'をclassName属性の行に結合 */}
//                 <div className="flex items-center space-x-4">
//                   <span className="text-lg text-gray-600">🍎</span> {/* アイコンは仮 */}
//                   <div className="item-info">
//                     <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
//                     <p className="text-sm text-gray-500">消費期限：{item.date_expiration}</p>
//                   </div>
//                 </div>
//                 {getStatusComponent({ date_expiration: item.date_expiration })}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>

//     {/* デバッグ情報 */}
//     <div className="mt-10 p-4 bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-lg text-sm">
//       <strong>💡 デバッグ情報:</strong>
//       <p>アプリケーションは**単一ファイル**で動作しており、すべてのデータはダミーです。</p>
//       <p>データ件数: {items.length}件</p>
//     </div>
//   </div>
// );

// // --- 5. メインAppコンポーネント (ルーティング機能を含む) ---

// type Page = "home" | "delete" | "add";

// // const Header = ({
// //   navigate,
// //   currentPage,
// // }: {
// //   navigate: (path: Page) => void;
// //   currentPage: Page;
// // }) => (
// //   <header className="w-full bg-indigo-700 shadow-lg sticky top-0 z-40">
// //     <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
// //       <h2 className="text-2xl font-bold text-white tracking-wider">Fridge Manager</h2>
// //       <nav className="space-x-4">
// //         <button
// //           onClick={() => navigate("home")}
// //           className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "home" ? "border-b-2 border-white" : ""}`}
// //         >
// //           ホーム
// //         </button>
// //         <button
// //           onClick={() => navigate("add")}
// //           className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "add" ? "border-b-2 border-white" : ""}`}
// //         >
// //           登録
// //         </button>
// //         <button
// //           onClick={() => navigate("delete")}
// //           className={`text-white font-medium transition duration-150 hover:text-indigo-200 ${currentPage === "delete" ? "border-b-2 border-white" : ""}`}
// //         >
// //           削除
// //         </button>
// //       </nav>
// //     </div>
// //   </header>
// // );

// export function App() {
//   const [data, setData] = useState<FoodType[]>([]);
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [currentPage, setCurrentPage] = useState<Page>("home");
//   const [nextId, setNextId] = useState(100);

//   // 初期データのロード
//   useEffect(() => {
//     // API代替 (ダミーデータ) のロード
//     setData(generateDummyItems());
//   }, []);

//   // 期限が近い・期限切れアイテムのフィルタリング
//   const urgentItems = useMemo(
//     () =>
//       data.filter((item) => {
//         const today = new Date();
//         const expiryDate = new Date(item.date_expiration);
//         expiryDate.setHours(0, 0, 0, 0);
//         today.setHours(0, 0, 0, 0);

//         const diffDays = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

//         return diffDays <= 7; // 7日以内または期限切れ
//       }),
//     [data]
//   );

//   // 食材登録ロジック
//   const handleAddItem = (name: string, days: number) => {
//     const today = new Date();
//     const expiryDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

//     const newItem: FoodType = {
//       id: nextId,
//       name: name,
//       date_expiration: expiryDate.toISOString().split("T")[0],
//     };

//     setData((prev) => {
//       const newData = [...prev, newItem];
//       // ソートを維持
//       return newData.sort(
//         (a, b) => new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime()
//       );
//     });
//     setNextId((prev) => prev + 1);
//     console.log(`アイテム: ${name} が登録されました。`);
//   };

//   // ページナビゲーションの代替 (ルーターなし)
//   const navigate = (page: Page) => {
//     if (page === "add" && currentPage === "add") {
//       // 現在 'add' ページにいる場合は何もしない (登録完了後の戻りはコンポーネント内で行う)
//       return;
//     }
//     setCurrentPage(page);
//   };
//   // //useMemo() を使って items をメモ化
//   // const items = useMemo(() => generateTestItems(Math.floor(Math.random() * 11)), []);
//   // const [isPopupVisible, setIsPopupVisible] = useState(false);

//   const togglePopup = () => setIsPopupVisible(!isPopupVisible);

//   // 削除ロジック
//   const handleDeleteItem = (id: number) => {
//     setData((prev) => prev.filter((item) => item.id !== id));
//   };

//   // ページレンダリングの切り替え
//   const renderPage = () => {
//     switch (currentPage) {
//       case "home":
//         return (
//           <HomePage
//             items={data}
//             urgentItems={urgentItems}
//             togglePopup={togglePopup}
//             navigate={navigate}
//             getStatusComponent={ExpirationStatus}
//           />
//         );
//       case "delete":
//         return (
//           <ItemDeletePage
//             items={data}
//             onBack={() => setCurrentPage("home")}
//             onDeleteItem={handleDeleteItem}
//           />
//         );
//       case "add":
//         return <ItemAddPage onBack={() => setCurrentPage("home")} onAddItem={handleAddItem} />;
//       default:
//         return (
//           <HomePage
//             items={data}
//             urgentItems={urgentItems}
//             togglePopup={togglePopup}
//             navigate={navigate}
//             getStatusComponent={ExpirationStatus}
//           />
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col p-0 font-sans">
//       {/* <Header navigate={navigate} currentPage={currentPage} /> */}

//       <main className="flex-grow p-4 md:p-8">{renderPage()}</main>

//       <PopUp isVisible={isPopupVisible} onClose={togglePopup}>
//         <div className="space-y-4">
//           {urgentItems.length === 0 ? (
//             <p className="text-gray-600">
//               期限が近い、または期限切れの食材はありません。素晴らしい！
//             </p>
//           ) : (
//             <>
//               <h3 className="text-lg font-bold text-red-600">期限が近い、期限切れの食材一覧</h3>
//               <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
//                 {urgentItems.map((item) => (
//                   <li
//                     key={item.id}
//                     className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200"
//                   >
//                     <div className="flex-grow">
//                       <h4 className="font-medium text-gray-800">{item.name}</h4>
//                       <p className="text-sm text-gray-500">消費期限：{item.date_expiration}</p>
//                     </div>
//                     <ExpirationStatus date_expiration={item.date_expiration} />
//                     {/* <ExpirationStatus date_expiration={item.date_expiration} /> */}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>
//       </PopUp>

//       <Footer />
//     </div>
//   );
// }

// export default App;

// // function PopUp({
// //   isVisible,
// //   onClose,
// //   children,
// // }: {
// //   isVisible: boolean;
// //   onClose: () => void;
// //   children: React.ReactNode;
// // }) {
// //   if (!isVisible) return null;

// //   return (
// //     <div className="popup-overlay">
// //       <div className="popup-content">
// //         <button className="close-button" onClick={onClose}>
// //           ✕
// //         </button>
// //         {children}
// //       </div>
// //     </div>
// //   );
// // }

// // function Footer() {
// //   return (
// //     <footer style={{ marginTop: "2rem", textAlign: "center", color: "#888" }}>
// //       © 2025 Fridge Management App
// //     </footer>
// //   );
// // }

// // export default HomePage;
// --- 2. API設定 ---
const API_BASE_URL = "http://localhost:8000/api";

// --- 6. HomePage コンポーネント ---
export const HomePage = ({
  items,
  urgentItems,
  togglePopup,
  navigate,
  getStatusComponent,
  userId,
}: {
  items: FoodTypeNew[];
  urgentItems: FoodTypeNew[];
  togglePopup: () => void;
  navigate: (path: "home" | "add" | "delete") => void;
  getStatusComponent: ({ date_expiration }: { date_expiration: string }) => JSX.Element;
  userId: string;
}) => (
  <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 md:p-10 mx-auto">
    <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b pb-3">
      🧊 冷蔵庫在庫管理ホーム
    </h1>

    {/* ユーザーID表示 (FastAPIのX-User-Idヘッダーに使用) */}
    <div className="text-center mb-6 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
      <p className="text-sm font-medium text-indigo-700">現在のセッションID (API連携に使用):</p>
      <p className="font-mono text-xs text-gray-800 break-all">{userId}</p>
    </div>

    <div className="flex flex-col md:flex-row gap-8">
      {/* アクションボタンパネル */}
      <div className="md:w-1/3 flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-2">アクション</h3>

        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition duration-150 shadow-lg transform hover:scale-[1.02]"
          onClick={() => navigate("add")}
        >
          ➕ 食材の登録
        </button>

        {/* 期限が近い、期限切れの食材 (ポップアップ表示) */}
        <button
          className={`w-full font-bold py-3 px-4 rounded-xl transition duration-150 shadow-lg border-2 ${
            urgentItems.length > 0
              ? "bg-red-50 border-red-500 text-red-700 hover:bg-red-100 animate-pulse"
              : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={togglePopup}
        >
          ⚠️ 期限が近い食材 ({urgentItems.length}件)
        </button>

        {/* 食材の削除ボタン */}
        <button
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-xl transition duration-150 shadow-md"
          onClick={() => navigate("delete")}
        >
          🗑️ 食材の削除
        </button>
      </div>

      {/* 登録された食材のリスト表示パネル */}
      <div className="md:w-2/3 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
          登録された食材リスト (期限が迫る順)
        </h3>

        {items.length === 0 ? (
          <p className="text-gray-500 italic">まだ食材が登録されていません。</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id} // APIから返されるIDをキーに使用
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-lg text-gray-600">🍎</span> {/* アイコンは仮 */}
                  <div className="item-info">
                    <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">消費期限：{item.date_expiration}</p>
                  </div>
                </div>
                {getStatusComponent({date_expiration:item.date_expiration})}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

    {/* デバッグ情報 */}
    <div className="mt-10 p-4 bg-blue-50 text-blue-800 border border-blue-300 rounded-lg text-sm">
      <strong>💡 データ連携情報:</strong>
      <p>
        アプリケーションは**FastAPIバックエンド** (`{API_BASE_URL}`)
        を介してMySQLデータベースと通信しています。
      </p>
      <p>データ件数: {items.length}件</p>
    </div>
  </div>
);