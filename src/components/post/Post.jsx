import React from "react"

export default function Post (props) {
  const imagesEl = props.images.map(image => <img src={image.imageUrl} alt={image.publicId} width="500" height="600"/>)

  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.subtitle}</p>
      <p>{props.content}</p>
      <p>{imagesEl}</p>
    </div>
  )
}
