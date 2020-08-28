import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [list, setList] = useState()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (url) {
      let stale = false

      // proxy http urls through a CF worker
      fetch(url.startsWith('http://') ? `https://wispy-bird-88a7.uniswap.workers.dev/?url=${url}` : url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((json) => {
          if (!stale) {
            setList(json)
            setError(false)
          }
        })
        .catch((error) => {
          if (!stale) {
            console.error(`Failed to fetch ${url}`, error)
            setList(undefined)
            setError(true)
          }
        })

      return () => {
        stale = true

        setList(undefined)
        setError(false)
      }
    }
  }, [url])

  return [!!!list, list, error]
}
