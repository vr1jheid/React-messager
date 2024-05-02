import { createChat } from "../Services/createChat";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import { selectAllChats, setActive } from "../Store/slices/chats";
import { selectCurrentUser } from "../Store/slices/currentUser";
import { ChatTypes } from "../Types/chatTypes";

export const useActiveChat = (dialogPartnerEmail: string | null) => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectAllChats);
  const { email: currentUserEmail } = useAppSelector(selectCurrentUser);

  return () => {
    if (!dialogPartnerEmail) return;
    const entry = Object.entries(chats).find(
      ([, value]) =>
        value.type === ChatTypes.dialog &&
        value.members?.includes(dialogPartnerEmail)
    );
    if (entry) {
      /* Если диалог уже есть берем ссылку из массива диалогов */
      const [id] = entry;
      dispatch(setActive(id));
      return;
    }

    dispatch(createChat([currentUserEmail, dialogPartnerEmail]));
  };
};
