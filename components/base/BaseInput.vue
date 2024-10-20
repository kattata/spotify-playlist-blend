<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    loading?: boolean;
    disabled?: boolean;
    type?: string;
    label?: string;
  }>(),
  {
    modelValue: '',
    type: 'text',
    label: undefined
  }
);

const value = defineModel<string>();
</script>

<template>
  <div class="input-wrapper">
    <label v-if="props.label" class="label">{{ props.label }}</label>
    <input v-model="value" class="input" :type="props.type" v-bind="$attrs" />
  </div>
</template>

<style lang="postcss" scoped>
.label {
  font-size: var(--font-size-s);
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input {
  padding: 12px;
  border-radius: var(--border-radius-small);
  outline: 0;
  border: 1px solid var(--color-line);
  font-family: var(--font-family-base);
}
</style>
