import { defineStore } from 'pinia'

export const useEmployeesStore = defineStore('employees', () => {
  // State
  const employees = ref([])
  const selectedEmployees = ref(new Set())
  const loading = ref(false)
  const error = ref(null)
  const dataFetched = ref(false) // Track if we've fetched data
  
  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const total = ref(0)
  
  // Search & Filters
  const searchQuery = ref('')
  const sortField = ref('firstName')
  const sortDirection = ref('asc')
  
  // Cache timestamp
  const lastFetchTime = ref(null)
  const CACHE_DURATION = 30 * 1000 // 30 seconds
  
  // Computed
  const filteredEmployees = computed(() => {
    let filtered = employees.value
    
    // Apply search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(emp => 
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.company?.department?.toLowerCase().includes(query) ||
        emp.company?.title?.toLowerCase().includes(query)
      )
    }
    
    return filtered
  })
  
  const sortedEmployees = computed(() => {
    if (!filteredEmployees.value.length) return []
    
    return [...filteredEmployees.value].sort((a, b) => {
      const getNestedValue = (obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj)
      }
      
      const aVal = getNestedValue(a, sortField.value)
      const bVal = getNestedValue(b, sortField.value)
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.toLowerCase().localeCompare(bVal.toLowerCase())
        return sortDirection.value === 'asc' ? comparison : -comparison
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      if (sortDirection.value === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
  })
  
  const paginatedEmployees = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return sortedEmployees.value.slice(start, end)
  })
  
  const totalPages = computed(() => {
    return Math.ceil(filteredEmployees.value.length / itemsPerPage.value)
  })
  
  const hasSelectedEmployees = computed(() => {
    return selectedEmployees.value.size > 0
  })
  
  // Check if cache is valid
  const isCacheValid = () => {
    if (!lastFetchTime.value) return false
    return Date.now() - lastFetchTime.value < CACHE_DURATION
  }
  
  // Actions
  const { fetchEmployees: apiFetchEmployees, createEmployee: apiCreateEmployee, updateEmployee: apiUpdateEmployee, deleteEmployee: apiDeleteEmployee } = useEmployees()
  
  const loadEmployees = async (forceRefresh = false) => {
    // Don't fetch if we already have data and cache is valid
    if (!forceRefresh && dataFetched.value && isCacheValid()) {
      console.log('📦 Using cached employee data')
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      console.log('🔄 Fetching employees from API')
      const response = await apiFetchEmployees({
        limit: 30, // Fetch more items at once
        skip: 0
      })
      
      employees.value = response.users || []
      total.value = response.total || 0
      dataFetched.value = true
      lastFetchTime.value = Date.now()
      
      console.log(`✅ Loaded ${employees.value.length} employees`)
    } catch (err) {
      error.value = err.message
      employees.value = []
      console.error('❌ Failed to load employees:', err)
    } finally {
      loading.value = false
    }
  }
  
  const addEmployee = async (employeeData) => {
    loading.value = true
    
    try {
      console.log('➕ Adding employee:', employeeData)
      const response = await apiCreateEmployee(employeeData)
      
      // Create a properly structured employee object for local state
      const newEmployee = {
        id: response.id || Date.now(), // Fallback ID for demo
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        age: employeeData.age,
        gender: employeeData.gender,
        image: `https://dummyjson.com/icon/${employeeData.firstName.toLowerCase()}/128`,
        company: {
          department: 'New Department',
          title: 'New Employee',
          name: 'Your Company'
        },
        address: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          country: 'USA'
        },
        birthDate: new Date(Date.now() - employeeData.age * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        bloodGroup: 'O+',
        role: 'user',
        username: employeeData.firstName.toLowerCase() + employeeData.lastName.toLowerCase()
      }
      
      // Add to beginning of array
      employees.value.unshift(newEmployee)
      total.value += 1
      
      console.log('✅ Employee added to local state')
      return newEmployee
    } catch (error) {
      console.error('❌ Failed to add employee:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const updateEmployee = async (id, employeeData) => {
    loading.value = true
    
    // Find employee index
    const employeeIndex = employees.value.findIndex(emp => emp.id == id)
    if (employeeIndex === -1) {
      throw new Error('Employee not found')
    }
    
    // Store original for rollback
    const originalEmployee = { ...employees.value[employeeIndex] }
    
    try {
      console.log('✏️ Updating employee:', id, employeeData)
      
      // Optimistic update
      employees.value[employeeIndex] = {
        ...employees.value[employeeIndex],
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone,
        age: employeeData.age,
        gender: employeeData.gender,
        company: {
          ...employees.value[employeeIndex].company,
          department: employeeData.department || employees.value[employeeIndex].company?.department,
          title: employeeData.title || employees.value[employeeIndex].company?.title
        }
      }
      
      const response = await apiUpdateEmployee(id, employeeData)
      console.log('✅ Employee updated in API and local state')
      return response
    } catch (error) {
      // Rollback on error
      employees.value[employeeIndex] = originalEmployee
      console.error('❌ Failed to update employee, rolled back:', error)
      throw error
    } finally {
      loading.value = false
    }
  }
  
  const removeEmployee = async (id) => {
    // Find employee
    const employeeIndex = employees.value.findIndex(emp => emp.id == id)
    if (employeeIndex === -1) {
      throw new Error('Employee not found')
    }
    
    // Store original for rollback
    const originalEmployee = employees.value[employeeIndex]
    
    try {
      console.log('🗑️ Removing employee:', id)
      
      // Optimistic update - remove from local state
      employees.value.splice(employeeIndex, 1)
      total.value = Math.max(0, total.value - 1)
      selectedEmployees.value.delete(id)
      
      await apiDeleteEmployee(id)
      console.log('✅ Employee removed from API and local state')
    } catch (error) {
      // Rollback on error
      employees.value.splice(employeeIndex, 0, originalEmployee)
      total.value += 1
      console.error('❌ Failed to remove employee, rolled back:', error)
      throw error
    }
  }
  
  const bulkDeleteEmployees = async (ids) => {
    const originalEmployees = [...employees.value]
    const originalTotal = total.value
    
    try {
      console.log('🗑️ Bulk removing employees:', ids)
      
      // Optimistic updates
      employees.value = employees.value.filter(emp => !ids.includes(emp.id))
      total.value = Math.max(0, total.value - ids.length)
      selectedEmployees.value.clear()
      
      // API calls (these might fail in DummyJSON, but that's ok for demo)
      await Promise.allSettled(ids.map(id => apiDeleteEmployee(id)))
      console.log('✅ Bulk delete completed')
    } catch (error) {
      // Rollback
      employees.value = originalEmployees
      total.value = originalTotal
      console.error('❌ Bulk delete failed, rolled back:', error)
      throw error
    }
  }
  
  const getEmployeeById = (id) => {
    return employees.value.find(emp => emp.id == id)
  }
  
  const forceRefresh = () => {
    dataFetched.value = false
    lastFetchTime.value = null
    loadEmployees(true)
  }
  
  const toggleEmployeeSelection = (id) => {
    if (selectedEmployees.value.has(id)) {
      selectedEmployees.value.delete(id)
    } else {
      selectedEmployees.value.add(id)
    }
  }
  
  const selectAllEmployees = () => {
    paginatedEmployees.value.forEach(emp => {
      selectedEmployees.value.add(emp.id)
    })
  }
  
  const clearSelection = () => {
    selectedEmployees.value.clear()
  }
  
  const setSortField = (field) => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortDirection.value = 'asc'
    }
  }
  
  return {
    // State
    employees: paginatedEmployees,
    selectedEmployees,
    loading,
    error,
    currentPage,
    itemsPerPage,
    total: computed(() => filteredEmployees.value.length),
    searchQuery,
    sortField,
    sortDirection,
    dataFetched,
    
    // Computed
    hasSelectedEmployees,
    totalPages,
    
    // Actions
    loadEmployees,
    addEmployee,
    updateEmployee,
    removeEmployee,
    bulkDeleteEmployees,
    getEmployeeById,
    forceRefresh,
    toggleEmployeeSelection,
    selectAllEmployees,
    clearSelection,
    setSortField
  }
})