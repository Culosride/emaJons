import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  createPost,
  editPost,
  fetchPostById,
  setCurrentPost,
} from "../../features/posts/postsSlice";
import {
  fetchAllTags,
  toggleTag,
  resetTags,
} from "../../features/tags/tagsSlice";
import { useSelector, useDispatch } from "react-redux";
import TagsInputForm from "../tag/TagsInputForm";
const _ = require("lodash");

export default function PostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const selectedTags = useSelector((state) => state.tags.selectedTags);
  const currentPost = useSelector((state) => state.posts.currentPost);
  const postId = currentPost._id;
  const [error, setError] = useState(null);
  const [mediaElements, setMediaElements] = useState([]);
  const [previewElement, setPreviewElement] = useState([]);
  const [postData, setPostData] = useState({
    title: "",
    subtitle: "",
    content: "",
    media: [],
    category: "",
    postTags: [],
    previewImg: "",
  });

  const editPage = pathname.includes("edit");

  useEffect(() => {
    dispatch(resetTags());
    dispatch(fetchAllTags()).then(() => {
      if (editPage) {
        dispatch(fetchPostById(params.postId)).then((res) => {
          setPostData(res.payload);
          // setPostPreviewImg(res.payload.previewImg)
          res.payload.postTags.forEach((tag) => {
            dispatch(toggleTag(tag));
          });
        });
      } else {
        dispatch(setCurrentPost(""));
        dispatch(resetTags());
        setPostData({
          title: "",
          subtitle: "",
          content: "",
          media: [],
          category: "",
          postTags: [],
          previewImg: "",
        });
      }
    });
  }, [editPage]);

  // create media preview
  useEffect(() => {
    // setPreviewElement(
    //   postData.previewImg && (
    //       <img
    //         className="post-preview-img"
    //         src={
    //           postData.previewImg.publicId
    //             ? postData.previewImg.url
    //             : URL.createObjectURL(postData.previewImg)
    //         }
    //       />
    //   )
    // );

    setMediaElements(
      postData.media.map((file, i) => {
        const mediaKey = file.publicId ? "publicId" : "lastModified";
        const src = file.publicId ? file.url : URL.createObjectURL(file);
         // if mediaType is video, tranforms the extension from mp4 to jpg to display a preview
      let transformedUrl = src.replace(".mp4", ".jpg");
      // transformedUrl = transformedUrl + ".jpg"
      // const url = post.media[0].mediaType === "video" ? transformedUrl : post.media[0].url
      console.log('transformedUrl', transformedUrl)
      console.log('src', src)
        return (
          <div key={`media-${i}`} className="preview-media">
            <img src={transformedUrl} />
            <i id={file[mediaKey]} onClick={deleteMedia}></i>
          </div>
        );
      })
    );
  }, [postData.media, postData.previewImg]);

  // delete media from preview
  const deleteMedia = (e) => {
    const { id } = e.target;
    const updatedMedia = postData.media.filter((file) => {
      const mediaKey = file.publicId ? "publicId" : "lastModified";
      return file[mediaKey].toString() !== id;
    });
    setPostData((prev) => ({
      ...prev,
      media: updatedMedia,
    }));
  };

  function handleChange(e) {
    setError("");
    const { name, value, files } = e.target;

    setPostData((prev) => {
      if (name === "previewImg") {
        // return { ...prev, previewImg: files[0] };
      } else if (name === "media") {
        return { ...prev, media: [...prev.media, ...files] };
      } else {
        return { ...prev, [name]: value };
      }
    });
  }

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postData.category) {
      setError("Select a category");
      return;
    } else if (!postData.media.length) {
      setError("A post with no pictures?");
      return;
    }
    const formData = new FormData();
    Object.keys(postData).map((key) => {
      if (key === "media") {
        return postData.media.map((med) => formData.append("media", med));
      // } else if (key === "previewImg") {
      //   return formData.append("previewImg", postData.previewImg);
      } else if (key === "postTags") {
        return selectedTags.map((tag) => formData.append("postTags", tag));
      } else {
        return formData.append(key, postData[key]);
      }
    });
    dispatch(createPost(formData)).then((res) => {
      if (!res.error) {
        navigate(`/${postData.category}/${res.payload._id}`);
      }
    });
  };
  // edit post
  function handleEdit(e) {
    e.preventDefault();
    if (!postData.category) {
      setEmptyCategory(true);
      return;
    } else if (!postData.media.length) {
      setError("A post with no pictures?");
      return;
    }
    const formData = new FormData();

    Object.keys(postData).map((key) => {
      if (key === "media") {
        return postData.media.map((med) => {
          med.name
            ? formData.append("media", med)
            : formData.append("media", JSON.stringify(med));
        });
      } else if (key === "previewImg") {
        // if (postData.previewImg.name) {
        //   formData.append("previewImg", postData.previewImg);
        // } else {
        //   formData.append("previewImg", JSON.stringify(postData.previewImg));
        // }
      } else if (key === "postTags") {
        return selectedTags.forEach((tag) => formData.append("postTags", tag));
      } else {
        return formData.append(key, postData[key]);
      }
    });
    dispatch(editPost({ formData, postId })).then((res) => {
      if (!res.error) {
        navigate(`/${postData.category}/${res.payload._id}`);
      }
    });
  }

  // const previewImgContent = postData.previewImg ? (
  //   previewElement
  // ) : (
  //   <div className="preview-img-placeholder">
  //     <h3 className="preview-img-text">POST PREVIEW IMAGE</h3>
  //   </div>
  // );

  return (
    <div className="form-wrapper">
      {error && <p className="error-msg">{error}</p>}
      <form
        className="post-form"
        onSubmit={editPage ? handleEdit : handleSubmit}
      >
        <div className="post-form-layout">
          {/* <label className="custom-file-button" htmlFor="previewImg">Choose preview image (only for preview)</label>
          <input
            className="hidden-file-input"
            id="previewImg"
            type="file"
            onChange={handleChange}
            accept="image/*"
            name="previewImg"
            title="upload preview"
            />
          <div className="post-preview-img-container">{previewImgContent}</div> */}
          <label className="custom-file-button" htmlFor="media">Choose media</label>
          <input
            className="hidden-file-input"
            type="file"
            id="media"
            onChange={handleChange}
            name="media"
            title="upload media"
            multiple
          />
          <div className="media-preview-container">{mediaElements}</div>
        </div>

        <div className="post-form-layout">
          <fieldset>
            <input
              className="title"
              type="text"
              placeholder="ADD A TITLE"
              value={postData.title}
              name="title"
              onChange={handleChange}
            />
            <input
              type="text"
              className="subtitle"
              placeholder="Add a subtitle"
              value={postData.subtitle}
              name="subtitle"
              onChange={handleChange}
            />
            <textarea
              className="content"
              rows="6"
              placeholder="Add content ..."
              value={postData.content}
              name="content"
              onChange={handleChange}
            />

            <hr />

            <select
              value={postData.category}
              name="category"
              id="categories"
              onChange={handleChange}
            >
              <option disabled hidden value="">
                Please choose a category
              </option>
              <option value="Walls">Walls</option>
              <option value="Paintings">Paintings</option>
              <option value="Sketchbooks">Sketchbooks</option>
              <option value="Video">Video</option>
              <option value="Sculptures">Sculptures</option>
            </select>
          </fieldset>

          <TagsInputForm />

          <input
            className="btn-submit"
            type="submit"
            value={editPage ? "Save changes " : "Create new post"}
          />
        </div>
      </form>
    </div>
  );
}
