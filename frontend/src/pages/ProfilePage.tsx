import { ChefHat, Globe, Heart } from "lucide-react";
import Header from "../components/Header";
import "../styles/ProfilePage.css";
export type Language = "ja" | "en" | "zh" | "ko";

const ProfilePage = ({ userId }: { userId: string }) => {
  const languageNames: Record<Language, string> = {
    ja: "日本語",
    en: "English",
    zh: "中文",
    ko: "한국어",
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
              <select name="language" id="language" className="card-select">
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
                <Heart className="profile-icon-md" />
                食事の好み
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
