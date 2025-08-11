<template>
  <VCard
    elevation="4"
    class="pa-6"
    title=""
  >
    <VContainer fluid>
      <!-- Header -->
      <VRow
        align="center"
        justify="space-between"
        class="mb-6"
      >
        <VCol
          cols="12"
          md="6"
        >
          <div class="d-flex align-center">
            <h1 class="text-h4 font-weight-bold d-flex align-center gap-2">🏷️ Transaction Categories</h1>
          </div>
          <p class="text-subtitle-2 text-medium-emphasis mt-1">Organize your transactions with custom categories</p>
        </VCol>
        <VCol
          cols="12"
          md="3"
          class="text-right"
        >
          <RouterLink to="/categories/create">
            <VBtn
              color="primary"
              prepend-icon="ri-file-add-line"
              elevation="2"
            >
              Add Category
            </VBtn>
          </RouterLink>
        </VCol>
      </VRow>

      <!-- Categories Grid -->
      <VRow
        v-if="loading"
        dense
      >
        <VCol
          cols="12"
          class="text-center py-10"
        >
          <VProgressCircular
            indeterminate
            color="primary"
            size="48"
          />
          <div class="mt-3 text-medium-emphasis">Loading categories...</div>
        </VCol>
      </VRow>

      <VRow
        v-else-if="categories.length > 0"
        dense
      >
        <VCol
          v-for="category in categories"
          :key="category.id"
          cols="12"
          sm="6"
          md="4"
        >
          <VCard
            :style="{ borderColor: category.color }"
            class="pa-4"
            variant="outlined"
            elevation="2"
          >
            <VRow
              align="center"
              justify="space-between"
            >
              <VCol cols="auto">
                <VAvatar
                  size="56"
                  :color="category.color"
                  class="white--text"
                >
                  <VIcon>ri-bookmark-line</VIcon>
                </VAvatar>
              </VCol>
              <VCol>
                <div class="font-weight-medium">{{ category.name }}</div>
                <div
                  v-if="category.description"
                  class="text-caption text-medium-emphasis"
                >
                  {{ category.description }}
                </div>
                <div class="d-flex align-center mt-2">
                  <div
                    class="rounded-circle mr-2"
                    style="block-size: 16px; inline-size: 16px"
                    :style="{ backgroundColor: category.color }"
                  ></div>
                  <span class="text-caption font-mono">{{ category.color.toUpperCase() }}</span>
                </div>
              </VCol>
              <VCol
                cols="auto"
                class="text-right"
              >
                <RouterLink :to="`/categories/${category.id}/edit`">
                  <VBtn
                    icon
                    variant="text"
                    color="warning"
                  >
                    <VIcon>ri-pencil-line</VIcon>
                  </VBtn>
                </RouterLink>
                <VBtn
                  icon
                  variant="text"
                  color="error"
                  @click="openConfirmDialog(category.id, category.name)"
                >
                  <VIcon>ri-delete-bin-line</VIcon>
                </VBtn>
              </VCol>
            </VRow>
          </VCard>
        </VCol>
      </VRow>

      <!-- Empty State -->
      <VCard
        v-else
        class="pa-10 text-center"
        color="blue-lighten-5"
        elevation="0"
      >
        <div class="text-h2 mb-4">🏷️</div>
        <div class="text-h5 font-weight-bold mb-2">No categories yet</div>
        <p class="text-medium-emphasis mb-4">Create your first category to start organizing your transactions.</p>
        <RouterLink to="/categories/create">
          <VBtn
            color="primary"
            prepend-icon="ri-file-add-line"
            elevation="2"
          >
            Create Category
          </VBtn>
        </RouterLink>
      </VCard>

      <!-- Tips -->
      <VCard
        class="mt-8 pa-6"
        color="warning-lighten-10"
        outlined
        elevation="0"
      >
        <VRow>
          <VCol>
            <div class="font-weight-medium mb-2">💡Category Tips</div>
            <ul class="text-body-2">
              <li class="font-weight-medium">Use clear, descriptive names for your categories</li>
              <li class="font-weight-medium">
                Choose colors that help you quickly identify different types of expenses
              </li>
              <li class="font-weight-medium">Keep the number of categories manageable (8-12 is usually enough)</li>
              <li class="font-weight-medium">
                Group similar expenses together (e.g., "Food & Dining" instead of separate categories for restaurants
                and groceries)
              </li>
            </ul>
          </VCol>
        </VRow>
      </VCard>

      <VDialog
        v-model="confirmDialog"
        max-width="400"
      >
        <VCard>
          <VCardTitle class="text-h6">Konfirmasi Hapus</VCardTitle>
          <VCardText>
            Apakah kamu yakin ingin menghapus kategori
            <strong>{{ selectedCategory.name }}</strong
            >?
          </VCardText>
          <VCardActions class="justify-end">
            <VBtn
              variant="text"
              @click="confirmDialog = false"
              >Batal</VBtn
            >
            <VBtn
              color="error"
              variant="flat"
              @click="handleDelete"
              >Hapus</VBtn
            >
          </VCardActions>
        </VCard>
      </VDialog>
    </VContainer>
  </VCard>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/category'
import { onBeforeUnmount, ref, toRef, watch } from 'vue'
import { useToast } from 'vue-toast-notification'
const authStore = useAuthStore()
const userRef = toRef(authStore, 'user')
const categoryStore = useCategoryStore()
const toast = useToast()
const categories = ref([])
const params = ref({ user_id: null, page: 1, per_page: 10, color: null, name: null })
const loading = ref(false)
const error = ref(null)

const confirmDialog = ref(false)
const selectedCategory = ref({ id: null, name: '' })

const openConfirmDialog = (id, name) => {
  selectedCategory.value = { id, name }
  confirmDialog.value = true
}

const handleDelete = async () => {
  try {
    await categoryStore.deleteCategory(selectedCategory.value.id, authStore.user.id)
    confirmDialog.value = false
    toast.success(`Category ${selectedCategory.value.name} berhasil dihapus`)
    loading.value = true
    await categoryStore.fetchCategories(params.value)
    categories.value = categoryStore.categories?.data ?? categoryStore.categories ?? []
    loading.value = false
  } catch (error) {
    console.error(error)
  }
}
let stopWatch = null
stopWatch = watch(
  userRef,
  async newUser => {
    if (!newUser) return
    params.value.user_id = newUser.id
    try {
      loading.value = true
      await categoryStore.fetchCategories(params.value)
      categories.value = categoryStore.categories?.data ?? categoryStore.categories ?? []
    } catch (err) {
      console.error(err)
      error.value = 'Gagal memuat categories'
    } finally {
      loading.value = false
      // kalau cuma perlu sekali, hentikan watch
      stopWatch && stopWatch()
    }
  },
  { immediate: true },
)

// bersihkan ketika komponen ter-unmount (opsional)
onBeforeUnmount(() => {
  stopWatch && stopWatch()
})
</script>
