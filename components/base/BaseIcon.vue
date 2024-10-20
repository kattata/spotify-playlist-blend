<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();
</script>

<template>
  <NuxtIcon :name="props.name" class="icon" width="300" :filled="true" />
</template>

<style lang="postcss" scoped>
.icon {
  width: 24px;
  height: 24px;
}
</style>
