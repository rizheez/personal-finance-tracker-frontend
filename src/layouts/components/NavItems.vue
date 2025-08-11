<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>

<template>
  <!-- 👉 Dashboards -->
  <VerticalNavLink
    :item="{
      title: 'Dashboards',
      icon: 'ri-home-smile-line',
      to: '/dashboard',
    }"
  />

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Apps & Pages',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Categories',
      icon: 'ri-list-check-2',
      to: '/categories',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Transaction',
      icon: 'ri-wallet-line',
      to: '/transaction',
    }"
  />
</template>
