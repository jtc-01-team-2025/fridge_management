import "../styles/PopUp.css";

type PopUpProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
const PopUp: React.FC<PopUpProps> = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="popup" onClick={(e) => e.stopPropagation()}>
        {children}
        <button className="closeButton" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default PopUp;
