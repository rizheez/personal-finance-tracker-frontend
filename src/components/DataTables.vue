<script setup>
import api from '@/plugins/axios'
import debounce from 'lodash.debounce'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  fetchUrl: { type: String, required: true },
  queryParams: { type: Object, default: () => ({}) },
  columns: { type: Array, required: true },
  title: { type: String, required: true, default: 'Table' },
  emoji: { type: String, required: true, default: '📊' },
})

const emit = defineEmits(['loading', 'error'])

const items = ref([])
const meta = ref({})
const loading = ref(false)
const currentPage = ref(1)
const search = ref('')
const debouncedSearch = ref('')

const fetchData = async () => {
  loading.value = true
  emit('loading', true)

  try {
    const response = await api.get(props.fetchUrl, {
      params: {
        page: currentPage.value,
        search: debouncedSearch.value,
        ...props.queryParams,
      },
    })
    items.value = response.data.data
    meta.value = response.data.meta
    emit('error', null)
  } catch (error) {
    emit('error', error)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

// Debounce update untuk search
const updateDebouncedSearch = debounce(val => {
  debouncedSearch.value = val
}, 500)

watch(search, val => {
  updateDebouncedSearch(val)
})

// Trigger fetchData saat fetchUrl, queryParams, currentPage, atau debouncedSearch berubah
watch(() => [props.fetchUrl, props.queryParams, currentPage.value, debouncedSearch.value], fetchData, { deep: true })

onMounted(fetchData)
</script>

<template>
  <VCard class="py-4">
    <!-- Header -->
    <VCardTitle class="d-flex align-center justify-space-between">
      <span class="text-h3 font-weight-bold"> {{ emoji }} {{ title }} </span>
      <slot name="addButton" />
    </VCardTitle>

    <VCardText class="mt-4">
      <!-- Filters -->
      <div class="d-flex align-center justify-space-between">
        <div
          v-if="$slots.filters"
          class="mb-4"
        >
          <slot name="filters" />
        </div>

        <VTextField
          v-model="search"
          label="Search"
          variant="outlined"
          class="ml-auto"
          dense
          prepend-inner-icon="ri-search-line"
          hide-details
          clearable
          style="max-inline-size: 300px"
        />
      </div>

      <!-- Data Table -->
      <VDataTable
        :headers="columns"
        :items="items"
        :loading="loading"
        class="elevation-1 mt-4"
        density="comfortable"
        hover
      >
        <!-- Custom Loading -->
        <template #loading>
          <VSkeletonLoader type="table-row@10" />
        </template>
        <!-- Numbering Column -->
        <template #item.index="{ index }">
          {{ (currentPage - 1) * 10 + index + 1 }}
        </template>
        <!-- No Data -->
        <!-- custom slot items -->
        <!-- Dynamic slots untuk setiap kolom -->
        <template
          v-for="header in columns"
          v-slot:[`item.${header.key}`]="{ item }"
        >
          <slot
            :name="`item.${header.key}`"
            :value="item[header.key]"
            :item="item"
          >
            {{ item[header.key] }}
          </slot>
        </template>
        <template #no-data>
          <div class="text-center py-8">
            <VIcon
              icon="mdi-database-off"
              size="48"
              color="grey"
              class="mb-4"
            />
            <p class="text-grey">No data found</p>
          </div>
        </template>

        <!-- Action Buttons Slot -->
        <!-- <template #item.actions="{ item }">
          <slot
            name="actions"
            :item="item"
          />
        </template> -->
      </VDataTable>

      <!-- Pagination Info -->
      <div class="d-flex align-center justify-space-between mt-4">
        <div class="text-caption text-grey">
          Showing {{ meta?.from || 0 }} to {{ meta?.to || 0 }} of {{ meta?.total || 0 }} entries
        </div>
        <VPagination
          v-if="meta?.last_page > 1"
          v-model="currentPage"
          :length="meta.last_page"
          :total-visible="5"
        />
      </div>
    </VCardText>
  </VCard>
</template>
