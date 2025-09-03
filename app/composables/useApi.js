export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl
  
  // Request cancellation
  const controllers = new Map()
  
  const createRequest = async (url, options = {}) => {
    // Cancel previous request with same key
    const key = options.key || url
    if (controllers.has(key)) {
      controllers.get(key).abort()
    }
    
    // Create new controller
    const controller = new AbortController()
    controllers.set(key, controller)
    
    try {
          return await $fetch(url, {
              baseURL,
              signal: controller.signal,
              ...options
          })
      } finally {
          controllers.delete(key)
      }
  }
  
  const cancelRequest = (key) => {
    if (controllers.has(key)) {
      controllers.get(key).abort()
      controllers.delete(key)
    }
  }
  
  return {
    createRequest,
    cancelRequest
  }
}