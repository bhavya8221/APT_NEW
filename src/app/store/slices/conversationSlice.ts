import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { GetAllConversation } from "@/utils/api/Api";

// TS Interfaces -------------------------------------------------------------

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface Conversation {
  id: string | number;
  title?: string;
  chats: ChatMessage[];
  updatedAt?: string;
  createdAt?: string;
}

interface ConversationState {
  items: Conversation[];
  loading: boolean;
  error: string | null;
}

// Async Thunk --------------------------------------------------------------

export const fetchAllConversations = createAsyncThunk<
  Conversation[], // return type
  void, // arg type
  { rejectValue: string } // error type
>("conversations/fetchAll", async (_, { rejectWithValue }) => {
  try {
    // const token = localStorage.getItem("UserLoginTokenApt");
    const response = await GetAllConversation();

    const rawList = response.data?.data || [];

    // Normalize structure
    const normalized: Conversation[] = rawList.map((item: any) => ({
      id: item?.id,
      updatedAt: item?.updatedAt,
      createdAt: item?.createdAt,
      title: item?.title || "Conversation",
      chats:
        item?.chats?.map((msg: any) => ({
          role: msg?.role === "user" ? "user" : "assistant",
          content: msg?.content || "",
          createdAt: msg?.createdAt,
        })) || [],
    }));

    return normalized;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || "Failed to fetch conversations"
    );
  }
});

// Slice -------------------------------------------------------------------

const initialState: ConversationState = {
  items: [],
  loading: false,
  error: null,
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    resetConversations(state) {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllConversations.fulfilled,
        (state, action: PayloadAction<Conversation[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchAllConversations.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Could not fetch conversations";
      });
  },
});

export const { resetConversations } = conversationSlice.actions;
export default conversationSlice.reducer;
