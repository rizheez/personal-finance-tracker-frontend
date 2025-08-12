<script setup>
import { useAuthStore } from '@/stores/auth'
import { useCategoryStore } from '@/stores/category'
import { useTransactionStore } from '@/stores/transaction'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const transactionStore = useTransactionStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()
const categories = ref([])
const toast = useToast()
const route = useRoute()
const router = useRouter()
const transactionId = route.params.id // Ambil ID dari URL

const params = ref({
  user_id: authStore.user?.id,
})

const loading = ref(false)
const error = ref(null)
const errors = ref({})

const form = ref({
  date: '',
  name: '',
  description: '',
  category_id: null,
  amount: null,
  type: '',
})

const goBack = () => router.push('/transaction')

onMounted(async () => {
  try {
    loading.value = true

    await categoryStore.fetchCategories(params.value)
    categories.value = categoryStore.categories

    // Ambil detail transaksi dari store
    const transaction = await transactionStore.getTransactionById(transactionId)
    const { data } = transaction
    console.log(transaction, 'Transaction Data')
    // Isi form dengan data yang didapat
    form.value = {
      date: data.date,
      name: data.name,
      description: data.description,
      category_id: data.category_id,
      amount: data.amount,
      type: data.type,
    }
  } catch (err) {
    toast.error('Failed to load transaction data')
    goBack()
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  // Validasi sederhana
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name is required'
  if (!form.value.amount) errors.value.amount = 'Amount is required'
  if (!form.value.category_id) errors.value.category_id = 'Category is required'
  if (!form.value.date) errors.value.date = 'Date is required'
  if (!form.value.type) errors.value.type = 'Type is required'
  if (Object.keys(errors.value).length) return

  loading.value = true
  try {
    await transactionStore.updateTransaction(transactionId, form.value)
    toast.success('Transaction updated successfully')
    router.push('/transaction')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Something went wrong'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-container max-width="800">
    <!-- Header -->
    <div class="d-flex align-center mb-1 text-center">
      <VBtn
        variant="text"
        @click="goBack"
      >
        <span class="me-2"><v-icon icon="ri-arrow-left-line"></v-icon></span>
        Back
      </VBtn>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">💳 Add New Transaction</h1>
        <p class="text-gray-600">Record your income or expense</p>
      </div>
    </div>

    <!-- Form -->
    <VCard
      class="pa-6 mx-auto"
      elevation="2"
    >
      <VForm @submit.prevent="handleSubmit">
        <!-- Type -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
          <div class="flex space-x-4">
            <VRadioGroup
              v-model="form.type"
              inline
            >
              <VRadio
                label="📈 Income"
                value="income"
              />
              <VRadio
                label="📉 Expense"
                value="expense"
              />
            </VRadioGroup>
          </div>
          <VErrorMessage :error="errors.type" />
        </div>

        <!-- Grid Fields -->
        <VRow class="gap-6 mb-6">
          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              label="Date *"
              type="date"
              v-model="form.date"
              :error-messages="errors.date"
            />
          </VCol>

          <VCol
            cols="12"
            md="6"
          >
            <VTextField
              label="Amount *"
              type="number"
              step="0.01"
              min="0"
              prepend-inner="$"
              v-model="form.amount"
              :error-messages="errors.amount"
            />
          </VCol>
        </VRow>

        <VTextField
          label="Transaction Name *"
          v-model="form.name"
          :error-messages="errors.name"
          class="mb-6"
        />

        <VSelect
          label="Category *"
          :items="categories"
          item-title="name"
          item-value="id"
          v-model="form.category_id"
          :error-messages="errors.category_id"
          class="mb-6"
        />

        <VTextarea
          label="Description (Optional)"
          rows="3"
          v-model="form.description"
          :error-messages="errors.description"
          class="mb-6"
        />

        <!-- Actions -->
        <div class="d-flex justify-end ml-auto space-x-3 pt-6 border-t border-gray-200">
          <VBtn
            variant="outlined"
            :loading="loading"
            @click="goBack"
            >Cancel</VBtn
          >
          <VBtn
            type="submit"
            color="primary"
            class="ms-2"
            :loading="loading"
            :disabled="!categories.length"
          >
            <v-icon
              icon="ri-save-3-line"
              class="me-2"
            ></v-icon>
            Save Transaction
          </VBtn>
        </div>
      </VForm>
    </VCard>

    <!-- Tips -->
    <VAlert
      type="info"
      variant="tonal"
      border="start"
      class="mt-4"
    >
      <template #title>💡 Tips for Better Tracking</template>
      <ul class="text-sm pl-4 list-disc space-y-1">
        <li>Use descriptive names that will help you remember the transaction later</li>
        <li>Select the most appropriate category for better reporting</li>
        <li>Add descriptions for unusual or large transactions</li>
        <li>Keep your transaction dates accurate for better analysis</li>
      </ul>
    </VAlert>
  </v-container>
</template>
