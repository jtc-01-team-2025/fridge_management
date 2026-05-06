import "../styles/Homepage.css";
const Header = ({ title, userId }: { title: string; userId: string }) => {
  return (
    <>
      <header className="home-mobile-header">
        <div className="home-mobile-header-inner">
          <h1 className="home-mobile-title">{title}</h1>
          <span className="home-mobile-user">ID: {userId}</span>
        </div>
      </header>
    </>
  );
};

export default Header;
