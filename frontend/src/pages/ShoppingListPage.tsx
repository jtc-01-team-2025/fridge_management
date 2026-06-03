import { Plus, ShoppingBasket, Trash2 } from "lucide-react";
import AddShoppingItemPopUP from "../components/AddShoppingItemPopUP";
import Header from "../components/Header";
import PopUp from "../components/PopUP";
import "../styles/ShoppingListPage.css";
import { useEffect, useState } from "react";
import type { ShoppingItem } from "../types/FoodType";
import { deleteShoppingItem, fetchShoppingList, updateShoppingItemCheck } from "../Client";

export const ShoppingListPage = ({ userId }: { userId: string }) => {
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const items = await fetchShoppingList(userId);
        if (!cancelled) setShoppingList(items);
      } catch (e) {
        console.error("買い物リスト取得失敗", e);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleCheckChange = async (id: string, checked: boolean) => {
    const updated = await updateShoppingItemCheck(id, checked);
    // setShoppingList((prev) =>
    //   prev.map((item) => (item.id === id ? { ...updated, id: String(updated.id) } : item))
    // );
    setShoppingList((prev) => prev.map((item) => (item.id === id ? updated : item)));
  };

  const handleMoveToInventory = (item: ShoppingItem) => {
    console.log("在庫へ移動:", item);
  };
  const checkedItems = shoppingList.filter((item) => item.checked);
  const uncheckedItems = shoppingList.filter((item) => !item.checked);
  return (
    <>
      <Header title="買い物" userId={userId} />
      <div className="shoppingListContainer">
        <div className="headerCard">
          <div className="headerContent">
            <div>
              <p className="headerLabel">買い物リスト</p>
              <p className="headerCount">
                {uncheckedItems.length}個<span className="headerBadge">未購入</span>
              </p>
            </div>
            <button className="button" onClick={() => setIsAddPopupOpen(true)}>
              <Plus className="buttonIcon" />
              追加
            </button>
          </div>
        </div>
        {uncheckedItems.length > 0 && (
          <div className="shoppingItems">
            {uncheckedItems.map((item) => (
              <div key={item.id} className="shoppingItemCard">
                <div className="shoppingItemRow">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => handleCheckChange(item.id, e.target.checked)}
                    className="shoppingCheckbox"
                  />
                  <div className="shoppingItemBody">
                    <h4 className="shoppingItemName">{item.name}</h4>
                    <p className="shoppingItemMeta">
                      {item.quantity}
                      {item.unit} • {item.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      deleteShoppingItem(item.id)
                        .then(() =>
                          setShoppingList((prev) =>
                            prev.filter((prevItem) => prevItem.id !== item.id)
                          )
                        )
                        .catch((error) => console.error("削除エラー:", error))
                    }
                    className="deleteButton"
                    aria-label="削除"
                  >
                    <Trash2 className="deleteIcon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {checkedItems.length > 0 && (
          <div className="shoppingItems">
            <h3 className="checkedSectionTitle">購入済み</h3>
            {checkedItems.map((item) => (
              <div key={item.id} className="shoppingItemCard checkedItemCard">
                <div className="shoppingItemRow">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => handleCheckChange(item.id, e.target.checked)}
                    className="shoppingCheckbox"
                  />
                  <div className="shoppingItemBody">
                    <h4 className="shoppingItemName checkedItemName">{item.name}</h4>
                    <p className="shoppingItemMeta checkedItemMeta">
                      {item.quantity}
                      {item.unit} • {item.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMoveToInventory(item)}
                    className="moveButton"
                  >
                    <ShoppingBasket className="moveIcon" />
                    在庫へ
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteShoppingItem(item.id)}
                    className="deleteButton"
                    aria-label="削除"
                  >
                    <Trash2 className="deleteIcon" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {shoppingList.length === 0 && (
          <div className="emptyState">
            <ShoppingBasket className="emptyStateIcon" />
            <p>買い物リストが空です</p>
            <p className="emptyStateSub">必要な商品を追加しましょう</p>
          </div>
        )}
      </div>
      <PopUp isVisible={isAddPopupOpen} onClose={() => setIsAddPopupOpen(false)}>
        <AddShoppingItemPopUP
          user_id={userId}
          closePopup={() => setIsAddPopupOpen(false)}
          onCreated={(created) => {
            setShoppingList((prev) => [...prev, created]);
          }}
        />
      </PopUp>
    </>
  );
};
