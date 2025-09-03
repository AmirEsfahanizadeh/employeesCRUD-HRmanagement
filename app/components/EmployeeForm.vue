<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow rounded-lg p-6">
    <!-- Debug Info -->
    <div v-if="showDebug" class="mb-6 p-4 bg-gray-100 rounded">
      <h3 class="font-bold mb-2">Debug Info:</h3>
      <div class="text-sm space-y-1">
        <p><strong>Has Initial Data:</strong> {{ !!initialData }}</p>
        <p><strong>Initial Data ID:</strong> {{ initialData?.id }}</p>
        <p><strong>Form Mode:</strong> {{ initialData ? 'Edit' : 'Create' }}</p>
      </div>
      <details class="mt-2">
        <summary class="cursor-pointer font-medium">Form Data</summary>
        <pre class="text-xs mt-2 bg-white p-2 rounded overflow-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
      </details>
      <details class="mt-2">
        <summary class="cursor-pointer font-medium">Initial Data</summary>
        <pre class="text-xs mt-2 bg-white p-2 rounded overflow-auto">{{ JSON.stringify(initialData, null, 2) }}</pre>
      </details>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- First Name -->
      <div>
        <label for="firstName" class="block text-sm font-medium text-gray-700">
          First Name *
        </label>
        <input
          id="firstName"
          v-model="formData.firstName"
          type="text"
          required
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
          placeholder="Enter first name"
        />
        <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
          {{ errors.firstName }}
        </p>
      </div>

      <!-- Last Name -->
      <div>
        <label for="lastName" class="block text-sm font-medium text-gray-700">
          Last Name *
        </label>
        <input
          id="lastName"
          v-model="formData.lastName"
          type="text"
          required
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
          placeholder="Enter last name"
        />
        <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
          {{ errors.lastName }}
        </p>
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email *
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
          placeholder="Enter email address"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">
          {{ errors.email }}
        </p>
      </div>

      <!-- Phone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
          placeholder="Enter phone number"
        />
      </div>

      <!-- Age -->
      <div>
        <label for="age" class="block text-sm font-medium text-gray-700">
          Age *
        </label>
        <input
          id="age"
          v-model="formData.age"
          type="number"
          min="18"
          max="100"
          required
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
          placeholder="Enter age"
        />
        <p v-if="errors.age" class="mt-1 text-sm text-red-600">
          {{ errors.age }}
        </p>
      </div>

      <!-- Gender -->
      <div>
        <label for="gender" class="block text-sm font-medium text-gray-700">
          Gender *
        </label>
        <select
          id="gender"
          v-model="formData.gender"
          required
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <p v-if="errors.gender" class="mt-1 text-sm text-red-600">
          {{ errors.gender }}
        </p>
      </div>

      <!-- Department (if editing, show current department) -->
      <div v-if="initialData?.company?.department">
        <label for="department" class="block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
          id="department"
          v-model="formData.department"
          type="text"
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
          placeholder="Enter department"
        />
      </div>

      <!-- Title (if editing, show current title) -->
      <div v-if="initialData?.company?.title">
        <label for="title" class="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          :disabled="loading"
          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          :class="{ 'opacity-50': loading }"
          placeholder="Enter job title"
        />
      </div>
    </div>

    <!-- Toggle Debug -->
    <div class="mt-4">
      <label class="flex items-center">
        <input
          type="checkbox"
          v-model="showDebug"
          class="rounded border-gray-300"
        />
        <span class="ml-2 text-sm text-gray-600">Show debug info</span>
      </label>
    </div>

    <!-- Form Actions -->
    <div class="mt-6 flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('cancel')"
        :disabled="loading"
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        :disabled="loading || !isFormValid"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ initialData ? 'Updating...' : 'Creating...' }}
        </span>
        <span v-else>
          {{ initialData ? 'Update Employee' : 'Create Employee' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { z } from 'zod'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const showDebug = ref(false)

// Form validation schema
const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  age: z.number().min(18, 'Age must be at least 18').max(100, 'Age must be less than 100'),
  gender: z.enum(['male', 'female'], { errorMap: () => ({ message: 'Gender is required' }) }),
  department: z.string().optional(),
  title: z.string().optional()
})

// Initialize form data - THIS IS THE KEY FIX
const initializeFormData = () => {
  console.log('🔄 Initializing form data with:', props.initialData)
  
  if (props.initialData) {
    // Edit mode - populate with existing data
    return {
      firstName: props.initialData.firstName || '',
      lastName: props.initialData.lastName || '',
      email: props.initialData.email || '',
      phone: props.initialData.phone || '',
      age: props.initialData.age || 25,
      gender: props.initialData.gender || '',
      department: props.initialData.company?.department || '',
      title: props.initialData.company?.title || ''
    }
  } else {
    // Create mode - empty form
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: 25,
      gender: '',
      department: '',
      title: ''
    }
  }
}

// Reactive form data
const formData = reactive(initializeFormData())

// Watch for initialData changes and reinitialize form
watch(() => props.initialData, (newInitialData) => {
  console.log('📝 Initial data changed, reinitializing form:', newInitialData)
  if (newInitialData) {
    // Update form data with new initial data
    Object.assign(formData, {
      firstName: newInitialData.firstName || '',
      lastName: newInitialData.lastName || '',
      email: newInitialData.email || '',
      phone: newInitialData.phone || '',
      age: newInitialData.age || 25,
      gender: newInitialData.gender || '',
      department: newInitialData.company?.department || '',
      title: newInitialData.company?.title || ''
    })
  }
}, { immediate: true, deep: true })

// Form validation
const errors = ref({})

const validateForm = () => {
  try {
    const dataToValidate = {
      ...formData,
      age: parseInt(formData.age)
    }
    employeeSchema.parse(dataToValidate)
    errors.value = {}
    return true
  } catch (error) {
    const newErrors = {}
    error.errors.forEach(err => {
      newErrors[err.path[0]] = err.message
    })
    errors.value = newErrors
    return false
  }
}

const isFormValid = computed(() => {
  try {
    const dataToValidate = {
      ...formData,
      age: parseInt(formData.age)
    }
    employeeSchema.parse(dataToValidate)
    return true
  } catch {
    return false
  }
})

const handleSubmit = () => {
  console.log('📤 Form submitted with data:', formData)
  
  if (validateForm()) {
    const dataToSubmit = {
      ...formData,
      age: parseInt(formData.age)
    }
    emit('submit', dataToSubmit)
  }
}

// Clear field errors on change
watch(formData, () => {
  Object.keys(errors.value).forEach(field => {
    if (formData[field] && errors.value[field]) {
      delete errors.value[field]
    }
  })
}, { deep: true })

// Debug log when component mounts
onMounted(() => {
  console.log('🎯 EmployeeForm mounted with initialData:', props.initialData)
  console.log('📋 Form data initialized as:', formData)
})
</script>