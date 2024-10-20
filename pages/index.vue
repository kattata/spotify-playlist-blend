<script lang="ts" setup>
import type { BlendItem, UserCookie } from '~/types';

useHead({
  title: 'Playlist Blend'
});

const route = useRoute();
const code = route.query.code;
const { $spotifyApi } = useNuxtApp();

// const error = route.query.error; // TODO: Handle error
const user = useCookie<UserCookie>('user', { maxAge: 60 * 60 });

const profileData = ref<SpotifyApi.CurrentUsersProfileResponse | null>(null);
const myPlaylistData = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null);
const friendData = ref<SpotifyApi.UserObjectPublic | null>(null);
const friendPlaylistData = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null);

const blendItem = ref<BlendItem>({
  me: null,
  friend: null
});

onMounted(async () => {
  if (code) {
    if (!user.value) {
      await useAuth().signinCallback();

      const authUser = await useAuth().getUser();

      if (authUser?.access_token) {
        user.value = {
          accessToken: authUser.access_token
        };

        await nextTick(() => {
          fetchMe();
        });
      }

      navigateTo('/');
    }
  }
});

if (user.value?.accessToken) {
  fetchMe();
}

async function handleAuth() {
  await useAuth().signinRedirect();
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
      <template v-if="user?.accessToken">
        <div class="authentication-success">
          <p>You are logged in as</p>
          <div class="authentication-success-profile">
            <BaseImage v-if="profileData?.images?.[0]?.url" :src="profileData?.images?.[0]?.url" width="30px" />
            <strong>{{ profileData?.display_name }}</strong>
          </div>
        </div>

        <div class="blend-actions">
          <BlendChooseFriend @user-selected="handleFriendSelected" />

          <template v-if="blendItem?.me && blendItem?.friend">
            <BlendConfirm :blend-item="blendItem" />
          </template>
        </div>

        <BlendStep1
          v-model="blendItem"
          :my-playlists="myPlaylistData"
          :friend-playlists="friendPlaylistData"
          :friend-name="friendData?.display_name"
        />
      </template>

      <template v-else>
        <div class="intro">
          <h2>What is Playlist Blend?</h2>
          <p>
            Playlist Blend is a fun and simple way to combine your favorite playlists with a friend’s! Whether you’re creating the perfect
            soundtrack for a hangout, road trip, or just want to see how your music styles fit together, Playlist Blend makes it easy.
          </p>
          <p>All you have to do it connect your Spotify account and choose playlists you want to blend.</p>
          <BaseButton @click="handleAuth">Log in with Spotify</BaseButton>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.front-page {
  .intro {
    max-width: 600px;

    button {
      margin-top: 16px;
    }
  }

  .authentication-success {
    border-bottom: 1px solid var(--color-line);

    p,
    strong {
      font-size: var(--font-size-s);
      margin: 0;
    }

    img {
      border-radius: 50%;
    }
  }

  .authentication-success-profile {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding-bottom: 16px;
  }

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
