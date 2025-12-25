import { combineReducers } from "redux";
import getClientProfileReducer from "./slices/getClientProfileSlice";
import conversationReducer from "./slices/conversationSlice";
const rootReducer = combineReducers({
  clientProfile: getClientProfileReducer,
  conversations: conversationReducer,
});
export default rootReducer;
