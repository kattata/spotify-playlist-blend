<script lang="ts" setup>
useHead({
  title: 'Spotify Playlist Blend'
});

const route = useRoute();
const code = route.query.code;
// const error = route.query.error; // TODO: Handle error
const accessToken = useCookie('accessToken', { maxAge: 60 * 60 });

const friendUserId = ref<string>('');

const profileData = ref<SpotifyApi.CurrentUsersProfileResponse | null>(null);
const myPlaylistData = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null);
const friendData = ref<SpotifyApi.UserObjectPublic | null>(null);
const friendPlaylistData = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null);

onMounted(async () => {
  if (code) {
    if (!accessToken.value) {
      await useAuth().signinCallback();
      const user = await useAuth().getUser();

      accessToken.value = user?.access_token;

      fetchMe();

      navigateTo('/');
    }
  }
});

if (accessToken.value) {
  fetchMe();
}

async function handleAuth() {
  await useAuth().signinRedirect();
}

async function fetchMe() {
  try {
    const { data } = await useFetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    });

    if (data.value) {
      profileData.value = data.value;
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

async function fetchUser(userId: string) {
  try {
    const { data } = await useFetch(`https://api.spotify.com/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    });

    return data.value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function handleChooseFriendSubmit() {
  if (friendUserId.value.length) {
    const userData = await fetchUser(friendUserId.value);

    if (userData) {
      friendData.value = userData;
    }

    const playlistData = await fetchPlaylists(friendUserId.value);

    if (playlistData) {
      friendPlaylistData.value = playlistData;
    }
  }
}

async function fetchPlaylists(userId: string) {
  try {
    const { data } = await useFetch<Promise<SpotifyApi.ListOfUsersPlaylistsResponse>>(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        headers: { Authorization: `Bearer ${accessToken.value}` }
      }
    );

    return data.value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}
</script>

<template>
  <div class="front-page">
    <div class="container">
      <template v-if="accessToken">
        <div class="authentication-success">
          <p>You have been successfully authenticated as</p>
          <div class="authentication-success-profile">
            <BaseImage v-if="profileData?.images?.[0]?.url" :src="profileData?.images?.[0]?.url" width="30px" />
            <strong>{{ profileData?.display_name }}</strong>
          </div>
        </div>

        <div class="choose-friend">
          <h2>Choose friend to blend with</h2>
          <form @submit.prevent="handleChooseFriendSubmit">
            <BaseInput v-model="friendUserId" label="User ID" />
            <BaseButton type="submit"> Submit </BaseButton>
          </form>
        </div>

        <BlendStep1 :my-playlists="myPlaylistData" :friend-playlists="friendPlaylistData" :friend-name="friendData?.display_name" />
      </template>

      <template v-else>
        <BaseButton @click="handleAuth"> Authenticate </BaseButton>
      </template>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.front-page {
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
    gap: 16px;
    margin-top: 16px;
    padding-bottom: 16px;
  }

  .choose-friend {
    padding-block: 32px;
    margin-bottom: 40px;
    border-bottom: 1px solid var(--color-line);

    form {
      display: flex;
      gap: 16px;
      align-items: flex-end;
    }

    :deep(.input-wrapper) {
      max-width: 300px;
    }
  }
}
</style>
