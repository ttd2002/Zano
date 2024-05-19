import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app";
import authReducer from "./slices/auth";
import messageReducer from './slices/messageSlice';
import userReducer from './slices/userSlice'
import chatReducer from "./slices/chatSlices";
import { configureStore } from "@reduxjs/toolkit";
// import conversationReducer from "./slices/conversationSlice";
import conversationReducer, { conversationPersistConfig } from './slices/createSingleCoversationSlice';
import { persistReducer } from "redux-persist";
// slices

const rootPeristConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whitelist: [],
  //blacklist: [],
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  messages: messageReducer,
  user: userReducer,
  chat: chatReducer,
  conversation: persistReducer(conversationPersistConfig, conversationReducer),
});

// Khởi tạo Redux Store
const store = configureStore({
  reducer: persistReducer(rootPeristConfig, rootReducer),
});

export { rootPeristConfig, rootReducer };
