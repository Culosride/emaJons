import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { createPost, editPost, fetchPostById, setCurrentPost } from "../../features/posts/postsSlice";
import { fetchAllTags, toggleTag, resetTags } from "../../features/tags/tagsSlice";
import { useSelector, useDispatch } from "react-redux";
import TagsInputForm from "../tag/TagsInputForm";
import Button from "../UI/Button";
import ErrorMsg from "../UI/ErrorMsg";
import { useScroll } from "../../hooks/useScroll";
const _ = require("lodash");


export default function PostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const selectedTags = useSelector((state) => state.tags.selectedTags);
  const currentPost = useSelector((state) => state.posts.currentPost);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const status = useSelector((state) => state.posts.status);

  const [errMsg, setErrMsg] = useState(null);
  const [currentFormTab, setCurrentFormTab] = useState("media")
  const [mediaElements, setMediaElements] = useState([]);
  const [postData, setPostData] = useState({
    title: "",
    subtitle: "",
    content: "",
    media: [],
    category: "",
    postTags: [],
  });

  // derived state
  const postId = currentPost._id;
  const isEditPage = pathname.includes("edit");
  const isLoading = status === "loading"
  const isSmallScreen = ["xs", "s"].includes(screenSize);

  const btnStyles = isLoading ? "btn--submit disabled" : "btn--submit";
  const submitBtnValue = isLoading
    ? "Submitting..."
    :  isEditPage
      ? "Save changes"
      : "Create new post";

  let content;

  const tabMenuRef = useRef(null)
  useScroll(tabMenuRef, _, { threshold: 40, scrollClass: "fade-top" })

  useEffect(() => {
    dispatch(resetTags());
    dispatch(fetchAllTags()).then(() => {
      if (isEditPage) {
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
  }, [isEditPage]);

  // create media preview
  useEffect(() => {
    setMediaElements(
      postData.media.map((file, i) => {
        const mediaKey = file.publicId ? "publicId" : "lastModified";
        let src = file.publicId ? file.url : URL.createObjectURL(file);
        if (file.mediaType === "video") src = file.url.replace("mp4", "jpg");

        return (
          <div key={`media-${i}`} className="preview-media">
            {file.type === "video/mp4"
              ? <video src={src} controls></video>
              : <img src={src} />}
            <div className="btn-prev-container">
              <Button id={file[mediaKey]} className="btn btn--delete" title="Delete" onClick={deleteMedia}>
                <span id={file[mediaKey]} className="icon icon--delete" onClick={deleteMedia}></span>
              </Button>
            </div>
          </div>
        );
      })
    );
  }, [postData.media]);

  // delete media from preview
  const deleteMedia = (e) => {
    e.preventDefault()
    console.log(e.target)
    const { id } = e.target;
    const updatedMedia = postData.media.filter((file) => {
      const mediaKey = file.publicId ? "publicId" : "lastModified";
      return file[mediaKey].toString() !== id;
    });
    setPostData((prev) => ({ ...prev, media: updatedMedia }));
  };

  const handleChange = (e) => {
    setErrMsg("");
    const { name, value, files } = e.target;

    setPostData((prev) => {
      if (name === "media") {
        return { ...prev, media: [...prev.media, ...files] };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return

    if (!postData.category) {
      setErrMsg("Select a category");
      window.scrollTo(0, 0)
      return;
    } else if (!postData.media.length) {
      setErrMsg("A post with nada?");
      window.scrollTo(0, 0)
      return;
    }

    try {
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
      const res = await dispatch(createPost(formData)); // await needed
      navigate(`/${postData.category}/${res.payload._id}`);
    } catch (error) {
      console.log(error);
    }
  };

  // edit post
  const handleEdit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    if (!postData.category) {
      setEmptyCategory(true);
      return;
    } else if (!postData.media.length) {
      setErrMsg("A post with no pictures?");
      return;
    }
    const formData = new FormData();

    try {
      Object.keys(postData).map((key) => {
        if (key === "media") {
          return postData.media.map((med) => {
            med.name
              ? formData.append("media", med)
              : formData.append("media", JSON.stringify(med));
          });
        } else if (key === "postTags") {
          return selectedTags.forEach((tag) =>
            formData.append("postTags", tag)
          );
        } else {
          return formData.append(key, postData[key]);
        }
      });
      await dispatch(editPost({ formData, postId }));
    } catch (error) {
      console.log(error);
    }
    navigate(`/${postData.category}/${postId}`);
  };

  const handleTabMenu = (e) => {
    const { value } = e.target.dataset
    value && setCurrentFormTab(value)
  }

  if(isSmallScreen) {
    content =
      currentFormTab === "media" ? (
        <div className="post-form-layout fullscreen">
          <label className="custom-file-button" htmlFor="media">
            Choose media
          </label>
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
      ) : (
        <div className="post-form-layout fullscreen">
          <ErrorMsg errMsg={errMsg} />
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
              rows="2"
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

          <Button
            disabled={isLoading}
            className={btnStyles}
            type="submit"
          >{submitBtnValue}</Button>
        </div>
      )
  } else {
    content =
      <>
        <div className="post-form-layout">
          <ErrorMsg errMsg={errMsg} />
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
              rows="4"
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

          <Button
            disabled={isLoading}
            className={btnStyles}
            type="submit"
          >{submitBtnValue}</Button>
        </div>
      </>
  }

  const tabsMenu =
    <menu ref={tabMenuRef} className="tabsMenu" onClick={(e) => handleTabMenu(e)}>
      <Button
        type="button"
        dataValue="media"
        className={currentFormTab === "media" ? "btn--tab is-active" : "btn--tab"}
      >
        Media
      </Button>
      <Button
        type="button"
        dataValue="postDetails"
        className={currentFormTab === "postDetails" ? "btn--tab is-active" : "btn--tab"}
      >
        Post details
      </Button>
      <div className="highlight"></div>
    </menu >

  return (
    <main className="form-wrapper">
      {isSmallScreen && tabsMenu}
      <form
        className="post-form"
        onSubmit={isEditPage ? handleEdit : handleSubmit}
      >
        {content}
      </form>
    </main>
  );
}
