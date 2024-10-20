<script setup lang="ts">
const props = defineProps<{
  src: string;
}>();
</script>

<template>
  <NuxtImg :src="props.src" v-bind="$attrs" />
</template>
