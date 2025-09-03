<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-md">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button 
        @click="store.loadEmployees(true)"
        class="mt-4 text-blue-600 hover:underline"
      >
        Try Again
      </button>
    </div>
    
    <div v-else-if="!employees.length" class="text-center py-12">
      <p class="text-gray-500">No employees found</p>
    </div>
    
    <div v-else>
      <!-- Horizontal scroll container -->
      <div class="overflow-x-auto">
        <!-- Use virtual scroller for large datasets -->
        <div v-if="employees.length > 200" class="min-w-full">
          <RecycleScroller
            class="scroller"
            :items="employees"
            :item-size="80"
            key-field="id"
            v-slot="{ item }"
          >
            <EmployeeTableRow :employee="item" />
          </RecycleScroller>
        </div>
        
        <!-- Regular table for smaller datasets -->
        <table v-else class="min-w-full divide-y divide-gray-200" style="min-width: 1000px;">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 text-left w-12">
                <input 
                  type="checkbox" 
                  @change="toggleSelectAll"
                  :checked="allSelected"
                  class="rounded border-gray-300"
                />
              </th>
              <th 
                @click="setSortField('firstName')"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[200px]"
              >
                <div class="flex items-center space-x-1">
                  <span>Name</span>
                  <span v-if="sortField === 'firstName'" class="text-blue-600">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th 
                @click="setSortField('email')"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[250px]"
              >
                <div class="flex items-center space-x-1">
                  <span>Contact</span>
                  <span v-if="sortField === 'email'" class="text-blue-600">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th 
                @click="setSortField('company.department')"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[200px]"
              >
                <div class="flex items-center space-x-1">
                  <span>Department</span>
                  <span v-if="sortField === 'company.department'" class="text-blue-600">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th 
                @click="setSortField('age')"
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 min-w-[100px]"
              >
                <div class="flex items-center space-x-1">
                  <span>Age</span>
                  <span v-if="sortField === 'age'" class="text-blue-600">
                    {{ sortDirection === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Gender
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Status
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] sticky right-0 bg-gray-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <EmployeeTableRow 
              v-for="employee in employees" 
              :key="employee.id" 
              :employee="employee"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'

const store = useEmployeesStore()

const {
  employees,
  selectedEmployees,
  loading,
  error,
  sortField,
  sortDirection
} = storeToRefs(store)

const allSelected = computed(() => {
  return employees.value.length > 0 && 
         employees.value.every(emp => selectedEmployees.value.has(emp.id))
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    store.clearSelection()
  } else {
    store.selectAllEmployees()
  }
}

const setSortField = (field) => {
  store.setSortField(field)
}
</script>

<style scoped>
.scroller {
  height: 600px;
}

/* Custom scrollbar styling */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>