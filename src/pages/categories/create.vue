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
        <h1 class="text-h5 font-weight-bold mb-1 mt-1">🏷️ Add New Category</h1>
        <p class="text-body-2">Create a category to organize your transactions</p>
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

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/category'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'
const toast = useToast()
const router = useRouter()
const categoryStore = useCategoryStore()

const colorOptions = [
  '#10B981', // Green
  '#F59E0B', // Orange
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#14B8A6', // Teal
  '#F97316', // Orange Alt
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#64748B', // Slate
]

const formRef = ref(null)
const processing = ref(false)
const authStore = useAuthStore()
const form = ref({
  name: '',
  color: '#3B82F6',
  description: '',
})

const errors = ref({}) // { name: '...', color: '...' }

const nameInitial = computed(() => {
  return form.value.name ? form.value.name.charAt(0).toUpperCase() : '?'
})

function selectColor(color) {
  form.value.color = color
}

function goBack() {
  router.push('/categories')
}

async function handleSubmit() {
  // clear errors
  errors.value = {}
  // client-side simple validation
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
    // Use Pinia store action (expects addCategory to return a Promise)
    const user_id = authStore.user.id
    form.value.user_id = user_id
    await categoryStore.addCategory(form.value)
    toast.success('Category berhasil dibuat')
    // success -> navigate back to categories list
    router.push('/categories')
  } catch (err) {
    // Map errors: support Laravel-style validation errors or message
    // err could be a string thrown by store or axios error object
    if (err?.response?.data?.errors) {
      // Laravel validation errors object
      const laravelErrors = err.response.data.errors
      for (const key in laravelErrors) {
        if (Object.prototype.hasOwnProperty.call(laravelErrors, key)) {
          errors.value[key] = laravelErrors[key][0]
        }
      }
    } else if (err?.response?.data?.message) {
      // general message
      errors.value.general = err.response.data.message
    } else if (typeof err === 'string') {
      errors.value.general = err
    } else {
      errors.value.general = 'Terjadi kesalahan saat membuat kategori'
    }
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
.scale-up {
  transform: scale(1.06);
  transition: transform 150ms ease;
}

.border-2 {
  border-width: 2px !important;
}
</style>
