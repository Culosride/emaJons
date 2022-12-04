import { combineReducers } from "redux";
import posts from "./posts";


// would be posts: posts but key = value
export default combineReducers({ posts: posts });
