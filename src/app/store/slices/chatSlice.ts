import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string | number | null;
  chats: ChatMessage[];
}

interface ChatState {
  currentConversation: Conversation | null;
  messages: ChatMessage[];
  loading: boolean;
  streaming: boolean;
  partialBotMessage: string;
}

const initialState: ChatState = {
  currentConversation: null,
  messages: [],
  loading: false,
  streaming: false,
  partialBotMessage: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Load existing conversation from DB/API
    setCurrentConversation(state, action: PayloadAction<Conversation | null>) {
      state.currentConversation = action.payload;
      state.messages = action.payload?.chats || [];
    },

    // User sends message
    addUserMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        role: "user",
        content: action.payload,
      });
    },

    // Bot final response (non-streamed)
    addBotMessage(state, action: PayloadAction<string>) {
      state.messages.push({
        role: "assistant",
        content: action.payload,
      });
      state.partialBotMessage = "";
      state.streaming = false;
    },

    // Streaming: append partial text
    appendPartialBotMessage(state, action: PayloadAction<string>) {
      state.streaming = true;
      state.partialBotMessage += action.payload;
    },

    // Finalize streamed message → push into messages[]
    finalizeBotMessage(state) {
      if (state.partialBotMessage.trim().length > 0) {
        state.messages.push({
          role: "assistant",
          content: state.partialBotMessage,
        });
      }
      state.partialBotMessage = "";
      state.streaming = false;
    },

    // Loading flag for UI
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Clear messages but keep conversation ID
    clearChat(state) {
      state.messages = [];
      state.partialBotMessage = "";
      state.streaming = false;
    },

    // Hard reset conversation
    resetConversation(state) {
      state.currentConversation = null;
      state.messages = [];
      state.partialBotMessage = "";
      state.streaming = false;
      state.loading = false;
    },
  },
});

export const {
  setCurrentConversation,
  addUserMessage,
  addBotMessage,
  appendPartialBotMessage,
  finalizeBotMessage,
  setLoading,
  clearChat,
  resetConversation,
} = chatSlice.actions;

export default chatSlice.reducer;
