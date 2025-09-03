
<template>
  <tr class="hover:bg-gray-50">
    <td class="px-4 py-4 whitespace-nowrap">
      <input 
        type="checkbox" 
        :checked="selectedEmployees.has(employee.id)"
        @change="store.toggleEmployeeSelection(employee.id)"
        class="rounded border-gray-300"
      />
    </td>
    
    <td class="px-4 py-4 whitespace-nowrap min-w-[200px]">
      <div class="flex items-center">
        <img 
          :src="employee.image" 
          :alt="`${employee.firstName} ${employee.lastName}`"
          class="h-10 w-10 rounded-full object-cover flex-shrink-0"
          @error="handleImageError"
        />
        <div class="ml-4 min-w-0">
          <button
            @click="goToEmployeeDetail"
            class="text-sm font-medium text-gray-900 hover:text-blue-600 text-left truncate block"
          >
            {{ employee.firstName }} {{ employee.lastName }}
          </button>
          <p class="text-xs text-gray-500 truncate">{{ employee.username }}</p>
        </div>
      </div>
    </td>
    
    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[250px]">
      <div>
        <div class="truncate">{{ employee.email }}</div>
        <div class="text-xs text-gray-500 truncate">{{ employee.phone }}</div>
      </div>
    </td>
    
    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[200px]">
      <div>
        <div class="font-medium truncate">{{ employee.company?.department || 'Not specified' }}</div>
        <div class="text-xs text-gray-500 truncate">{{ employee.company?.title || 'Not specified' }}</div>
      </div>
    </td>
    
    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[100px]">
      <div class="text-center">
        {{ employee.age }}
      </div>
    </td>
    
    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
      <span class="capitalize">{{ employee.gender }}</span>
    </td>
    
    <td class="px-4 py-4 whitespace-nowrap min-w-[100px]">
      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Active
      </span>
    </td>
    
    <!-- Sticky actions column -->
    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium min-w-[150px] sticky right-0 bg-white">
      <div class="flex justify-end space-x-2">
        <button
          @click="goToEmployeeDetail"
          class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
          title="View Details"
        >
          View
        </button>
        <button
          @click="goToEmployeeEdit"
          class="text-indigo-600 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50"
          title="Edit Employee"
        >
          Edit
        </button>
        <button
          @click="handleDelete"
          class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
          title="Delete Employee"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup>
const props = defineProps({
  employee: {
    type: Object,
    required: true
  }
})

const store = useEmployeesStore()
const { selectedEmployees } = storeToRefs(store)

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/40x40?text=User'
}

const goToEmployeeDetail = () => {
  console.log('🔍 Navigating to employee detail:', props.employee.id)
  navigateTo(`/employees/${props.employee.id}`)
}

const goToEmployeeEdit = () => {
  console.log('✏️ Navigating to employee edit:', props.employee.id)
  navigateTo(`/employees/${props.employee.id}/edit`)
}

const handleDelete = async () => {
  const confirmed = confirm(`Are you sure you want to delete ${props.employee.firstName} ${props.employee.lastName}?`)
  
  if (confirmed) {
    try {
      console.log('🗑️ Deleting employee:', props.employee.id)
      await store.removeEmployee(props.employee.id)
      console.log('✅ Employee deleted successfully')
    } catch (error) {
      console.error('❌ Delete failed:', error)
      alert('Failed to delete employee: ' + error.message)
    }
  }
}
</script>

<style scoped>
/* Ensure sticky column has proper background */
td.sticky {
  position: sticky;
  right: 0;
  background: white;
  box-shadow: -2px 0 4px -2px rgba(0, 0, 0, 0.1);
}

/* Handle hover state for sticky column */
tr:hover td.sticky {
  background: #f9fafb;
}
</style>