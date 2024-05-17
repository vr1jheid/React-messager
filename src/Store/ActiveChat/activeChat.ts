import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatDataDB, ChatTypes, LocalChatData } from "../../Types/chatTypes";
import { createChat } from "../Chats/thunks/createChat";
import { MessageData } from "../../Types/messageTypes";

const initialState: LocalChatData = {
  id: "",
  members: [],
  type: ChatTypes.group,
  messages: [],
  isLoading: false,
};

const activeChatSlice = createSlice({
  name: "activeChat",
  initialState,
  selectors: {
    selectActiveChat: (state) => state,
    selectActiveChatLoading: (state) => state.isLoading,
    selectActiveChatID: (state) => state.id,
  },
  reducers: {
    setActive: (_state, action: PayloadAction<ChatDataDB>) => {
      const { lastMessage, ...newActiveChat } = action.payload;
      return { ...newActiveChat, messages: [], isLoading: true };
    },
    setMessages: (state, action: PayloadAction<MessageData[]>) => {
      state.messages = action.payload
        .sort((a, b) => b.serverTime!.seconds! - a.serverTime!.seconds)
        .reverse();
      state.isLoading = false;
    },
    addMessage: (state, action: PayloadAction<MessageData>) => {
      const existableMsgIndex = state.messages.findIndex(
        (m) => m.id === action.payload.id
      );
      if (existableMsgIndex !== -1) {
        state.messages[existableMsgIndex] = action.payload;
        return;
      }
      state.messages.push(action.payload);
    },
    clearActiveChat: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createChat.fulfilled, (_state, action) => {
      return { ...action.payload, messages: [], isLoading: false };
    });
  },
});

export const { setActive, addMessage, setMessages, clearActiveChat } =
  activeChatSlice.actions;

export const { selectActiveChat, selectActiveChatLoading, selectActiveChatID } =
  activeChatSlice.selectors;

export default activeChatSlice.reducer;