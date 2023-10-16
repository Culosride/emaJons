import { useState, useEffect } from 'react'
import { fetchPostsByCategory } from '../features/posts/postsSlice'
import { useDispatch, useSelector } from 'react-redux'

const usePosts = (category) => {
  const dispatch = useDispatch()
  const [results, setResults] = useState([])
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState({})
  const [hasNextPage, setHasNextPage] = useState(false)
  const [pageNum, setPageNum] = useState(1)


  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    setIsError(false)
    setError({})
    dispatch(fetchPostsByCategory([category, pageNum], { signal }))
    .then(data => {
      setResults(prev => [...prev, ...data.payload.posts])
      setHasNextPage(data.payload.moreData)
    })
    .catch(e => {
      if (signal.aborted) return
      setIsError(true)
      setError({ message: e.message })
    })

    return () => controller.abort()

  }, [pageNum])

  return { isError, error, results, hasNextPage, setPageNum }
}

export default usePosts
