import React from 'react';
import { useSelector } from "react-redux"; // hook to select data from redux store

export default function Image(props) {
  

  return (
    <img src={props.url} alt="" />
  )
}
