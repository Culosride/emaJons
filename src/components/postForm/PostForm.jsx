import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createPost, editPost, fetchPostById, setCurrentPost } from "../../features/posts/postsSlice";
import { fetchAllTags, toggleTag, resetTags } from "../../features/tags/tagsSlice";
import { useSelector, useDispatch } from "react-redux";
import TagsInputForm from "../tag/TagsInputForm";
const _ = require("lodash");

export default function PostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const currentPost = useSelector((state) => state.posts.currentPost);
  const postId = currentPost._id;
  const selectedTags = useSelector((state) => state.tags.selectedTags);
  const editPage = pathname.includes("edit");
  const [error, setError] = useState(null);
  const [postData, setPostData] = useState({
    title: "",
    subtitle: "",
    content: "",
    media: [],
    category: "",
    postTags: [],
  });
  const [mediaElements, setMediaElements] = useState([]);

  useEffect(() => {
    dispatch(resetTags());
    dispatch(fetchAllTags()).then(() => {
      if (editPage) {
        dispatch(fetchPostById(params.postId)).then((res) => {
          setPostData(res.payload);
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
        });
      }
    });
  }, [editPage]);

  // create media preview
  useEffect(() => {
    setMediaElements(
      postData.media.map((file, i) => {
        const mediaKey = file.publicId ? "publicId" : "name";
        const src = file.publicId ? file.url : URL.createObjectURL(file);
        return (
          <div key={`media-${i}`} className="preview-media">
            <img src={src} />
            <i id={file[mediaKey]} onClick={deleteMedia}></i>
          </div>
        );
      })
    );
  }, [postData.media]);

  // delete media from preview
  const deleteMedia = (e) => {
    const { id } = e.target;
    const updatedMedia = postData.media.filter((file) => {
      const mediaKey = file.publicId ? "publicId" : "name";
      return file[mediaKey] !== id;
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
      if (name === "media") {
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

  return (
    <div className="form-wrapper">
      {error && <p className="error-msg">{error}</p>}
      <form
        className="post-form"
        onSubmit={editPage ? handleEdit : handleSubmit}
      >
        <div className="post-form-layout">
          <input
            type="file"
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
