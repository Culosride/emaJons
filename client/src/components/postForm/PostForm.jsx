import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation, useLoaderData } from "react-router-dom";
import { createPost, editPost, setCurrentPost } from "../../features/posts/postsSlice";
import { fetchTags, toggleTag, resetTags } from "../../features/tags/tagsSlice";
import { useSelector, useDispatch } from "react-redux";
import TagsInputForm from "../tag/TagsInputForm";
import Button from "../UI/Button";
import ErrorMsg from "../UI/ErrorMsg";
import { useScroll } from "../../hooks/useScroll";
import useScreenSize from "../../hooks/useScreenSize";

const initPostData = () => ({
  title: "",
  subtitle: "",
  content: "",
  media: [],
  category: "",
  postTags: [],
});

export default function PostForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { postId } = useParams();

  const selectedTags = useSelector((state) => state.tags.selectedTags);
  const currentPost = useSelector((state) => state.posts.currentPost);

  const post = useLoaderData()

  const postStatus = useSelector((state) => state.posts.status);
  const isMediumScreen = useScreenSize(["xs", "s", "m"])
  const tabMenuRef = useRef(null)
  useScroll(tabMenuRef, undefined , { threshold: 40, scrollClass: "fade-top" })

  const [errMsg, setErrMsg] = useState(null);
  const [currentFormTab, setCurrentFormTab] = useState("media")
  const [mediaElements, setMediaElements] = useState([]);
  const [postData, setPostData] = useState(initPostData());

  // Derived state
  const isEditPage = pathname.includes("edit");
  const arePostsLoading = postStatus === "loading"

  const btnStyles = arePostsLoading ? "basic disabled" : "basic";
  const submitBtnValue = arePostsLoading
    ? "Submitting..."
    :  isEditPage
      ? "Save changes"
      : "Create new post";

  let content;

  const handleEditPage = async () => {
    if(!currentPost) {
      dispatch(setCurrentPost(post))
    }
    setPostData(post);
    post.postTags.forEach((tag) => {
      dispatch(toggleTag(tag));
    });
  }

  const handleNewPage = async () => {
    dispatch(setCurrentPost(""))
  }

  useEffect(() => {
    dispatch(resetTags())
    if (isEditPage) {
      handleEditPage();
    } else if(!isEditPage) {
      handleNewPage();
    }
  }, [isEditPage, dispatch])


  // Create media preview
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
            <div className="delete-prev-container">
              <Button hasIcon={true} id={file[mediaKey]} className="delete" title="Delete" onClick={deleteMedia} />
            </div>
          </div>
        );
      })
    );
  }, [postData.media]);

  // Delete media from preview
  const deleteMedia = (e) => {
    e.preventDefault()
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (postStatus === "loading") return;

    const validationError = validatePostData(postData);
    if (validationError) {
      setErrMsg(validationError);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const formData = prepareFormData(postData, selectedTags);
      const action = isEditPage ? editPost({ formData, postId }) : createPost(formData);
      const result = await dispatch(action);

      if (editPost.fulfilled.match(result) || createPost.fulfilled.match(result)) {
        dispatch(fetchTags());
        navigate(`/${postData.category}/${result.payload._id}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrMsg("An error occurred while saving the post.");
    }
  };

  function validatePostData(postData) {
    if (!postData.category) return "Select a category";
    if (postData.media.length === 0) return "A post with nada?";
    return null;
  }

  function prepareFormData(postData, selectedTags) {
    const formData = new FormData();
    Object.keys(postData).forEach(key => {
      if (key === "media") {
        postData.media.map((media) => {
          media.name
            ? formData.append("media", media)
            : formData.append("media", JSON.stringify(media));
        });
      } else if (key === "postTags") {
        selectedTags.forEach(tag => formData.append("postTags", tag));
      } else {
        formData.append(key, postData[key]);
      }
    });
    return formData;
  }

  const handleTabMenu = (e) => {
    const { value } = e.target.dataset
    value && setCurrentFormTab(value)
  }

  if(isMediumScreen) {
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
            hasIcon={false}
            disabled={arePostsLoading}
            className={btnStyles}
            type="submit"
          >
            {submitBtnValue}
          </Button>
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
            hasIcon={false}
            disabled={arePostsLoading}
            className={btnStyles}
            type="submit"
          >
            {submitBtnValue}
          </Button>
        </div>
      </>
  }

  const tabsMenu =
    <menu ref={tabMenuRef} className="tabsMenu" onClick={(e) => handleTabMenu(e)}>
      <Button
        hasIcon={false}
        dataValue="media"
        className={currentFormTab === "media" ? "tab is-selected" : "tab"}
      >
        Media
      </Button>
      <Button
        hasIcon={false}
        dataValue="postDetails"
        className={currentFormTab === "postDetails" ? "tab is-selected" : "tab"}
      >
        Post details
      </Button>
      <div className="highlight"></div>
    </menu >

  return (
    <main className="form-wrapper">
      {isMediumScreen && tabsMenu}
      <form
        className="post-form"
        onSubmit={handleFormSubmit}
      >
        {content}
      </form>
    </main>
  );
}
