<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <!-- Employee Not Found -->
    <div v-else-if="!employee" class="text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">Employee Not Found</h1>
      <p class="text-gray-600 mb-4">
        Looking for employee with ID: {{ route.params.id }}
      </p>
      <div class="space-x-4">
        <button
          @click="forceLoadData"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Force Load Data
        </button>
        <NuxtLink 
          to="/employees" 
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Back to Employees
        </NuxtLink>
      </div>
    </div>
    
    <!-- Edit Form -->
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          Edit Employee
        </h1>
        <div class="space-x-3">
          <NuxtLink 
            :to="`/employees/${employee.id}`"
            class="text-blue-600 hover:underline"
          >
            Back to Details
          </NuxtLink>
          <NuxtLink 
            to="/employees"
            class="text-gray-600 hover:underline"
          >
            Back to List
          </NuxtLink>
        </div>
      </div>
      
      <!-- Employee Edit Form -->
      <div class="max-w-2xl mx-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              v-model="formData.firstName"
              type="text"
              :placeholder="employee.firstName || 'Enter first name'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="formData.lastName"
              type="text"
              :placeholder="employee.lastName || 'Enter last name'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :placeholder="employee.email || 'Enter email address'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              :placeholder="employee.phone || 'Enter phone number'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="age" class="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="age"
              v-model.number="formData.age"
              type="number"
              :placeholder="employee.age || 'Enter age'"
              min="18"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              v-model="formData.gender"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{{ employee.gender ? `Current: ${employee.gender}` : 'Select gender' }}</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label for="position" class="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <input
              id="position"
              v-model="formData.position"
              type="text"
              :placeholder="employee.position || 'Enter job position'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="department" class="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              id="department"
              v-model="formData.department"
              type="text"
              :placeholder="employee.department || 'Enter department'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="salary" class="block text-sm font-medium text-gray-700 mb-1">
              Salary
            </label>
            <input
              id="salary"
              v-model.number="formData.salary"
              type="number"
              :placeholder="employee.salary || 'Enter salary'"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              id="startDate"
              v-model="formData.startDate"
              type="date"
              :placeholder="employee.startDate || 'Select start date'"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              @click="handleCancel"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              :disabled="submitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="submitting"
            >
              <span v-if="submitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span v-else>Update Employee</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const store = useEmployeesStore()

const loading = ref(false)
const submitting = ref(false)

// Initialize form data with employee values or empty strings
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  age: null,
  gender: '',
  position: '',
  department: '',
  salary: null,
  startDate: ''
})

// Get employee from store
const employee = computed(() => {
  const emp = store.getEmployeeById(route.params.id)
  return emp
})

// Initialize form data when employee is loaded
watch(employee, (newEmployee) => {
  if (newEmployee) {
    formData.value = {
      firstName: newEmployee.firstName || '',
      lastName: newEmployee.lastName || '',
      email: newEmployee.email || '',
      phone: newEmployee.phone || '',
      age: newEmployee.age || null,
      gender: newEmployee.gender || '',
      position: newEmployee.position || '',
      department: newEmployee.department || '',
      salary: newEmployee.salary || null,
      startDate: newEmployee.startDate || ''
    }
  }
}, { immediate: true })

// Force load data function
const forceLoadData = async () => {
  loading.value = true
  try {
    await store.forceRefresh()
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    loading.value = false
  }
}

// Load employee data if not available
onMounted(async () => {
  if (!employee.value && !store.dataFetched) {
    loading.value = true
    await store.loadEmployees()
    loading.value = false
  }
})

const handleSubmit = async () => {
  submitting.value = true
  
  try {
    // Remove null/undefined values and empty strings for cleaner data
    const cleanedData = Object.fromEntries(
      Object.entries(formData.value).filter(([key, value]) => 
        value !== null && value !== undefined && value !== ''
      )
    )
    
    await store.updateEmployee(route.params.id, cleanedData)
    await navigateTo(`/employees/${route.params.id}`)
  } catch (error) {
    console.error('Update employee failed:', error)
    alert('Failed to update employee: ' + error.message)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  navigateTo(`/employees/${route.params.id}`)
}

// SEO
useHead({
  title: computed(() => 
    employee.value 
      ? `Edit ${employee.value.firstName} ${employee.value.lastName} - Employees`
      : 'Edit Employee - HR Management'
  )
})
</script setup>