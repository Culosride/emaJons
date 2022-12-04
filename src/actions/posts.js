import * as api from "../API"

// Actions creators: functions that return actions
// using thunk as middleware to use async function (async dispatch)
// Instead of returning the action, it gets dispatched

export const getPosts = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts()  // we get the response from the api and deconstruct it (always contains data)
    dispatch({ type: "FETCH_ALL", payload: data });
  } catch (error) {
    console.log(error)
  }
}
