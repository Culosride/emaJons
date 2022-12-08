import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Carousel from '../carousel/Carousel';

export default function Post() {
  const params = useParams()
  const [post, setPost] = useState([])

  // is loaded after HTML from current and child component is loaded
  useEffect(() => {
    async function loadPost() {
      const response = await Axios.get(`/api/posts/${params.category}/${params.postId}`)
      setPost(response.data)
    }
    loadPost()
  }, [])

  return (
      <div className="post-container">
        {post.images &&
          <Carousel className="images-container" images={post.images}>
          </Carousel>
        }
          <div className="text-container">
          <div>
            <div className="headline">
              <div>
                <h1 className="title">{post.title}</h1>
                {post.subtitle && <p className="subtitle">{post.subtitle}</p>}
              </div>
            </div>
            {post.content && <p className="content">{post.content}</p>}
          </div>
          </div>
      </div>
  )
}
