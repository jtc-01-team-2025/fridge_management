// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchData } from "../Client";
// import "../styles/Homepage.css";
// import { generateTestItems } from "../utils/generateDummyData";
// import Footer from "../components/Footer";
// import PopUp from "../components/PopUP";
// import type { FoodType } from "../types/FoodType";

// // 食材データの型定義（FoodTypeのdate_expirationを引数に取ることを想定）
// // FoodTypeには date_expiration と name が含まれていると仮定します。

// function HomePage() {
//   const [data, setData] = useState<FoodType[]>([]);
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const navigate = useNavigate();

//   // API 疎通確認ロジック
//   useEffect(() => {
//     fetchData()
//       .then((res) => setData(res))
//       .catch((err) => console.error(err));
//   }, []);

//   const getExpirationStatus = (expirationDate: string) => {
//     let label = "";
//     let className = "";
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const expire = new Date(expirationDate);
//     expire.setHours(0, 0, 0, 0);

//     const diffMs = expire.getTime() - today.getTime();
//     const diffDays = diffMs / (1000 * 60 * 60 * 24);

//     if (diffDays < 0) {
//       className = "badge expired";
//       label = "期限切れ";
//     } else if (diffDays <= 7) {
//       className = "badge warning";
//       label = "1週間以内";
//     } else {
//       className = "badge safe";
//       label = "安全";
//     }
//     return <span className={className}>{label}</span>;
//   };

//   //useMemo() を使って items をメモ化
//   // 実際は data (APIからの結果) を表示すべきですが、ここではデモ用にitemsをそのまま利用します
//   const items = useMemo(() => generateTestItems(Math.floor(Math.random() * 11)), []);

//   const togglePopup = () => setIsPopupVisible(!isPopupVisible);
  
//   return (
//     <div className="home-container">
//       <PopUp isVisible={isPopupVisible} onClose={togglePopup}>
//         <div className="item-list-panel">
//           {items.length === 0 ? (
//             <p>期限が近い食材はありません。</p>
//           ) : (
//             <>
//               <h3>期限が近い、期限切れの食材一覧</h3>
//               <ul className="popup-item-list">
//                 {items
//                   .filter((item) => {
//                     const today = new Date();
//                     const expiryDate = new Date(item.date_expiration);
//                     const diffDays =
//                       (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
//                     return diffDays <= 7;
//                   })
//                   .sort((a, b) => new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime())
//                   .map((item, index) => (
//                     // FoodTypeにname, date_expirationが定義されていることを想定
//                     <li key={index}>
//                       <div className="item-left">
//                         <div className="item-info">
//                           <h3>{item.name}</h3>
//                           <p>消費期限：{item.date_expiration}</p>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//               </ul>
//             </>
//           )}
//         </div>
//       </PopUp>
//       <h2>冷蔵庫管理</h2>
//       <div className="main-content">
//         <div className="action-buttons-panel">
//           {/* ★ 修正点1: 食材の登録ボタンを /add ルートへ遷移させる */}
//           <button className="action-button secondary" onClick={() => navigate("/add")}>
//             食材の登録
//           </button>

//           {/* 期限が近い、期限切れの食材 (ポップアップ表示) */}
//           <button className="action-button secondary" onClick={togglePopup}>
//             期限が近い、期限切れの食材 (リストへ)
//           </button>

//           {/* ★ 修正点2: 食材の削除ボタンを /delete ルートへ遷移させる */}
//           <button className="action-button secondary" onClick={() => navigate("/delete")}>
//             食材の削除
//           </button>
//         </div>
//         <div className="item-list-panel">
//           <h3>登録された食材のリスト (期限が迫ってくる順)</h3>
//           {items.length === 0 ? (
//             <p>登録された食材はありません。</p>
//           ) : (
//             <ul>
//               {items.map((item, index) => (
//                 <li key={index}>
//                   <div className="item-left">
//                     <div className="item-info">
//                       <h3>{item.name}</h3>
//                       <p>消費期限：{item.date_expiration}</p>
//                     </div>
//                   </div>
//                   {getExpirationStatus(item.date_expiration)}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>

//       {/* API 疎通確認結果 (デバッグ用として下部に移動) */}
//       <div
//         style={{
//           marginTop: "30px",
//           padding: "10px",
//           backgroundColor: "#f0f0f0",
//           borderRadius: "5px",
//         }}
//       >
//         <strong>API ステータス (デバッグ):</strong>
//         {data.length ? <p>API接続成功。データ例: {JSON.stringify(data[0])}</p> : <p>Loading from API...</p>}
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default HomePage;

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. useNavigate をインポート
import { fetchData } from "../Client";
import "../styles/Homepage.css";
import { generateTestItems } from "../utils/generateDummyData";
import Footer from "../components/Footer";
import PopUp from "../components/PopUP";
import type { FoodType } from "../types/FoodType";

// 食材データの型定義（仮）
// interface InventoryItem {
//   name: string;
//   expiry: string;
//   isUrgent: boolean;
// }

function HomePage() {
  const [data, setData] = useState<FoodType[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate(); // 2. navigate 関数を取得
  const useApiData = import.meta.env.VITE_USE_API === "true";

  // API 疎通確認ロジック
  useEffect(() => {
    fetchData()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, [useApiData]);

  const getExpirationStatus = (expirationDate: string) => {
    let label = "";
    let className = "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expire = new Date(expirationDate);
    expire.setHours(0, 0, 0, 0);

    const diffMs = expire.getTime() - today.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      className = "badge expired";
      label = "期限切れ";
    } else if (diffDays <= 7) {
      className = "badge warning";
      label = "1週間以内";
    } else {
      className = "badge safe";
      label = "安全";
    }
    return <span className={className}>{label}</span>;
  };

  // 期限が近い食材のダミーデータ（実際のデータ取得ロジックは今後実装）
  // const items: InventoryItem[] = [
  //   { name: "リンゴ", expiry: "2025/10/1", isUrgent: true },
  //   { name: "バナナ", expiry: "2025/11/20", isUrgent: true },
  //   { name: "豚肉", expiry: "2025/12/20", isUrgent: false },
  // ];

  //useMemo() を使って items をメモ化
  const items = useMemo(
    () => (useApiData ? data : generateTestItems(Math.floor(Math.random() * 11))),
    [useApiData, data]
  );

  const togglePopup = () => setIsPopupVisible(!isPopupVisible);
  return (
    <div className="home-container">
      <PopUp isVisible={isPopupVisible} onClose={togglePopup}>
        <div className="item-list-panel">
          {items.length === 0 ? (
            <p>期限が近い食材はありません。</p>
          ) : (
            <>
              <h3>期限が近い、期限切れの食材一覧</h3>
              <ul className="popup-item-list">
                {items
                  .filter((item) => {
                    const today = new Date();
                    const expiryDate = new Date(item.date_expiration);
                    const diffDays =
                      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                    return diffDays <= 7;
                  })
                  .sort(
                    (a, b) =>
                      new Date(a.date_expiration).getTime() - new Date(b.date_expiration).getTime()
                  )
                  .map((item, index) => (
                    <li key={index}>
                      <div className="item-left">
                        <div className="item-info">
                          <h3>{item.name}</h3>
                          <p>消費期限：{item.date_expiration}</p>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      </PopUp>
      <h2>冷蔵庫管理</h2>
      <div className="main-content">
        <div className="action-buttons-panel">
          <button className="action-button secondary" onClick={() => navigate("/item/add")}>
            食材の登録
          </button>

          {/* 💡 期限が近い、期限切れの食材 (パス: /inventory へ遷移) 
             ここではフィルタリング済みのリストとして InventoryListPage を再利用します */}
          <button className="action-button secondary" onClick={togglePopup}>
            期限が近い、期限切れの食材 (リストへ)
          </button>

          {/* 食材の削除ボタン (今回は詳細な遷移先がないため仮の動作) */}
          <button className="action-button secondary" onClick={() => navigate("/item/delete")}>
            食材の削除
          </button>

        </div>
        <div className="item-list-panel">
          <h3>登録された食材のリスト (期限が迫ってくる順)</h3>
          {items.length === 0 ? (
            <p>登録された食材はありません。</p>
          ) : (
            <ul>
              {items.map((item, index) => (
                <li key={index}>
                  <div className="item-left">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p>消費期限：{item.date_expiration}</p>
                    </div>
                  </div>
                  {getExpirationStatus(item.date_expiration)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* API 疎通確認結果 (デバッグ用として下部に移動) */}
      <div
        style={{
          marginTop: "30px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        <strong>API ステータス (デバッグ):</strong>
        {data.length ? <p>Response: {JSON.stringify(data[0])}</p> : <p>Loading from API...</p>}
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
