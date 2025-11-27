// import { useEffect, useState } from "react";
// import "./App.css";
// import { fetchData, type ApiResponse } from "./Client.ts";

// function App() {
//    const [data, setData] = useState<ApiResponse | null>(null);

//   useEffect(() => {
//     fetchData()
//       .then((res) => setData(res))
//       .catch((err) => console.error(err));
//   }, []);
//   return (
//     <>
//       <div style={{ padding: "2rem" }}>
//         <h1>Fridge Management</h1>
//         {data ? <p>Response: {data.message}</p> : <p>Loading from API...</p>}
//       </div>
//     </>
//   );
// }

// export default App;


// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import MainLayout from './components/layout/MainLayout';
// import HomePage from './pages/HomePage';
// import InventoryListPage from './pages/InventoryListPage';
// import ItemFormPage from './pages/ItemDeletePage';
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


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import ItemAddPage from './pages/ItemAddPage';       // 食材登録ページ
import ItemDeletePage from './pages/ItemDeletePage'; // 食材削除ページ

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* InventoryListPage へのルートを削除 */}
        <Route path="/item/add" element={<ItemAddPage />} />     
        <Route path="/item/delete" element={<ItemDeletePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;

