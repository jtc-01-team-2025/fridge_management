// // import { useEffect, useState } from "react";
// // import "./App.css";
// // import { fetchData, type ApiResponse } from "./Client.ts";

// // function App() {
// //    const [data, setData] = useState<ApiResponse | null>(null);

// //   useEffect(() => {
// //     fetchData()
// //       .then((res) => setData(res))
// //       .catch((err) => console.error(err));
// //   }, []);
// //   return (
// //     <>
// //       <div style={{ padding: "2rem" }}>
// //         <h1>Fridge Management</h1>
// //         {data ? <p>Response: {data.message}</p> : <p>Loading from API...</p>}
// //       </div>
// //     </>
// //   );
// // }

// // export default App;


// import { Routes, Route } from 'react-router-dom';
// import MainLayout from './components/layout/MainLayout';
// import HomePage from './pages/HomePage';
// import InventoryListPage from './pages/InventoryListPage';
// import ItemFormPage from './pages/ItemFormPage';
// // 必要なページコンポーネントを全てインポートしてください

// function App() {
//   return (
//     // 💡 必須: 全体を BrowserRouter で囲み、ルーティングを有効化します
//       <Routes>
//         {/* MainLayout を親ルートとし、ヘッダー/ナビゲーションを表示する */}
//         <Route path="/" element={<MainLayout />}>
          
//           {/* URLが '/' のとき表示されるホーム画面 */}
//           <Route index element={<HomePage />} /> 
          
//           {/* 在庫一覧画面のルート */}
//           <Route path="inventory" element={<InventoryListPage />} />
          
//           {/* 食材追加・編集フォームのルート */}
//           <Route path="item/add" element={<ItemFormPage />} />
//           <Route path="item/edit/:id" element={<ItemFormPage />} />
          
//           {/* 存在しないパス（404）の処理 */}
//           <Route path="*" element={<h1>404 Not Found</h1>} />
//         </Route>
//       </Routes>
//   );
// }

// export default App;

// App.tsx の完全な修正版

import React from 'react';
// BrowserRouter as Router のインポートは削除し、必要なコンポーネントのみをインポート
import { Routes, Route, Link } from 'react-router-dom';

// 必要なページコンポーネントをインポート
import HomePage from './pages/HomePage';
import ItemAddPage from './pages/ItemAddPage'; 
import ItemDeletePage from './pages/ItemDeletePage'; 

// 注意: このファイル内の他のコメントアウトされた古いコードは全て削除してください。

const App: React.FC = () => {
  return (
    // ★ 修正点1: main.tsx で <BrowserRouter> を使っているため、ここでは <Router> を使わない
    <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
      <header style={{ backgroundColor: '#ffae00', padding: '10px', color: 'white' }}>
        <h2>Fridge Manager</h2>
        {/* デバッグ用のナビゲーションをヘッダーに配置 */}
        <nav>
          <Link to="/" style={{ color: 'white', marginRight: '15px' }}>ホーム</Link>
          <Link to="/add" style={{ color: 'white', marginRight: '15px' }}>登録</Link>
          <Link to="/delete" style={{ color: 'white' }}>削除</Link>
        </nav>
      </header>
      
      <main style={{ padding: '20px' }}>
        <Routes>
          {/* ★ 修正点2: 本物の HomePage を直接使用 */}
          <Route path="/" element={<HomePage />} /> 
          
          {/* 食材の登録ページ */}
          <Route path="/item/add" element={<ItemAddPage />} />
          
          {/* 食材の削除ページ */}
          <Route path="/item/delete" element={<ItemDeletePage />} />
          
          {/* 404 Not Found ページ */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
