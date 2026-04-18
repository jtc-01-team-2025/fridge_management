export function useInventory() {
  // const deleteInventoryItem = (id: string) => {
  //   const item = inventory.find((i) => i.id === id);
  //   if (item) {
  //     // 消費履歴を記録
  //     const historyItem = purchaseHistory.find((h) => h.itemName === item.name && !h.consumedDate);
  //     if (historyItem) {
  //       setPurchaseHistory(
  //         purchaseHistory.map((h) =>
  //           h.id === historyItem.id
  //             ? { ...h, consumedDate: new Date().toISOString().split("T")[0] }
  //             : h
  //         )
  //       );
  //     }
  //   }
  //   setInventory(inventory.filter((item) => item.id !== id));
  // };

  return {
    // deleteInventoryItem
  };
}
