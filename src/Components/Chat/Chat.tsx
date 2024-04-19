import { useEffect, useRef, useState } from "react";

import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  collection,
  deleteField,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/slices/currentUser";
import ChatHeader from "./ChatHeader";
import { Button, Divider } from "@mui/material";
import isNewDate from "../../utils/isNewDate";
import getDateFromTimestamp from "../../utils/getDateFromTimestamp";
import Loader from "../Loader";
import sendMessageToDB from "../../utils/sendMessageToDB";
import { db } from "../../firebase-config";
import { selectActiveChat } from "../../redux/slices/chats";

export interface MessageAuthor {
  email: string | null;
  displayName: string | null;
  avatarURL: string | null;
}

export interface Timestamp {
  nanoseconds: number;
  seconds: number;
}

export interface MessageData {
  id: string;
  messageText: string;
  author: MessageAuthor;
  serverTime: Timestamp;
}

const Chat = () => {
  const [chatDocRef, setChatDocRef] = useState<DocumentReference>(
    doc(db, "chats/mainChat")
  );
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useAppSelector(selectCurrentUser);
  const { id: activeChatID } = useAppSelector(selectActiveChat);
  const scrollable = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeChatID) return;
    const newChatDocRef = doc(db, `chats/${activeChatID}`);
    setChatDocRef(newChatDocRef);
  }, [activeChatID]);

  const test = async () => {};

  const deleteMessage = async (
    chatRef: DocumentReference<DocumentData, DocumentData>,
    messageId: string
  ) => {
    await updateDoc(chatRef, {
      [`messages.${messageId}`]: deleteField(),
    });
  };

  const subOnChanges = () => {
    const displayData = (doc: DocumentSnapshot<DocumentData, DocumentData>) => {
      if (doc.metadata.hasPendingWrites) {
        console.log("local data");
      }

      const docData = doc.data();
      /* Документ отсутсвует или нет поля с сообщениями */
      if (!doc.exists() || !docData?.messages) {
        setMessages([]);
        setIsLoading(false);
        return;
      }

      const messages = Object.values(docData.messages) as MessageData[];
      console.log("Current data: ", docData);
      setMessages(messages);
      setIsLoading(false);
    };

    /*     const q = query(collection(db, "chats"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => console.log(doc.id));
    }); */
    const unsub = onSnapshot(chatDocRef, displayData);
    return unsub;
  };

  useEffect(() => {
    const unsub = subOnChanges();
    return () => {
      setIsLoading(true);
      unsub();
    };
  }, [chatDocRef]);

  const scrollToBottom = () => {
    const node = scrollable.current;
    node?.scrollTo(0, node.scrollHeight);
  };

  const sortedMessages = messages.sort((a, b) => {
    if (!a.serverTime) return -1;
    return b.serverTime.seconds - a.serverTime.seconds;
  });

  return (
    <div className="pb-5 w-full grow mx-auto bg-slate-100 flex items-center flex-col overflow-y-auto">
      <ChatHeader />
      <div
        ref={scrollable}
        className="p-4  grow w-full flex flex-col-reverse gap-4 overflow-y-auto relative"
      >
        {isLoading ? (
          <Loader color="black" />
        ) : (
          sortedMessages.map((m, i, arr) => {
            let newDate =
              Boolean(arr[i + 1]) &&
              Boolean(m.serverTime) &&
              isNewDate(m.serverTime.seconds, arr[i + 1].serverTime.seconds);
            if (i === arr.length - 1) {
              newDate = true;
            }
            return (
              <div key={m.id}>
                {newDate && (
                  <Divider sx={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
                    {m.serverTime && getDateFromTimestamp(m.serverTime.seconds)}
                  </Divider>
                )}
                <Message
                  author={m.author}
                  text={m.messageText}
                  timestamp={m.serverTime}
                  deleteMessage={() => deleteMessage(chatDocRef, m.id)}
                />
              </div>
            );
          })
        )}
      </div>
      <MessageInput
        scroll={scrollToBottom}
        sendMessage={(messageText) => {
          sendMessageToDB(messageText, chatDocRef, currentUser);
        }}
      />
      <Button onClick={test}>Test</Button>
    </div>
  );
};

export default Chat;
