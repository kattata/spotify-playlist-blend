<script lang="ts" setup>
import type { BlendItem } from '~/types';

interface Props {
  blendItem: BlendItem;
}

const props = defineProps<Props>();

function handleCreateBlend() {
  if (props.blendItem.me && props.blendItem.friend) {
    navigateTo({
      path: '/blend/create-blend',
      query: {
        mePlaylistId: props.blendItem.me.playlistIds,
        friendPlaylistId: props.blendItem.friend.playlistIds
      }
    });
  }
}
</script>

<template>
  <template v-if="props.blendItem.me && props.blendItem.friend">
    <div class="confirm-blend">
      <div>Create blend?</div>
      <BaseButton @click="handleCreateBlend">Confirm</BaseButton>
    </div>
  </template>
</template>

<style lang="postcss" scoped>
.confirm-blend {
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 16px;
  max-width: 500px;
}
</style>
