import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import Item from '../item/Item';
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

  // only happens once post state is loaded
  // const imageElements = post.images && post.images.map(image => (
  //   <Item key={image.publicId} imageUrl={image.imageUrl} />
  // ))

  return (
      <div className="post-container">
        <div>
          {post.images &&
            <Carousel className="images-container" images={post.images}>
            </Carousel>
          }
          <div className="text-container">
            <h1 className="title">{post.title}</h1>
            <p className="subtitle">{post.subtitle}</p>
            <p className="content">{post.content}</p>
          </div>
        </div>
      </div>
  )
}
