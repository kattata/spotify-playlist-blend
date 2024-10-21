<script lang="ts" setup>
interface Props {
  modelValue: string[];
  id: string;
  image?: string;
  name: string;
  description?: string;
}

const emit = defineEmits<{
  'update:modelValue': [string[]];
}>();

const props = defineProps<Props>();

const value = defineModel<string[]>();

const isSelected = computed(() => {
  return props.modelValue.find(item => item === props.id);
});
</script>

<template>
  <div class="playlist-select">
    <div class="playlist-select-details">
      <template v-if="props.image">
        <BaseImage class="playlist-select-image" :src="props.image" width="50px" />
      </template>
      <template v-else>
        <div class="playlist-select-image"></div>
      </template>
      <div>
        <div>{{ props.name }}</div>
        <div v-if="props.description" class="playlist-select-description">
          {{ props.description }}
        </div>
      </div>
    </div>
    <div class="playlist-select-action">
      <input :id="props.id" v-model="value" type="checkbox" :value="props.id" />
      <label class="button" :for="props.id" :class="{ selected: isSelected }">
        <template v-if="isSelected">
          <BaseIcon name="checkmark" />
        </template>
        <template v-else>Add to blend</template>
      </label>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.playlist-select {
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

  &-action {
    justify-self: end;

    input {
      display: none;
    }
  }

  .selected {
    background-color: transparent;
    border: 0;
    padding: 12px;
  }
}
</style>
