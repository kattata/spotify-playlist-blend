<script lang="ts" setup>
interface Props {
  to?: string;
  text: string;
  size: 'small' | 'large';
}

const props = defineProps<Props>();

const component = computed(() => {
  return props.to ? resolveComponent('BaseLink') : 'div';
});
</script>

<template>
  <component :is="component" class="label" :to="props.to" :class="`label--${props.size}`">
    {{ props.text }}
  </component>
</template>

<style lang="postcss" scoped>
.label {
  border: 1px solid var(--color-line);
  width: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;

  &--small {
    border-radius: 24px;
    padding: 16px;
  }

  &--large {
    border-radius: 32px;
    padding: 20px;
  }
}
</style>
