<template>
  <VContainer
    fluid
    class="py-6"
  >
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold">💰 Financial Overview</h1>
        <p class="text-body-2 text-grey">Track your income, expenses, and categories</p>
      </div>
    </div>

    <!-- Loading State -->
    <VRow
      v-if="loading"
      dense
    >
      <VCol
        cols="12"
        md="3"
        v-for="n in 4"
        :key="n"
      >
        <VSkeletonLoader type="card" />
      </VCol>
    </VRow>

    <!-- Summary Cards -->
    <VRow
      v-else
      dense
    >
      <VCol
        cols="12"
        md="3"
      >
        <VCard class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-subtitle-1 font-weight-medium">Total Income</h3>
              <p class="text-h6 font-weight-bold text-success">
                {{ formatCurrency(summary?.total_income) }}
              </p>
            </div>
            <VIcon
              icon="ri-money-dollar-circle-line"
              size="36"
              color="success"
            />
          </div>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
      >
        <VCard class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-subtitle-1 font-weight-medium">Total Expense</h3>
              <p class="text-h6 font-weight-bold text-error">
                {{ formatCurrency(summary?.total_expense) }}
              </p>
            </div>
            <VIcon
              icon="ri-money-dollar-circle-line"
              size="36"
              color="error"
            />
          </div>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
      >
        <VCard class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-subtitle-1 font-weight-medium">Net Balance</h3>
              <p
                class="text-h6 font-weight-bold"
                :class="netBalance >= 0 ? 'text-success' : 'text-error'"
              >
                {{ formatCurrency(netBalance) }}
              </p>
            </div>
            <VIcon
              icon="ri-wallet-line"
              size="36"
              color="info"
            />
          </div>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="3"
      >
        <VCard class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h3 class="text-subtitle-1 font-weight-medium">Total Transactions</h3>
              <p class="text-h6 font-weight-bold">
                {{ summary?.total_transaction || 0 }}
              </p>
            </div>
            <VIcon
              icon="ri-exchange-line"
              size="36"
              color="primary"
            />
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- Charts & Recent Transactions -->
    <VRow
      class="mt-6"
      elevation
    >
      <!-- Monthly Summary -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard
          class="pa-4"
          height="300"
        >
          <VCardTitle>
            <div class="d-flex justify-space-between">
              <span>📈 Monthly Summary</span>
              <v-icon icon="ri-pie-chart-line"></v-icon>
            </div>
          </VCardTitle>
          <VCardText>
            <template v-if="loading">
              <VSkeletonLoader
                v-for="n in 6"
                :key="'monthly-' + n"
                type="list-item-two-line"
                class="mb-2"
              />
            </template>
            <template v-else>
              <div
                v-for="(item, index) in monthlySummary"
                :key="index"
                class="d-flex justify-space-between align-center py-1"
              >
                <div>{{ item.month }}</div>
                <div class="d-flex gap-4">
                  <span class="text-success">{{ formatCurrency(item.income) }}</span>
                  <span class="text-error">{{ formatCurrency(item.expense) }}</span>
                </div>
              </div>
            </template>
          </VCardText>
        </VCard>
      </VCol>

      <!-- Recent Transactions -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard
          class="pa-4"
          height="300"
        >
          <h3 class="font-weight-medium">💳 Recent Transactions</h3>
          <template v-if="loading">
            <VSkeletonLoader
              v-for="n in 5"
              :key="'recent-' + n"
              type="list-item-two-line"
              class="mb-2"
            />
          </template>
          <template v-else>
            <div v-if="recentTransactions?.length">
              <VList
                lines="two"
                density="comfortable"
              >
                <VListItem
                  v-for="tx in recentTransactions"
                  :key="tx.id"
                  class="rounded-lg mb-2"
                >
                  <template #prepend>
                    <VAvatar
                      color="primary"
                      size="32"
                    >
                      {{ tx.category_name?.charAt(0).toLowerCase() }}
                    </VAvatar>
                  </template>
                  <VListItemTitle class="font-weight-medium">
                    <span class="text-truncate">{{ tx.name }}</span>
                  </VListItemTitle>
                  <VListItemSubtitle> {{ tx.category.name }} · {{ formatDate(tx.date) }} </VListItemSubtitle>
                  <template #append>
                    <span
                      :class="tx.type === 'income' ? 'text-success' : 'text-error'"
                      class="font-weight-medium"
                    >
                      {{ tx.type === 'expense' ? '-' : '+' }}{{ formatCurrency(tx.amount) }}
                    </span>
                  </template>
                </VListItem>
              </VList>
            </div>
            <p
              v-else
              class="text-grey"
            >
              No recent transactions
            </p>
          </template>
        </VCard>
      </VCol>
    </VRow>
    <!-- Category Breakdown -->
    <v-card
      class="mt-6"
      dense
    >
      <h3 class="text-h6 pa-4 font-weight-medium mb-4">🏷️ Category Breakdown</h3>
      <v-row dense>
        <template v-if="loading">
          <v-col
            v-for="n in 6"
            :key="'cat-' + n"
            cols="12"
            sm="6"
            lg="4"
          >
            <VSkeletonLoader
              type="card"
              height="100"
            />
          </v-col>
        </template>
        <template v-else>
          <v-col
            v-for="(category, index) in categoryBreakdown"
            :key="index"
            cols="12"
            sm="6"
            lg="4"
          >
            <div
              class="pa-4"
              color="grey-lighten-4"
              rounded
            >
              <h4 class="text-subtitle-1 font-weight-medium mb-2">
                {{ category.name }}
              </h4>
              <div class="text-body-2">
                <div class="d-flex justify-space-between">
                  <span class="text-success">Income:</span>
                  <span class="font-weight-medium">{{ category.income }}</span>
                </div>
                <div class="d-flex justify-space-between">
                  <span class="text-error">Expense:</span>
                  <span class="font-weight-medium">{{ category.expense }}</span>
                </div>
                <div
                  class="d-flex justify-space-between pt-1 mt-1"
                  style="border-block-start: 1px solid #ccc"
                >
                  <span class="text-grey-darken-1">Net:</span>
                  <span
                    class="font-weight-medium"
                    :class="category.net < 0 ? 'text-error' : 'text-success'"
                  >
                    {{ category.net }}
                  </span>
                </div>
              </div>
            </div>
          </v-col>
        </template>
      </v-row>
    </v-card>

    <v-card
      class="mt-4 pa-4"
      color="blue-lighten-5"
      rounded="lg"
      dense
    >
      <h3 class="text-h6 mb-4">🚀 Quick Actions</h3>
      <v-row dense>
        <v-col
          cols="12"
          md="4"
        >
          <v-btn
            block
            to="/transaction/add"
            class="text-white"
            prepend-icon="mdi-plus"
            rounded="lg"
          >
            Add New Transaction
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-btn
            block
            class="text-white"
            prepend-icon="mdi-clock-outline"
            rounded="lg"
            to="/categories"
          >
            Manage Categories
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-btn
            block
            class="text-white"
            prepend-icon="mdi-table"
            rounded="lg"
            to="/transaction"
          >
            View All Transactions
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </VContainer>
</template>

<script setup>
import api from '@/plugins/axios'
import { computed, onMounted, ref } from 'vue'

const loading = ref(true)
const summary = ref(null)
const monthlySummary = ref([])
const recentTransactions = ref([])
const categoryBreakdown = ref([])
const formatMonth = month => {
  // Contoh input month: "2025-03" atau "Mar 2025"
  const date = new Date(month)
  return date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}

const formatDate = date => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}
const netBalance = computed(() => {
  if (!summary.value) return 0
  return (summary.value.total_income || 0) - (summary.value.total_expense || 0)
})

const formatCurrency = value => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(value || 0)
}

onMounted(async () => {
  try {
    const [summaryRes, monthlySummaryRes, recentTransactionsRes, categoryBreakdownRes] = await Promise.all([
      api.get('/dashboard/summary'),
      api.get('/dashboard/monthly-summary'),
      api.get('/dashboard/recent-transactions'),
      api.get('/dashboard/category-breakdown'),
    ])

    summary.value = summaryRes.data
    monthlySummary.value = monthlySummaryRes.data
    recentTransactions.value = recentTransactionsRes.data
    categoryBreakdown.value = categoryBreakdownRes.data
  } catch (error) {
    console.error('Error fetching dashboard data', error)
  } finally {
    loading.value = false
  }
})
</script>
