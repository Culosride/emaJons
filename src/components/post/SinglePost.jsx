import React from "react"
import Image from "../image/Image"

export default function Post () {

  const SinglePost = ({ match }) => {
    const { currentPostId } = match.params
  }
  const post = (state, currentPostId) =>
  state.posts.find(post => post._id === currentPostId)

  const pics = post.images.map(img => <Image key={img.publicId} url={img.imageUrl}/>);
  const tags = post.tags.map(tag => tag);

  return (
    <div className="posts-container">
      <div className="text-container">
        <h1 className="title">{post.title}</h1>
        <p className="subtitle">{post.subtitle}</p>
        <p className="content">{post.content}</p>
        {pics}
        {tags}
      </div>
    </div>
  )
}
