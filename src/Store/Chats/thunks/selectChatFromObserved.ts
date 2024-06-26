import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { cacheMessages } from "../../ActiveChat/thunks/cacheMessages";
import { setInitialMessages } from "../../ActiveChat/thunks/setInitialMessages";
import { clearSizes } from "../../MessagesSizes/messagesSizes";
import { subOnChat } from "../../ActiveChat/thunks/subOnChat";
import { setActive } from "../../ActiveChat/activeChat";

export const selectChatFromObserved = createAsyncThunk(
  "test",
  (id: string, { getState, dispatch }) => {
    const { chats, activeChat } = getState() as RootState;
    if (id === activeChat.id) return;

    dispatch(cacheMessages());
    dispatch(setActive(chats[id]));
    dispatch(subOnChat({ action: "sub", chatID: id }));
    dispatch(setInitialMessages(chats[id]));
    dispatch(clearSizes());
  }
);
