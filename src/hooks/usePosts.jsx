import { useState, useEffect } from 'react'
import { fetchPostsByCategory } from '../features/posts/postsSlice'
import { useDispatch } from 'react-redux'

const usePosts = (category) => {
  const dispatch = useDispatch()
  const [pageNum, setPageNum] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    dispatch(fetchPostsByCategory([category, pageNum], { signal }))

    return () => controller.abort()

  }, [pageNum])

  return { setPageNum }
}

export default usePosts
