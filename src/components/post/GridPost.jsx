import React from "react"

export default function GridPost ({ image }) {

  return (
    <>
      {image &&
        <div className="post">
          <img src={image.imageUrl} alt={image.publicId} />
        </div>
      }
    </>
)};
