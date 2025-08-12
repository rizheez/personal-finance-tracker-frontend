<script setup>
import { formatRupiah } from '@/@core/utils/helpers'
import DataTables from '@/components/DataTables.vue'
import { useAuthStore } from '@/stores/auth'
import { useTransactionStore } from '@/stores/transaction'
import { useToast } from 'vue-toast-notification'
const columns = [
  { title: 'Date', key: 'date' },
  { title: 'Transaction', key: 'name' },
  { title: 'Category', key: 'category' },
  { title: 'Type', key: 'type' },
  { title: 'Total', key: 'amount' },
  { title: 'Aksi', key: 'actions', sortable: false },
]
const transactionStore = useTransactionStore()
const authStore = useAuthStore()
const toast = useToast()
const loading = null
const error = null
const filters = ref({
  user_id: null,
  page: 1,
  per_page: 10,
  category_id: '',
  type: '',
  date: '',
  with: ['category'],
})

let stopWatch = watch(
  () => authStore.user,
  newUser => {
    if (newUser) {
      filters.value.user_id = newUser.id
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  stopWatch && stopWatch()
})
const confirmDeleteDialog = ref(false)
const selectedTransactionId = ref(null)
const confirmDelete = id => {
  confirmDeleteDialog.value = true
  selectedTransactionId.value = id
}

const deleteTransaction = async () => {
  try {
    await transactionStore.deleteTransaction(selectedTransactionId.value)
    confirmDeleteDialog.value = false
    toast.success('Transaction deleted successfully')
    // Optionally, you can trigger a refresh of the data table here
  } catch (error) {
    console.error('Error deleting transaction:', error)
    toast.error('Failed to delete transaction')
  }
}
</script>

<template>
  <DataTables
    fetch-url="transactions"
    :title="'Transactions'"
    :emoji="'💰'"
    :columns="columns"
    :query-params="filters"
    @loading="val => (loading = val)"
    @error="err => (error = err)"
  >
    <template #addButton>
      <VBtn
        color="primary"
        prepend-icon="ri-file-add-line"
        to="/transaction/create"
        >Add Transaction</VBtn
      >
    </template>

    <template v-slot:item.category="{ value }">
      <VRow
        align="center"
        no-gutters
        class="ma-0"
      >
        <div
          class="rounded-circle me-2"
          :style="{
            width: '12px',
            height: '12px',
            backgroundColor: value?.color ?? '#ccc',
          }"
        ></div>
        <span>{{ value?.name ?? '-' }}</span>
      </VRow>
    </template>

    <template v-slot:item.type="{ value }">
      <VChip
        :color="value === 'income' ? 'success' : 'error'"
        size="small"
        class="font-weight-medium"
      >
        {{ value === 'income' ? '📈 income' : '📉 expense' }}
      </VChip>
    </template>

    <template v-slot:item.amount="{ value }">
      {{ formatRupiah(value) }}
    </template>

    <template #item.actions="{ item }">
      <VBtn
        icon="ri-pencil-line"
        size="small"
        variant="text"
        color="warning"
        :to="`/transaction/${item.id}/edit`"
      />
      <VBtn
        icon="ri-delete-bin-5-line"
        size="small"
        variant="text"
        color="error"
        @click="confirmDelete(item.id)"
      />
    </template>
  </DataTables>
  <v-dialog
    v-model="confirmDeleteDialog"
    max-width="300"
  >
    <v-card>
      <v-card-title class="text-h5">Confirm Delete</v-card-title>
      <v-card-text>Are you sure you want to delete this transaction?</v-card-text>
      <v-card-actions>
        <VBtn
          color="primary"
          variant="flat"
          @click="confirmDeleteDialog = false"
          >Cancel</VBtn
        >
        <VBtn
          color="error"
          variant="flat"
          @click="deleteTransaction"
          >Delete</VBtn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
