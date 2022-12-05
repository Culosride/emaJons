
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import Post from "../post/Post"
import { selectAllPosts, fetchPosts, fetchPostsByCategory } from "../../features/posts/postsSlice";
const _ = require('lodash');

import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AllPosts() {
  const params = useParams();
  const dispatch = useDispatch()
  const posts = useSelector(state => state.posts.posts)
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)
  console.log("log from AllPosts", posts, "filtered")

  let postElements = []

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPostsByCategory(params.category))
    }
  }, [status, dispatch])

  const displayPosts = (posts) => {
    return posts.map((post) => {
      return <Link reloadDocument to={`/${params.category}/${post._id}`} id={post._id} key={post._id} >
        <img src={post.images[0].imageUrl}/>
      </Link>
    })
  }

  // if (status === 'loading') {
  //   postElements = <p>Loading...</p>
  // } else if (status === 'succeeded') {
  //   postElements = posts.map(post => <img src={post.images[0].imageUrl} alt="diocane" key={post._id}/>)
  // } else if (status === 'failed') {
  //   postElements = <div>{error}</div>
  // }


  return (
    <div>
      <div className="category-container">
        <div className="tags-container">
          <ul>
            {/* {tagElements} */}
          </ul>
        </div>
        {status === 'succeeded' && displayPosts(posts)}
        {/* {(posts.length !== 0) &&
          <div className="posts-grid">
            {
              filteredPosts.message && filteredPosts.message ||
              filteredPosts.length && displayPosts(filteredPosts) ||
              displayPosts(posts)
            }
          </div> ||
          <p>No posts yet</p>
        } */}
      </div>
    </div>
  )
}


// export default function GridPost () {
//   const dispatch = useDispatch()
//   const posts = useSelector((state) => state.posts.posts)  // param for cb is state, since we get access to redux global store. we know we have access to state.posts from store.js
//   const status = useSelector(state => state.posts.status)
//   const error = useSelector(state => state.posts.error)

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchPosts())
//     }
//   }, [status, dispatch])

//   let postsElements;

//   if (status === 'loading') {
//     postsElements = <p>Loading...</p>
//   } else if (status === 'succeeded') {
//     // Sort posts chronologically
//     const orderedPosts = posts
//       .slice()
//       .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

//     postsElements = orderedPosts.map(post => <Post title={post.title} postsElements={post.postsElements} subtitle={post.subtitle} key={post._id} images={post.images} tags={post.postTags} />)
//   } else if (status === 'failed') {
//     postsElements = <div>{error}</div>
//   }

//   console.log(posts)

//   return (
//     <div>
//       {postsElements}
//     </div>
// )};
