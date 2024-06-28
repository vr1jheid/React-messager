import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useEffect } from "react";
import { MessageData, MessageDataDB } from "../Types/messageTypes";
import { useAppDispatch, useAppSelector } from "../Store/hooks";
import {
  addMessage,
  selectActiveChatID,
  /*   setMessages, */
} from "../Store/ActiveChat/activeChat";
import { convertServerTime } from "../utils/convertServerTime";
import { db } from "../main";

export const useSubChat = () => {
  const dispatch = useAppDispatch();
  const activeChatID = useAppSelector(selectActiveChatID);
  if (!activeChatID) return;

  useEffect(() => {
    const subOnMessages = () => {
      const q = query(collection(db, `chats/${activeChatID}/messages`));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach(async (change) => {
          const message = change.doc.data() as MessageDataDB;
          if (!message.id) return;
          const validMessage: MessageData = {
            ...message,
            serverTime: convertServerTime(message.serverTime),
          };
          if (change.type !== "modified") return;

          dispatch(addMessage(validMessage));

          /*    await updateDoc(doc(db, )); */
        });
      });

      return unsubscribe;
    };
    const unsub = subOnMessages();
    return () => {
      unsub();
    };
  }, [activeChatID]);
};
