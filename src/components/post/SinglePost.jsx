import React from "react"
import Image from "../image/Image"

export default function Post (props) {
  const pics = props.images.map(img => <Image key={img.publicId} url={img.imageUrl}/>)
  const tags = props.tags.map(tag => tag)

  return (
    <div className="posts-container">
      <div className="text-container">
        <h1 className="title">{props.title}</h1>
        <p className="subtitle">{props.subtitle}</p>
        <p className="content">{props.content}</p>
        {pics}
        {tags}
      </div>
    </div>
  )
}
