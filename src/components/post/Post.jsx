import React from "react"

export default function Post (props) {
  const imagesEl = props.images.map(image => {
    return <img
      src={image.imageUrl}
      key={image.publicId}
      alt={image.publicId}
    />
  })

  return (
    <div className="post-container">
      <div>
        <div className="images-container">{imagesEl}</div>
        <div className="text-container">
          <h1 className="title">{props.title}</h1>
          <p className="subtitle">{props.subtitle}</p>
          <p className="content">{props.content}</p>
        </div>
      </div>
    </div>
  )
}
