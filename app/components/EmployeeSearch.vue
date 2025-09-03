<template>
  <div class="mb-6">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search employees..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <div v-if="isSearching" class="absolute right-3 top-3">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useEmployeesStore()
const { searchQuery } = storeToRefs(store)

const isSearching = ref(false)

// Throttled search function
const performSearch = async (query) => {
  isSearching.value = true
  
  try {
    // Reset to first page when searching
    store.currentPage = 1
    await store.loadEmployees()
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isSearching.value = false
  }
}

// Throttle search calls
const throttledSearch = useThrottle(performSearch, 300)

// Watch search query changes
watch(searchQuery, (newQuery) => {
  throttledSearch(newQuery)
}, { immediate: false })
</script>