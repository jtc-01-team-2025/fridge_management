import type { Language } from "../types/FoodType";

export const foodNames = [
  "りんご",
  "バナナ",
  "みかん",
  "ぶどう",
  "いちご",
  "レタス",
  "キャベツ",
  "にんじん",
  "じゃがいも",
  "玉ねぎ",
  "トマト",
  "ピーマン",
  "きゅうり",
  "鶏むね肉",
  "鶏もも肉",
  "豚バラ肉",
  "牛こま肉",
  "さけ",
  "さば",
  "たら",
  "卵",
  "牛乳",
  "ヨーグルト",
  "チーズ",
  "豆腐",
  "納豆",
  "味噌",
  "バター",
  "冷凍餃子",
  "冷凍うどん",
  "冷凍パスタ",
  "冷凍唐揚げ",
  "ハム",
  "ウインナー",
  "食パン",
  "おにぎり",
  "サラダチキン",
  "ツナ缶",
  "コーン缶",
];

export const categories = ["野菜", "果物", "肉類", "魚介類", "乳製品", "調味料", "飲料", "その他"];
export const FOOD_CATEGORIES = [
  { id: 1, label: "野菜" },
  { id: 2, label: "果物" },
  { id: 3, label: "肉類" },
  { id: 4, label: "魚介類" },
  { id: 5, label: "乳製品" },
  { id: 6, label: "卵" },
  { id: 7, label: "調味料" },
  { id: 8, label: "飲料" },
  { id: 9, label: "その他" },
];

export const locations = ["冷蔵", "冷凍", "常温"];

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const dietaryOptions: readonly string[] = [
  "ベジタリアン",
  "ヴィーガン",
  "低糖質",
  "低脂肪",
  "グルテンフリー",
];

export const allergyOptions: readonly string[] = [
  "卵",
  "乳製品",
  "小麦",
  "そば",
  "落花生",
  "えび",
  "かに",
  "大豆",
];

export const languageNames: Record<Language, string> = {
  ja: "日本語",
  en: "English",
  zh: "中文",
  ko: "한국어",
};

export const budgetOptions: readonly string[] = ["節約思考", "標準", "品質重視"];

export const cookingFrequencyOptions: readonly string[] = [
  "毎日",
  "週4-5回",
  "週2-3回",
  "週1回以下",
];
