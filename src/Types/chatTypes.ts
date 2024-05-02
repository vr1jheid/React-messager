import { MessageData } from "./messageTypes";

export enum ChatTypes {
  dialog = "dialog",
  group = "group",
}

export interface ChatDataDB {
  id: string;
  members: string[];
  lastMessage?: MessageData;
  type: ChatTypes | null;
}

export interface LocalChatData extends ChatDataDB {
  messages: MessageData[];
  isLoading: boolean;
}
