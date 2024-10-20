<script lang="ts" setup>
import type { BlendItem } from '~/types';

interface Props {
  myPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  friendPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  friendName: string | undefined;
  modelValue: BlendItem;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:blendItem': [BlendItem];
}>();

const internalBlendItem = defineModel<BlendItem>({
  required: true,
  get: () => props.modelValue
});

function handleAddToBlend(playlist: SpotifyApi.PlaylistObjectSimplified, scope: 'me' | 'friend') {
  if (scope === 'me') {
    internalBlendItem.value.me = {
      playlistId: playlist.id,
      playlistName: playlist.name
    };
  } else {
    internalBlendItem.value.friend = {
      playlistId: playlist.id,
      playlistName: playlist.name
    };
  }

  emit('update:blendItem', internalBlendItem.value);

  // if (blendItem.value.me && blendItem.value.friend) {
  //   navigateTo({
  //     path: '/blend/create-blend',
  //     query: {
  //       mePlaylistId: blendItem.value.me.playlistId,
  //       mePlaylistName: blendItem.value.me.playlistName,
  //       friendPlaylistId: blendItem.value.friend.playlistId,
  //       friendPlaylistName: blendItem.value.friend.playlistName
  //     }
  //   });
  // }
}

function getIsAddedToBlend(playlist: SpotifyApi.PlaylistObjectSimplified) {
  return playlist.id === internalBlendItem.value.me?.playlistId || playlist.id === internalBlendItem.value.friend?.playlistId;
}
</script>

<template>
  <div class="blend-step">
    <section>
      <template v-if="props.myPlaylists">
        <div class="playlists-wrapper">
          <h2>Your playlists</h2>
          <div class="playlists">
            <template v-for="item in props.myPlaylists?.items" :key="`my-playlist__${item.id}`">
              <BaseItemPreview :image="item.images?.[0].url" :name="item.name">
                <template v-if="getIsAddedToBlend(item)">
                  <BaseIcon name="checkmark" />
                </template>
                <template v-else>
                  <BaseButton @click="handleAddToBlend(item, 'me')"> Add to blend </BaseButton>
                </template>
              </BaseItemPreview>
            </template>
          </div>
        </div>
      </template>

      <template v-if="props.friendPlaylists">
        <div class="playlists-wrapper">
          <h2>
            <template v-if="props.friendName"> {{ props.friendName }}'s playlists </template>
            <template v-else> Their playlists </template>
          </h2>
          <div class="playlists">
            <template v-for="item in props.friendPlaylists?.items" :key="`friend-playlist__${item.id}`">
              <BaseItemPreview :image="item.images?.[0].url" :name="item.name">
                <template v-if="getIsAddedToBlend(item)">
                  <BaseIcon name="checkmark" />
                </template>
                <template v-else>
                  <BaseButton @click="handleAddToBlend(item, 'friend')"> Add to blend </BaseButton>
                </template>
              </BaseItemPreview>
            </template>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.playlists {
  display: flex;
  flex-direction: column;
  gap: 16px;

  :deep(.icon) {
    font-size: 24px;
  }
}
</style>
