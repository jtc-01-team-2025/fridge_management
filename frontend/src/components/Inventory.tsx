import type { FoodTypeNew } from "../types/FoodType";
import "../styles/Inventory.css";
import { useEffect, useState } from "react";
import { API_BASE_URL, categories } from "../constants";
import { AlertCircle, Pencil, Plus, Receipt, Trash2 } from "lucide-react";
import PopUp from "./PopUP";
import AddPopUP from "./AddPopUP";
import EditPopUP from "./EditPopUP";

const Inventory = ({
  inventory,
  expiringItems,
}: {
  inventory: FoodTypeNew[];
  expiringItems: FoodTypeNew[];
}) => {
  const [inventories, setInventories] = useState(inventory);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isReceiptPopupOpen, setIsReceiptPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "fridge">("list");
  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {
    if (filterCategory === "all") {
      setInventories(inventory);
    } else {
      setInventories(inventory.filter((item) => item.category === filterCategory));
    }
  }, [filterCategory]);

  const closeAddPopup = () => setIsAddPopupOpen(false);
  const closeEditPopup = () => setIsEditPopupOpen(false);
  const getExpiryBadge = (expiryDate: string) => {
    const days = getDaysUntilExpiry(expiryDate);
    if (days < 0) {
      return (
        <span data-slot="badge" className="inventory-badge inventory-badge-expired">
          期限切れ
        </span>
      );
    } else if (days <= 3) {
      return (
        <span data-slot="badge" className="inventory-badge inventory-badge-urgent">
          あと{days}日
        </span>
      );
    } else if (days <= 7) {
      return (
        <span data-slot="badge" className="inventory-badge inventory-badge-warning">
          あと{days}日
        </span>
      );
    }
    return (
      <span data-slot="badge" className="inventory-badge inventory-badge-ok">
        あと{days}日
      </span>
    );
  };

  const deleteInventoryItem = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/items/${id}`, {
        method: "DELETE",
        // headers: { "X-User-Id": userId },
      });
      // await fetchItems();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateInventoryItem = (id: number) => {
    setSelectedItemId(id);
    setIsEditPopupOpen(true);
  };

  const selectedItem = inventories.find((item) => item.id === selectedItemId);
  return (
    <>
      <PopUp isVisible={isAddPopupOpen} onClose={() => closeAddPopup()}>
        <AddPopUP closePopup={closeAddPopup} />
      </PopUp>
      <PopUp isVisible={isEditPopupOpen} onClose={() => closeEditPopup()}>
        {selectedItem && <EditPopUP inventory={selectedItem} closePopup={() => closeEditPopup()} />}
      </PopUp>
      <PopUp isVisible={isReceiptPopupOpen} onClose={() => setIsReceiptPopupOpen(false)}>
        <p>この機能は現在開発中です。</p>
        {/* ReceiptPopUP component can be added here */}
      </PopUp>
      <div className="inventory-list">
        <div className="inventory-wrap">
          <div className="inventory-header">
            <div className="inventory-summary">
              <p className="inventory-summary-label">現在の在庫</p>
              <p className="inventory-summary-count">{inventory.length}個</p>
            </div>
            <div className="inventory-header-actions">
              <button
                className="inventory-header-button"
                onClick={() => setIsReceiptPopupOpen(true)}
              >
                <Receipt className="w-5 h-5 mr-2" />
                レシート
              </button>
              <button onClick={() => setIsAddPopupOpen(true)} className="inventory-header-button">
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {expiringItems.length > 0 && (
            <div className="inventory-alert inventory-alert-warning" role="alert">
              <div className="inventory-alert-icon" aria-hidden="true">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <div className="inventory-alert-body">
                <div className="inventory-alert-title">期限が近い食材</div>
                <div className="inventory-alert-description">
                  {expiringItems.length}個の食材の賞味期限が3日以内です
                </div>
              </div>
            </div>
          )}

          <div className="inventory-tabs">
            <div className="inventory-tabs-list">
              <button
                className="inventory-tabs-trigger"
                data-state={viewMode === "list" ? "active" : "inactive"}
                onClick={() => setViewMode("list")}
              >
                <div className="inventory-tabs-icon" />
                リスト
              </button>
              <button
                className="inventory-tabs-trigger"
                data-state={viewMode === "fridge" ? "active" : "inactive"}
                onClick={() => setViewMode("fridge")}
              >
                <div className="inventory-tabs-icon" />
                冷蔵庫
              </button>
            </div>

            <div className="inventory-tabs-content">
              {viewMode === "fridge" ? (
                <div className="inventory-card-list">
                  {Object.entries(
                    inventories
                      .filter((item) => item.location === "冷蔵")
                      .reduce<Record<string, FoodTypeNew[]>>((acc, item) => {
                      const cat = item.category || "その他";
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(item);
                      return acc;
                    }, {})
                  ).map(([cat, items]) => (
                    <div key={cat} style={{ marginBottom: "16px" }}>
                      <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#6b7280", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {cat} ({items.length})
                      </h4>
                      {items.map((item) => (
                        <div key={item.id} className="inventory-card">
                          <div className="inventory-card-content">
                            <div className="inventory-card-top">
                              <div className="inventory-card-main">
                                <h3 className="inventory-card-name">{item.name}</h3>
                              </div>
                              <div className="inventory-card-qty">
                                <p className="inventory-card-qty-value">
                                  {item.quantity}<span className="inventory-card-qty-unit">個</span>
                                </p>
                              </div>
                            </div>
                            <div className="inventory-card-bottom">
                              {getExpiryBadge(item.date_expiration)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {inventories.filter((item) => item.location === "冷蔵").length === 0 && (
                    <p style={{ color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>冷蔵の食材がありません</p>
                  )}
                </div>
              ) : (
              <>
              <div className="inventory-chip-row">
                <button
                  onClick={() => setFilterCategory("all")}
                  className={
                    filterCategory === "all"
                      ? "inventory-chip inventory-chip-active"
                      : "inventory-chip"
                  }
                >
                  すべて
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={
                      filterCategory === cat
                        ? "inventory-chip inventory-chip-active"
                        : "inventory-chip"
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="inventory-card-list">
                {inventories.map((item) => (
                  <div key={item.id} className="inventory-card">
                    <div className="inventory-card-content">
                      <div className="inventory-card-top">
                        <div className="inventory-card-main">
                          <h3 className="inventory-card-name">{item.name}</h3>
                          <div className="inventory-card-meta">
                            <span className="inventory-card-meta-text">
                              {item.category ? item.category : "不明"}
                            </span>
                            <span className="inventory-card-meta-dot">•</span>
                            <span className="inventory-card-meta-text">{item.location || "冷蔵"}</span>
                          </div>
                        </div>

                        <div className="inventory-card-qty">
                          <p className="inventory-card-qty-value">
                            {item.quantity}
                            <span className="inventory-card-qty-unit">個</span>
                            {/* <span className="inventory-card-qty-unit">{item.unit}</span> */}
                          </p>
                        </div>
                      </div>

                      <div className="inventory-card-bottom">
                        {getExpiryBadge(item.date_expiration)}
                        <div className="inventory-card-actions">
                          <button
                            className="inventory-btn"
                            onClick={() => updateInventoryItem(item.id)}
                          >
                            <Pencil />
                          </button>
                          <button
                            className="inventory-btn inventory-icon-btn-danger"
                            onClick={async () =>
                              await deleteInventoryItem(item.id)
                                .then(() => window.alert("削除しました"))
                                .catch(() => window.alert("削除に失敗しました"))
                            }
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </>
              )}
            </div>
            {/* <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as "list" | "fridge")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="w-4 h-4" />
                リスト
              </TabsTrigger>
              <TabsTrigger value="fridge" className="flex items-center gap-2">
                <Box className="w-4 h-4" />
                冷蔵庫
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-3 mt-4">


              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setFilterCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filterCategory === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300"
                  }`}
                >
                  すべて
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      filterCategory === cat
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 border border-gray-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredInventory.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden active:scale-[0.98] transition-transform"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{item.category}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-500">{item.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-800">
                            {item.quantity}
                            <span className="text-sm font-normal text-gray-600">{item.unit}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        {getExpiryBadge(item.expiryDate)}
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(item)}
                            className="h-9 w-9 p-0"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInventoryItem(item.id)}
                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredInventory.length === 0 && (
                <div className="text-center py-16 text-gray-500">
                  <Refrigerator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>食材がありません</p>
                  <p className="text-sm mt-2">右上のボタンから追加しましょう</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="fridge" className="mt-4">
              <FridgeVisualizer inventory={inventory} />
            </TabsContent>
          </Tabs> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
