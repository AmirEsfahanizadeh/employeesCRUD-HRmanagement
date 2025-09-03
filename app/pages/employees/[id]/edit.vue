<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Debug Info -->
    <div class="mb-6 p-4 bg-yellow-100 rounded-lg">
      <h3 class="font-bold text-yellow-800 mb-2">Debug Info:</h3>
      <div class="text-sm text-yellow-700">
        <p><strong>Route ID:</strong> {{ route.params.id }}</p>
        <p><strong>Store Data Fetched:</strong> {{ store.dataFetched }}</p>
        <p><strong>Employee Found:</strong> {{ !!employee }}</p>
        <p><strong>Total Employees in Store:</strong> {{ store.employees.length }}</p>
        <p><strong>Loading:</strong> {{ loading }}</p>
      </div>
      
      <!-- Employee Data Preview -->
      <div v-if="employee" class="mt-2">
        <p class="font-medium text-yellow-800">Employee Data:</p>
        <pre class="text-xs bg-white p-2 rounded mt-1 overflow-auto">{{ JSON.stringify({
          id: employee.id,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          age: employee.age,
          gender: employee.gender
        }, null, 2) }}</pre>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
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
    
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          Edit {{ employee.firstName }} {{ employee.lastName }}
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
      
      <div class="max-w-2xl mx-auto">
        <EmployeeForm 
          :initial-data="employee"
          @submit="handleSubmit"
          @cancel="handleCancel"
          :loading="submitting"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const store = useEmployeesStore()

const loading = ref(false)
const submitting = ref(false)

console.log('🚀 Edit page loaded with ID:', route.params.id)

// Get employee from store
const employee = computed(() => {
  const emp = store.getEmployeeById(route.params.id)
  console.log('👤 Employee found:', emp ? `${emp.firstName} ${emp.lastName}` : 'Not found')
  return emp
})

// Force load data function
const forceLoadData = async () => {
  console.log('🔄 Force loading employee data...')
  loading.value = true
  try {
    await store.forceRefresh()
    console.log('✅ Data refreshed')
  } catch (error) {
    console.error('❌ Failed to refresh data:', error)
  } finally {
    loading.value = false
  }
}

// If employee not found in store, load employees
onMounted(async () => {
  console.log('🎯 Component mounted')
  console.log('📊 Store state:', {
    dataFetched: store.dataFetched,
    employeeCount: store.employees?.length || 0,
    targetId: route.params.id
  })
  
  if (!employee.value && !store.dataFetched) {
    console.log('📥 Employee not found, loading data...')
    loading.value = true
    await store.loadEmployees()
    loading.value = false
  }
})

const handleSubmit = async (employeeData) => {
  submitting.value = true
  
  try {
    console.log('✏️ Updating employee:', route.params.id, employeeData)
    await store.updateEmployee(route.params.id, employeeData)
    console.log('✅ Employee updated successfully')
    await navigateTo(`/employees/${route.params.id}`)
  } catch (error) {
    console.error('❌ Update employee failed:', error)
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
</script>