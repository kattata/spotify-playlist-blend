<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to: string;
    target?: string;
  }>(),
  {
    to: '',
    target: '_self'
  }
);
</script>

<template>
  <NuxtLink :to="props.to" :target="props.target">
    <slot></slot>
  </NuxtLink>
</template>

<style lang="postcss" scoped>
a {
  color: var(--color-text);
  text-decoration: none;
  font-size: var(--font-size-m);
  transition: color 0.3s ease-in-out;

  &:hover {
    color: var(--color-light-black);
  }
}
</style>
