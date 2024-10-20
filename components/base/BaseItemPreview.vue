<script lang="ts" setup>
interface Props {
  image?: string;
  name: string;
  description?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="item-preview">
    <div class="item-preview-details">
      <template v-if="props.image">
        <BaseImage class="item-preview-image" :src="props.image" width="50px" />
      </template>
      <template v-else>
        <div class="item-preview-image"></div>
      </template>
      <div>
        <div>{{ props.name }}</div>
        <div v-if="props.description" class="item-preview-description">
          {{ props.description }}
        </div>
      </div>
    </div>
    <div class="item-preview-slot">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.item-preview {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 150px;
  gap: 16px;
  border-bottom: 1px solid var(--color-line);
  padding: 12px;

  &-image {
    background-color: var(--color-background);
    width: 50px;
    aspect-ratio: 1/1;
    object-fit: cover;
  }

  &-details {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &-description {
    font-size: var(--font-size-s);
    margin-top: 4px;
  }

  &-slot {
    justify-self: end;
  }
}
</style>
