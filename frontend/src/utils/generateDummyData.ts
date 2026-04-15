import { foodNames } from "../constants";
import type { FoodTypeNew } from "../types/FoodType";

// interface InventoryItem {
//   name: string;
//   expiry: string;
//   isUrgent: boolean;
// }

const randomFoodName = (): string => {
  return foodNames[Math.floor(Math.random() * foodNames.length)];
};

const randomExpiry = (): string => {
  const now = new Date();
  const offsetDays = Math.floor(Math.random() * 11);
  now.setDate(now.getDate() + offsetDays);
  // return ISO-like YYYY-MM-DD for consistency with parsing elsewhere
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// const randomUrgent = (): boolean => {
//   return Math.random() < 0.5;
// };

// export const generateTestItems = (n: number): FoodType[] => {
//   return Array.from({ length: n }).map(() => ({
//     itemID: n,
//     name: randomFoodName(),
//     category: "",
//     date_expiration: randomExpiry(),
//     date_purchase: randomExpiry(),
//     // isUrgent: randomUrgent(),
//   }));
// };

// 12/19 一旦この機能にする
export const generateTestItems = (n: number): FoodTypeNew[] => {
  return Array.from({ length: n }).map((_, index) => ({
    id: index + 1,
    name: randomFoodName(),
    date_expiration: randomExpiry(),
    quantity: Math.floor(Math.random() * 5) + 1,
  }));
};
