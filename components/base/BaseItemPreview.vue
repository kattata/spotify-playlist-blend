<script lang="ts" setup>
interface Props {
  image?: string;
  name: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="item-preview">
    <div class="item-preview-details">
      <template v-if="props.image">
        <BaseImage :src="props.image" width="50px" />
      </template>
      <div>{{ props.name }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<style lang="postcss" scoped>
.item-preview {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 100px;
  gap: 16px;
  border-bottom: 1px solid var(--color-line);
  padding: 12px;

  &-details {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
</style>
