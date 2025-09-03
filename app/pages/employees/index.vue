<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        Employees ({{ total }})
      </h1>
      <div class="space-x-3">
        <button
          @click="store.forceRefresh()"
          class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
        <NuxtLink 
          to="/employees/new"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Employee
        </NuxtLink>
      </div>
    </div>
    
    <EmployeeSearch />
    
    <!-- Bulk Actions -->
    <div v-if="hasSelectedEmployees" class="mb-4 p-4 bg-blue-50 rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-700">
          {{ selectedEmployees.size }} employee(s) selected
        </span>
        <button
          @click="handleBulkDelete"
          class="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          :disabled="loading"
        >
          Delete Selected
        </button>
      </div>
    </div>
    
    <EmployeeTable />
    
    <!-- Pagination -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Showing page {{ currentPage }} of {{ totalPages }} ({{ total }} total)
      </div>
      
      <div class="flex space-x-2">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        
        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded">
          {{ currentPage }}
        </span>
        
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    
    <ConfirmModal 
      v-model="showBulkDeleteModal"
      title="Delete Employees"
      :message="`Are you sure you want to delete ${selectedEmployees.size} employee(s)?`"
      @confirm="confirmBulkDelete"
    />
  </div>
</template>

<script setup>
const store = useEmployeesStore()

const {
  loading,
  currentPage,
  total,
  totalPages,
  hasSelectedEmployees,
  selectedEmployees,
  dataFetched
} = storeToRefs(store)

const showBulkDeleteModal = ref(false)

// Load employees only if not already loaded
onMounted(async () => {
  if (!dataFetched.value) {
    console.log('🚀 Initial load of employees')
    await store.loadEmployees()
  } else {
    console.log('📦 Employees already loaded, using cache')
  }
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    store.currentPage = page
  }
}

const handleBulkDelete = () => {
  showBulkDeleteModal.value = true
}

const confirmBulkDelete = async () => {
  try {
    const ids = Array.from(selectedEmployees.value)
    await store.bulkDeleteEmployees(ids)
    showBulkDeleteModal.value = false
  } catch (error) {
    console.error('Bulk delete failed:', error)
  }
}

// SEO
useHead({
  title: 'Employees - HR Management'
})
</script>