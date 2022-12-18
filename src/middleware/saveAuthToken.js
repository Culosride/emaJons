// import * as api from "../API/index"
// import { useDispatch } from "react-redux"
// import { setCredentials } from "../features/auth/authSlice"

// export const saveAuthToken = store => next => async action => {
//   console.log(action.type)
//   if(action.type === "/posts/fulfilled") {
//     console.log("match")
//     const dispatch = useDispatch()
//     const token = store.getState().auth.token
//     const decoded = jwt_decode(token)
//     const isExpired = decoded.exp < Date.now()/1000
//     req.headers.Authorization = `Bearer ${token}`
//     if(!isExpired) return action

//     const response = await axios.get(`${baseURL}/auth/refresh/`);
//     req.headers.Authorization = `Bearer ${response.data.accessToken}`
//     dispatch(setCredentials(response.data.accessToken))
//   }
//   // continue processing this action
//   return next(action);
// }
