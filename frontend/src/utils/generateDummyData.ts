import { foodNames } from "../constants";

interface InventoryItem {
  name: string;
  expiry: string;
  isUrgent: boolean;
}

const randomFoodName = (): string => {
  return foodNames[Math.floor(Math.random() * foodNames.length)];
};

const randomExpiry = (): string => {
  const now = new Date();
  const offsetDays = Math.floor(Math.random() * 11);
  now.setDate(now.getDate() + offsetDays);
  return `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`;
};

const randomUrgent = (): boolean => {
  return Math.random() < 0.5;
};

export const generateTestItems = (n: number): InventoryItem[] => {
  return Array.from({ length: n }).map(() => ({
    name: randomFoodName(),
    expiry: randomExpiry(),
    isUrgent: randomUrgent(),
  }));
};
