import React from "react";

export default function Item({ url, dataValue, type, id, className, toggleFullScreen}) {
  let content

  if(type === "video") {
    content = (
      <video style={styles} controls>
        <source src={url} type="video/mp4"/>
        <source src={url} type="video/mov"/>
      </video>
    )
  } else {
    content = (
      <div onClick={toggleFullScreen} className={className} id={id}>
        <img src={url} data-value={dataValue}/>
      </div>
      )
  }
  return content
}
