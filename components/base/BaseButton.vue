<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    to?: string;
    loading?: boolean;
    disabled?: boolean;
    modifiers?: string[];
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  }>(),
  {
    to: () => '',
    modifiers: () => [],
    type: 'button',
    variant: 'primary'
  }
);

const buttonClasses = computed(() => {
  const variant = `button--${props.variant}`;

  if (!props.modifiers?.length) {
    return variant;
  }

  const modifiers = props.modifiers.map((x: any) => `button--${x}`).join(' ');

  return [variant, ...modifiers];
});

const isDisabled = computed(() => {
  return props.disabled || props.loading;
});
</script>

<template>
  <button class="reset-button button" :class="`${buttonClasses}`" :disabled="isDisabled" :type="type">
    <slot></slot>
  </button>
</template>

<style lang="postcss" scoped>
.button {
  border: 1px solid var(--color-line);
  background-color: var(--color-white);
  padding: 12px 20px;
  font-size: var(--font-size-s);
  border-radius: var(--border-radius-medium);
  white-space: nowrap;
  width: fit-content;
  height: fit-content;

  &--ghost {
    border: 0;
    background-color: transparent;
  }
}
</style>
