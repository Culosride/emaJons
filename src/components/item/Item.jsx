import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMedia, toggleFullscreen } from '../../features/posts/postsSlice';

export default function Item({ url, slideIndex, dataValue, type, id, className, toggleFullScreen}) {
  const dispatch = useDispatch()
  const [isVideo, setIsVideo] = useState(false)

  let content

  useEffect(() => {
    const video = document.querySelector(".slick-active video")
    if(video) {
      setIsVideo(true)
      dispatch(setCurrentMedia(true))
    } else {
      setIsVideo(false)
      dispatch(setCurrentMedia(false))
    }
  }, [slideIndex])

    isVideo ?
    content = (
      <div className={className} id={id}>
        <img src={url} data-value={dataValue}/>
      </div>
      ) :
    content = (
      <div onClick={toggleFullScreen} className={className} id={id}>
        <img src={url} data-value={dataValue}/>
      </div>
      )

  // if(type === "video") {
  //   content = (
  //     <div className={className} id={id}>
  //       <video controls>
  //         <source src={url} type="video/mp4"/>
  //         <source src={url} type="video/mov"/>
  //       </video>
  //     </div>
  //   )
  // } else {
  //   isVideo ?
  //   content = (
  //     <div className={className} id={id}>
  //       <img src={url} data-value={dataValue}/>
  //     </div>
  //     ) :
  //   content = (
  //     <div onClick={toggleFullScreen} className={className} id={id}>
  //       <img src={url} data-value={dataValue}/>
  //     </div>
  //     )
  // }

  return content
}
