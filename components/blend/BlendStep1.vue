<script lang="ts" setup>
import type { BlendItem } from '~/types';

interface Props {
  myPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  friendPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
}

const props = defineProps<Props>();

const blendItem = ref<BlendItem>({
  me: null,
  friend: null
});

function handleAddToBlend(playlist: SpotifyApi.PlaylistObjectSimplified, scope: 'me' | 'friend') {
  if (scope === 'me') {
    blendItem.value.me = {
      playlistId: playlist.id,
      playlistName: playlist.name
    };
  } else {
    blendItem.value.friend = {
      playlistId: playlist.id,
      playlistName: playlist.name
    };
  }

  if (blendItem.value.me && blendItem.value.friend) {
    navigateTo({
      path: '/blend/create-blend',
      query: {
        mePlaylistId: blendItem.value.me.playlistId,
        mePlaylistName: blendItem.value.me.playlistName,
        friendPlaylistId: blendItem.value.friend.playlistId,
        friendPlaylistName: blendItem.value.friend.playlistName
      }
    });
  }
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
                <BaseButton @click="handleAddToBlend(item, 'me')"> Add to blend </BaseButton>
              </BaseItemPreview>
            </template>
          </div>
        </div>
      </template>

      <template v-if="props.friendPlaylists">
        <div class="playlists-wrapper">
          <h2>Their playlists</h2>
          <div class="playlists">
            <template v-for="item in props.friendPlaylists?.items" :key="`friend-playlist__${item.id}`">
              <BaseItemPreview :image="item.images?.[0].url" :name="item.name">
                <BaseButton @click="handleAddToBlend(item, 'friend')"> Add to blend </BaseButton>
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

  &-item {
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 100px;
    gap: 16px;
    border-bottom: 1px solid var(--color-line);
    padding: 12px;
  }

  &-item-details {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}
</style>
