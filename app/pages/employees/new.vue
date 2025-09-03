<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Add New Employee</h1>
      <NuxtLink 
        to="/employees"
        class="text-blue-600 hover:underline"
      >
        Back to Employees
      </NuxtLink>
    </div>
    
    <div class="max-w-2xl mx-auto">
      <EmployeeForm 
        @submit="handleSubmit"
        @cancel="handleCancel"
        :loading="submitting"
      />
    </div>
  </div>
</template>

<script setup>
const store = useEmployeesStore()
const submitting = ref(false)

const handleSubmit = async (employeeData) => {
  submitting.value = true
  
  try {
    console.log('➕ Creating new employee:', employeeData)
    await store.addEmployee(employeeData)
    console.log('✅ Employee created successfully')
    await navigateTo('/employees')
  } catch (error) {
    console.error('❌ Create employee failed:', error)
    alert('Failed to create employee: ' + error.message)
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  navigateTo('/employees')
}

// SEO
useHead({
  title: 'Add New Employee - HR Management'
})
</script>