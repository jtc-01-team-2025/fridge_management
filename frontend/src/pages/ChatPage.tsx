import Header from "../components/Header";
import "../styles/ChatPage.css";
export const ChatPage = ({ userId }: { userId: string }) => {
  return (
    <>
      <Header title="相談" userId={userId} />
    </>
  );
};
