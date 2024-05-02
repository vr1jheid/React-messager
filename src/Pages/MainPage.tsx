import ChatsList from "../Components/Chat selection/ChatsList";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import { selectCurrentUser } from "../Store/slices/currentUser";
import SearchUser from "../Components/Chat selection/SearchUser";
import Chat from "../Components/Chat/Chat";
import { fetchChats } from "../Services/fetchChats";
import { clearActiveChat, selectActiveChat } from "../Store/slices/chats";

const MainPage = () => {
  const dispatch = useAppDispatch();
  const { email: currentUserEmail } = useAppSelector(selectCurrentUser);
  const { id: activeChatID } = useAppSelector(selectActiveChat);
  const containerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChats(currentUserEmail!));
  }, []);

  useEffect(() => {
    const clearActiveChatFunc = (e: KeyboardEvent) => {
      console.log(activeChatID);

      if (e.code === "Escape" && activeChatID) {
        dispatch(clearActiveChat());
      }
    };
    window.addEventListener("keydown", clearActiveChatFunc);

    return () => {
      window.removeEventListener("keydown", clearActiveChatFunc);
    };
  }, [activeChatID]);

  return (
    <div ref={containerRef} className="grow max-h-screen flex pt-[82px]">
      <div className="min-w-[25%] p-3 flex flex-col gap-5 bg-gray-light border-r-2 border-solid  border-gray-very-light ">
        <SearchUser />
        <ChatsList />
      </div>
      <div className={`bg-gray-dark grow max-h-full bg-cats-svg`}>
        {activeChatID && <Chat />}
      </div>
    </div>
  );
};

export default MainPage;
