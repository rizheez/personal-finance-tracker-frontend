<script setup>
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/category'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const categoryId = route.params.id // misal path: /categories/:id/edit
const colorOptions = [
  '#10B981',
  '#F59E0B',
  '#3B82F6',
  '#8B5CF6',
  '#EF4444',
  '#06B6D4',
  '#84CC16',
  '#14B8A6',
  '#F97316',
  '#6366F1',
  '#EC4899',
  '#64748B',
]

const formRef = ref(null)
const processing = ref(false)
const loading = ref(true) // untuk loading awal ambil data

const form = ref({
  name: '',
  color: '#3B82F6',
  description: '',
  user_id: null,
})

const errors = ref({})

const nameInitial = computed(() => {
  return form.value.name ? form.value.name.charAt(0).toUpperCase() : '?'
})

function selectColor(color) {
  form.value.color = color
}

function goBack() {
  router.push('/categories')
}

async function fetchCategory() {
  try {
    loading.value = true
    const { data } = await categoryStore.getCategoryById(categoryId)
    form.value = {
      name: data.name,
      color: data.color,
      description: data.description ?? '',
      user_id: data.user_id,
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  errors.value = {}

  if (!form.value.name) {
    errors.value.name = 'Name is required'
    return
  }
  if (!form.value.color) {
    errors.value.color = 'Color is required'
    return
  }

  processing.value = true
  try {
    await categoryStore.updateCategory(categoryId, form.value)
    router.push('/categories')
  } catch (err) {
    if (err?.response?.data?.errors) {
      const laravelErrors = err.response.data.errors
      for (const key in laravelErrors) {
        if (Object.prototype.hasOwnProperty.call(laravelErrors, key)) {
          errors.value[key] = laravelErrors[key][0]
        }
      }
    } else if (err?.response?.data?.message) {
      errors.value.general = err.response.data.message
    } else {
      errors.value.general = 'Terjadi kesalahan saat mengupdate kategori'
    }
  } finally {
    processing.value = false
  }
}

onMounted(() => {
  fetchCategory()
})
</script>

<template>
  <v-card
    class="pa-6 mx-auto"
    elevation="2"
    max-width="800"
    outlined
  >
    <!-- Header -->
    <div class="d-flex align-center mb-1">
      <v-btn
        variant="text"
        class="me-3"
        @click="goBack"
      >
        <!-- simple back icon -->
        <span class="me-2"><v-icon icon="ri-arrow-left-line"></v-icon></span> Back
      </v-btn>

      <div>
        <h1 class="text-h5 font-weight-bold mb-1 mt-1">🏷️ Edit Category</h1>
        <p class="text-body-2">Edit a category to organize your transactions</p>
      </div>
    </div>

    <v-card-text>
      <v-form
        ref="formRef"
        @submit.prevent="handleSubmit"
        lazy-validation
      >
        <!-- Name -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="form.name"
              label="Category Name *"
              :rules="[v => !!v || 'Name is required']"
              :error="!!errors.name"
              :error-messages="errors.name ? [errors.name] : []"
              dense
              outlined
            />
          </v-col>
        </v-row>

        <!-- Color Selection -->
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="d-flex align-center mb-2">
              <v-icon class="me-2">palette</v-icon>
              <div class="subtitle-2">Category Color *</div>
            </div>

            <v-row dense>
              <v-col
                v-for="color in colorOptions"
                :key="color"
                cols="2"
                class="d-flex align-center"
              >
                <v-sheet
                  elevation="1"
                  rounded
                  width="48"
                  height="48"
                  :class="{
                    'scale-up': form.color === color,
                    'border-2': true,
                  }"
                  :style="{ backgroundColor: color, borderColor: form.color === color ? '#111827' : '#E5E7EB' }"
                  tile
                  @click="selectColor(color)"
                >
                  <div
                    v-if="form.color === color"
                    class="d-flex fill-height align-center justify-center"
                  >
                    <v-sheet
                      color="white"
                      width="10"
                      height="10"
                      rounded
                    ></v-sheet>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>

            <div class="d-flex align-center mt-3">
              <v-sheet
                width="16"
                height="16"
                rounded
                :style="{ backgroundColor: form.color }"
                class="me-2"
              ></v-sheet>
              <div class="caption">Selected: {{ form.color.toUpperCase() }}</div>
            </div>

            <div
              v-if="errors.color"
              class="caption text-danger mt-1"
            >
              {{ errors.color }}
            </div>
          </v-col>
        </v-row>

        <!-- Description -->
        <v-row>
          <v-col cols="12">
            <v-textarea
              v-model="form.description"
              label="Description (Optional)"
              rows="3"
              outlined
              :error="!!errors.description"
              :error-messages="errors.description ? [errors.description] : []"
            />
          </v-col>
        </v-row>

        <!-- Preview -->
        <v-row>
          <v-col cols="12">
            <v-sheet
              class="pa-4"
              elevation="0"
              rounded
              style="background: #f8fafc"
            >
              <div class="subtitle-2 font-weight-medium mb-2">Preview</div>
              <div class="d-flex align-center">
                <v-avatar
                  size="40"
                  :style="{ backgroundColor: form.color }"
                  class="me-3"
                >
                  <span class="text-white">{{ nameInitial }}</span>
                </v-avatar>
                <div>
                  <div class="body-1 font-weight-medium">{{ form.name || 'Category Name' }}</div>
                  <div
                    v-if="form.description"
                    class="caption text--secondary"
                  >
                    {{ form.description }}
                  </div>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <!-- Actions -->
        <v-row class="mt-4">
          <v-col
            cols="12"
            class="d-flex justify-end"
          >
            <v-btn
              variant="tonal"
              color="secondary"
              class="me-3"
              @click="goBack"
              :disabled="processing"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :loading="processing"
              type="submit"
            >
              <!-- simple save icon -->
              <span class="me-2">💾</span>
              {{ processing ? 'Creating...' : 'Create Category' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <!-- Helper Text -->
    <v-card-text class="mt-4">
      <v-sheet
        class="pa-3"
        elevation="0"
        rounded
        style="border: 1px solid #dbeafe; background: #eff6ff"
      >
        <div class="font-weight-medium mb-2">💡 Category Guidelines</div>
        <ul
          class="ma-0 pa-0"
          style="list-style: none"
        >
          <li class="caption">• Choose names that clearly describe the type of transactions</li>
          <li class="caption">• Use colors to create visual distinction between categories</li>
          <li class="caption">• Keep categories broad enough to group similar expenses</li>
          <li class="caption">• Consider both income and expense categories (e.g., "Salary" vs "Food")</li>
        </ul>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>
