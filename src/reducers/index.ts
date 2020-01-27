import { combineReducers } from "redux";

import eurRate from "./eurRate";
import gbpRate from "./gbpRate";
import usdRate from "./usdRate";

export default combineReducers({
  eurRate,
  gbpRate,
  usdRate
});
