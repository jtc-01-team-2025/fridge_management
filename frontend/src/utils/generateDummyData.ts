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
  return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
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
  return Array.from({ length: n }).map(() => ({
    id: n,
    name: randomFoodName(),
    date_expiration: randomExpiry(),
  }));
};
