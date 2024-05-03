import { memo, useEffect, useState } from "react";
import UserAvatar from "../Shared/UserAvatar";
import { useAppSelector } from "../../Store/hooks";
import { selectCurrentUser } from "../../Store/CurrentUser/currentUser";
import getUserFromDB from "../../Services/getUserFromDB";
import { ChatTypes } from "../../Types/chatTypes";
import { selectActiveChat } from "../../Store/ActiveChat/activeChat";

const ChatHeader = () => {
  const [headerData, setHeaderData] = useState({ chatName: "", avatarURL: "" });
  const activeChat = useAppSelector(selectActiveChat);
  const { email: currentUserEmail } = useAppSelector(selectCurrentUser);
  useEffect(() => {
    const setHeader = async () => {
      if (activeChat.type === ChatTypes.group) {
        setHeaderData({ ...headerData, chatName: activeChat.id });
        return;
      }

      const dialogPartnerEmail = activeChat.members.find(
        (m) => m !== currentUserEmail
      )!;
      const dialogPartnerData = await getUserFromDB(dialogPartnerEmail)!;
      if (!dialogPartnerData) return;

      setHeaderData({
        avatarURL: dialogPartnerData.avatarURL ?? "",
        chatName: dialogPartnerData.displayName ?? dialogPartnerData.email,
      });
    };
    setHeader();
  }, [activeChat.id]);

  return (
    <header className="flex w-full items-center justify-center gap-4 text-3xl p-2 bg-gray-light text-white">
      {headerData.chatName}
      <UserAvatar alt={headerData.chatName} src={headerData.avatarURL} />
    </header>
  );
};

export default memo(ChatHeader);
