export const useEmployees = () => {
  const { createRequest } = useApi()
  const { getCachedData, setCachedData } = useCache()
  
  const fetchEmployees = async (params = {}) => {
    const { limit = 10, skip = 0, q = '' } = params
    const cacheKey = `employees-${limit}-${skip}-${q}`
    
    // Check cache first
    const cached = getCachedData(cacheKey)
    if (cached) {
      return cached
    }
    
    try {
      const endpoint = q ? '/users/search' : '/users'
      const response = await createRequest(endpoint, {
        key: cacheKey,
        query: { limit, skip, q }
      })
      
      // Cache the result
      setCachedData(cacheKey, response)
      return response
    } catch (error) {
      throw error
    }
  }
  
  const fetchEmployee = async (id) => {
    const cacheKey = `employee-${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached
    
    try {
      const response = await createRequest(`/users/${id}`, {
        key: cacheKey
      })
      setCachedData(cacheKey, response)
      return response
    } catch (error) {
      throw error
    }
  }
  
  const createEmployee = async (employeeData) => {
    return createRequest('/users/add', {
      method: 'POST',
      body: employeeData
    })
  }
  
  const updateEmployee = async (id, employeeData) => {
    return createRequest(`/users/${id}`, {
      method: 'PUT',
      body: employeeData
    })
  }
  
  const deleteEmployee = async (id) => {
    return createRequest(`/users/${id}`, {
      method: 'DELETE'
    })
  }
  
  return {
    fetchEmployees,
    fetchEmployee,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}