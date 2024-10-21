<script lang="ts" setup>
import type { BlendItem, UserCookie } from '~/types';

useHead({
  title: 'Playlist Blend'
});

const user = useCookie<UserCookie>('user');

const { $spotifyApi } = useNuxtApp();

const profileData = ref<SpotifyApi.CurrentUsersProfileResponse | null>(null);
const myPlaylistData = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null);
const friendData = ref<SpotifyApi.UserObjectPublic | null>(null);
const friendPlaylistData = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null);

const blendItem = ref<BlendItem>({
  me: {
    playlistIds: []
  },
  friend: {
    playlistIds: []
  }
});

if (user.value?.accessToken) {
  fetchMe();
}

async function fetchMe() {
  try {
    const data = await $spotifyApi<SpotifyApi.CurrentUsersProfileResponse>('/v1/me', {
      method: 'get',
      headers: {
        Authorization: `Bearer ${user.value.accessToken}`
      }
    });

    if (data) {
      profileData.value = data;

      // Save user id in a cookie
      user.value.id = data.id;
      user.value.displayName = data.display_name;
      user.value.profileImage = data.images?.[0].url;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    if (profileData.value?.id) {
      const data = await fetchPlaylists(profileData.value.id);

      if (data) {
        myPlaylistData.value = data;
      }
    }
  }
}

async function fetchPlaylists(userId: string) {
  try {
    const data = await $spotifyApi<SpotifyApi.ListOfUsersPlaylistsResponse>(`/v1/users/${userId}/playlists`);

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function handleFriendSelected(userData: SpotifyApi.UserObjectPublic, friendId: string) {
  if (userData) {
    friendData.value = userData;
  }

  const playlistData = await fetchPlaylists(friendId);

  if (playlistData) {
    friendPlaylistData.value = playlistData;
  }
}
</script>

<template>
  <div class="page front-page">
    <div class="container">
      <div class="blend-actions">
        <BlendChooseFriend @user-selected="handleFriendSelected" />

        <template v-if="blendItem?.me.playlistIds.length && blendItem?.friend.playlistIds.length">
          <BlendConfirm :blend-item="blendItem" />
        </template>
      </div>

      <BlendStep1
        v-model="blendItem"
        :my-playlists="myPlaylistData"
        :friend-playlists="friendPlaylistData"
        :friend-name="friendData?.display_name"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.front-page {
  .blend-actions {
    padding-block: 32px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--color-line);
    display: grid;
    gap: 40px;
    grid-template-columns: 1fr @(min-width: 900px) 1fr 1fr;
  }
}
</style>
