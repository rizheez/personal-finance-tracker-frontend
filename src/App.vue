<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
const auth = useAuthStore()
onMounted(() => {
  if (auth.token) {
    auth.fetchUser()
  }
})
</script>

<template>
  <VApp>
    <RouterView />
  </VApp>
</template>
