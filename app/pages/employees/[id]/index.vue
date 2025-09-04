<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="flex justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="!employee" class="text-center">
      <h1 class="text-2xl font-bold text-red-600 mb-4">Employee Not Found</h1>
      <NuxtLink to="/employees" class="text-blue-600 hover:underline">
        Back to Employees
      </NuxtLink>
    </div>
    
    <div v-else>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">
          {{ employee.firstName }} {{ employee.lastName }}
        </h1>
        <div class="space-x-3">
          <NuxtLink 
            :to="`/employees/${employee.id}/edit`"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit
          </NuxtLink>
          <button
            @click="handleDelete"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      
      <!-- Employee details (same as before) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6 text-center">
            <img 
              :src="employee.image" 
              :alt="`${employee.firstName} ${employee.lastName}`"
              class="w-32 h-32 rounded-full object-cover mx-auto mb-4"
              @error="handleImageError"
            />
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              {{ employee.firstName }} {{ employee.lastName }}
            </h2>
            <p class="text-gray-600 mb-2">@{{ employee.username }}</p>
            <p class="text-sm text-gray-500">{{ employee.company?.title }}</p>
          </div>
        </div>
        
        <!-- Details sections (same as before) -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="text-gray-900">{{ employee.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Phone</label>
                <p class="text-gray-900">{{ employee.phone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Age</label>
                <p class="text-gray-900">{{ employee.age }} years old</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Gender</label>
                <p class="text-gray-900 capitalize">{{ employee.gender }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Company</label>
                <p class="text-gray-900">{{ employee.company?.name || 'Not specified' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Department</label>
                <p class="text-gray-900">{{ employee.company?.department || 'Not specified' }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Title</label>
                <p class="text-gray-900">{{ employee.company?.title || 'Not specified' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <NuxtLink 
          to="/employees"
          class="text-blue-600 hover:underline"
        >
          ← Back to Employees
        </NuxtLink>
      </div>
    </div>
    
    <ConfirmModal 
      v-model="showDeleteModal"
      title="Delete Employee"
      :message="`Are you sure you want to delete ${employee?.firstName} ${employee?.lastName}?`"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const store = useEmployeesStore()

const loading = ref(false)
const showDeleteModal = ref(false)

// Get employee from store instead of API call
const employee = computed(() => {
  return store.getEmployeeById(route.params.id)
})

// If employee not found in store, load employees
onMounted(async () => {
  if (!employee.value && !store.dataFetched) {
    loading.value = true
    await store.loadEmployees()
    loading.value = false
  }
})

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/128x128?text=User'
}

const handleDelete = () => {
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await store.removeEmployee(employee.value.id)
    await navigateTo('/employees')
  } catch (error) {
    console.error('Delete failed:', error)
  }
}

// SEO
useHead({
  title: computed(() => 
    employee.value 
      ? `${employee.value.firstName} ${employee.value.lastName} - Employees`
      : 'Employee - HR Management'
  )
})
</script>