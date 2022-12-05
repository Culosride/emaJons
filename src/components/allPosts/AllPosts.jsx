
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // hook to select data from redux store
import Post from "./SinglePost"
import { fetchPosts } from "../../features/posts/postsSlice";
import Axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AllPosts() {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.posts)  // param for cb is state, since we get access to redux global store. we know we have access to state.posts from store.js
  const status = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)

  const params = useParams();
  // const [posts, setPosts] = useState([]);
  // const [tags, setTags] = useState([]);
  // const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts())
    }
  }, [status, dispatch])

  // useEffect(() => {
  //   async function loadData() {
  //     const posts = await Axios.get(`/api/posts/${params.category}`)
  //     setPosts(posts.data)
  //     const tags = await Axios.get(`/api/categories/${params.category}`)
  //     if (tags.data.length) setTags(tags.data[0].allTags)
  //   }
  //   loadData()
  // }, []);
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


  // const handleClick = (e) => {
  //   e.preventDefault();
  //   const filter = e.target.getAttribute('data-value');
  //   const filteredPosts = posts.filter((post) => {
  //     return post.postTags.includes(filter);
  //   })
  //   filteredPosts.length ? setFilteredPosts(filteredPosts) : setFilteredPosts({message: 'Sorry, no posts'});
  // }

  // const displayPosts = (selectedPosts) => {
  //   return selectedPosts && selectedPosts.map((post) => {
  //     return <Link reloadDocument to={`/${params.category}/${post._id}`} id={post._id} key={post._id} >
  //       {(post.images.length) ? <img src={post.images[0].imageUrl} /> : <p>{post.title}</p>}
  //     </Link>
  //   })
  // }

  // const tagElements = tags && tags.map((tag, i) => {
  //   return <li key={`${tag}-${i}`}>
  //     <a href={tag} data-value={`${tag}`} onClick={handleClick}>{tag}</a>
  //   </li>
  // })

  return (
    <div>
      <div className="category-container">
        <div className="tags-container">
          <ul>
            {/* {tagElements} */}
          </ul>
        </div>

        {content}
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

//   let content;

//   if (status === 'loading') {
//     content = <p>Loading...</p>
//   } else if (status === 'succeeded') {
//     // Sort posts chronologically
//     const orderedPosts = posts
//       .slice()
//       .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

//     content = orderedPosts.map(post => <Post title={post.title} content={post.content} subtitle={post.subtitle} key={post._id} images={post.images} tags={post.postTags} />)
//   } else if (status === 'failed') {
//     content = <div>{error}</div>
//   }

//   console.log(posts)

//   return (
//     <div>
//       {content}
//     </div>
// )};
