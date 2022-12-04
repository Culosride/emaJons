import React from "react";
import { useSelector } from "react-redux"; // hook to select data from redux store
import Post from "./SinglePost"

export default function GridPost ({ image }) {
  const posts = useSelector((state) => state.posts)  // param for cb is state, since we get access to redux global store. we know we have access to state.posts from reducers/index.js

  console.log(posts)
  const postsEl = posts.map(post => <Post title={post.title} content={post.content} subtitle={post.subtitle} key={post._id} images={post.images} tags={post.postTags} />)
  return (
    <div>
      {postsEl}
    </div>
)};
