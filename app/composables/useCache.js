export const useCache = () => {
  const cache = new Map()
  const CACHE_DURATION = 30 * 1000 // 30 seconds
  
  const getCachedData = (key) => {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }
  
  const setCachedData = (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  const clearCache = () => {
    cache.clear()
  }
  
  return {
    getCachedData,
    setCachedData,
    clearCache
  }
}