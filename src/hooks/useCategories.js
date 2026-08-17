import { useEffect, useState } from 'react'
import { getCategories } from '../api/category.js'

let cachedCategories = null
let inflightRequest = null

function fetchCategoriesOnce() {
  if (cachedCategories) return Promise.resolve(cachedCategories)
  if (!inflightRequest) {
    inflightRequest = getCategories().then((data) => {
      cachedCategories = data
      return data
    })
  }
  return inflightRequest
}

// 시간대/입덧강도 카테고리는 앱 전체에서 거의 바뀌지 않으므로 최초 1회만 불러와 공유한다
export function useCategories() {
  const [categories, setCategories] = useState(cachedCategories)
  const [loading, setLoading] = useState(!cachedCategories)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (cachedCategories) return
    // loading은 이미 위에서 !cachedCategories로 true 초기화되어 있다
    let cancelled = false
    fetchCategoriesOnce()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return {
    timeCategories: categories?.timeCategories ?? [],
    intensities: categories?.intensities ?? [],
    loading,
    error,
  }
}
