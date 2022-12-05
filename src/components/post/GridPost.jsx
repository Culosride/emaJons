import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import Post from "./SinglePost"
import { fetchPosts } from "../../features/posts/postsSlice";

export default function GridPost () {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.posts)  // param for cb is state, since we get access to redux global store. we know we have access to state.posts from store.js
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts())
    }
  }, [status, dispatch])

  let content;

  if (status === 'loading') {
    content = <p>Loading...</p>
  } else if (status === 'succeeded') {
    // Sort posts chronologically
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    content = orderedPosts.map(post => <Post title={post.title} content={post.content} subtitle={post.subtitle} key={post._id} images={post.images} tags={post.postTags} />)
  } else if (status === 'failed') {
    content = <div>{error}</div>
  }

  console.log(posts)

  return (
    <div>
      {content}
    </div>
)};
