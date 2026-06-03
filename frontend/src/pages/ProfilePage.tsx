import { ChefHat, Globe, Heart, User } from "lucide-react";
import Header from "../components/Header";
import "../styles/ProfilePage.css";
import { useEffect, useState } from "react";
import type { Language, UserProfile } from "../types/FoodType";
import {
  allergyOptions,
  API_BASE_URL,
  budgetOptions,
  cookingFrequencyOptions,
  dietaryOptions,
  languageNames,
} from "../constants";
import { fetchProfile } from "../Client";

const ProfilePage = ({ userId }: { userId: string }) => {
  const [language, setLanguage] = useState<Language>("ja");
  const [familySize, setFamilySize] = useState(1);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [cookingFrequency, setCookingFrequency] = useState<string>("");
  const [budgetLevel, setBudgetLevel] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const profile = await fetchProfile(userId);
        if (!cancelled && profile) {
          updateProfile(profile);
        }
      } catch (e) {
        console.error("ユーザープロフィール取得失敗", e);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const updateProfile = async (profileData: UserProfile) => {
    setLanguage(profileData.language);
    setFamilySize(profileData.family_size);
    setSelectedDietary(profileData.dietary);
    setSelectedAllergies(profileData.allergies);
    setCookingFrequency(profileData.cooking_frequency);
    setBudgetLevel(profileData.budget);
  };
  
  const toggleDietary = (option: string) => {
    setSelectedDietary((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
    );
  };

  const toggleAllergy = (option: string) => {
    setSelectedAllergies((prev) =>
      prev.includes(option) ? prev.filter((v) => v !== option) : [...prev, option]
    );
  };

  const handleSave = async () => {
    const response = await fetch(`${API_BASE_URL}/profile/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        language,
        user_id: userId,
        family_size: familySize,
        dietary: selectedDietary,
        allergies: selectedAllergies,
        cooking_frequency: cookingFrequency,
        budget: budgetLevel,
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`POST /profile failed: ${response.status} ${body}`);
    }
    const data = await response.json();
    updateProfile(data).then(() => console.log("Profile updated:", data));
  };

  return (
    <>
      <Header title="プロフィール" userId={userId} />
      <div className="profile-list">
        <div className="profile-stack">
          <div className="card">
            <div className="card-header">
              <div className="profile-card-title-row">
                <Globe className="profile-icon-md" />
                言語
              </div>
            </div>
            <div className="card-content">
              <select
                name="language"
                id="language"
                className="card-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
              >
                {(Object.keys(languageNames) as Language[]).map((lang) => (
                  <option key={lang} value={lang}>
                    {languageNames[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="profile-card-title-row">
                <User className="profile-icon-md" />
                基本情報
              </div>
            </div>
            <div className="card-content">
              <div>
                <label className="profile-label">家族の人数</label>
                <div className="chip-wrap">
                  <input
                    type="number"
                    placeholder="人数"
                    className="card-input"
                    min="1"
                    value={familySize}
                    onChange={(e) => setFamilySize(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="profile-card-title-row">
                <Heart className="profile-icon-md" />
                食事の好み
              </div>
            </div>
            <div className="card-content card-content-stack">
              <div>
                <label className="profile-label">食事スタイル</label>
                <div className="chip-wrap">
                  {dietaryOptions.map((option) => {
                    const isActive = selectedDietary.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleDietary(option)}
                        className={`choice-chip ${isActive ? "choice-chip-dietary-active" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="profile-label">アレルギー</label>
                <div className="chip-wrap">
                  {allergyOptions.map((option) => {
                    const isActive = selectedAllergies.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleAllergy(option)}
                        className={`choice-chip ${isActive ? "choice-chip-allergy-active" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <div className="profile-card-title-row">
                <ChefHat className="profile-icon-md" />
                ライフスタイル
              </div>
            </div>
            <div className="card-content card-content-stack">
              <div>
                <label className="profile-label">料理の頻度</label>
                <select
                  name="cookingFrequency"
                  id="cookingFrequency"
                  className="card-select"
                  onChange={(e) => setCookingFrequency(e.target.value)}
                  value={cookingFrequency}
                >
                  {cookingFrequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="profile-label">予算</label>
                <select
                  name="budget"
                  id="budget"
                  className="card-select"
                  onChange={(e) => setBudgetLevel(e.target.value)}
                  value={budgetLevel}
                >
                  {budgetOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <button type="button" onClick={handleSave} className="save-button">
          保存
        </button>
      </div>
    </>
  );
};

export default ProfilePage;
