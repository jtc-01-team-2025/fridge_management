import { Users } from "lucide-react";
import Header from "../components/Header";
import "../styles/RecipePage.css";
export const RecipePage = ({ userId }: { userId: string }) => {
  return (
    <>
      <Header title="レシピ" userId={userId} />
      <div className="recipe-page">
        <div className="recipe-page-inner">
          <div className="recipe-hero-card">
            <div className="recipe-hero-row">
              <div>
                <h3 className="recipe-hero-label">今ある食材で</h3>
                {/* <p className="recipe-hero-count">{canMakeCount}個のレシピが作れます</p>
                 */}
                <p className="recipe-hero-count">0個のレシピが作れます</p>
              </div>
              <div className="recipe-hero-icon-wrap">
                <Users className="recipe-hero-icon" />
              </div>
            </div>
            {/* {userProfile.familySize > 1 && (
              <p className="recipe-hero-sub">{userProfile.familySize}人分に調整済み</p>
            )}*/}
          </div>
        </div>
      </div>
    </>
  );
};
