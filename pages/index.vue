<script lang="ts" setup>
useHead({
  title: 'Spotify Playlist Blend'
});

const route = useRoute();
const code = route.query.code;
// const error = route.query.error; // TODO: Handle error
const accessToken = useCookie('accessToken', { maxAge: 60 * 60 });

const profileData = ref<SpotifyApi.CurrentUsersProfileResponse | null>(null);
const myPlaylistData = ref<SpotifyApi.ListOfUsersPlaylistsResponse | null>(null);

onMounted(async () => {
  if (code) {
    if (!accessToken.value) {
      await useAuth().signinCallback();
      const user = await useAuth().getUser();

      accessToken.value = user?.access_token;

      fetchProfile();

      navigateTo('/');
    }
  }
});

if (accessToken.value) {
  fetchProfile();
}

async function handleAuth() {
  await useAuth().signinRedirect();
}

async function fetchProfile() {
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
    fetchPlaylists();
  }
}

async function fetchPlaylists() {
  try {
    if (!profileData.value?.id) {
      return;
    }

    const { data } = await useFetch(`https://api.spotify.com/v1/users/${profileData.value.id}/playlists`, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    });

    if (data.value) {
      myPlaylistData.value = data.value;
    }
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
            <BaseImage v-if="profileData?.images?.[0]?.url" :src="profileData?.images?.[0]?.url" width="70px" />
            <strong>{{ profileData?.display_name }}</strong>
          </div>
        </div>

        <template v-if="myPlaylistData">
          <BlendStep1 :my-playlists="myPlaylistData" :friend-playlists="myPlaylistData" />
        </template>
      </template>

      <template v-else>
        <BaseButton @click="handleAuth"> Authenticate </BaseButton>
      </template>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.front-page {
  .authentication-success-profile {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
    margin-bottom: 40px;
  }

  img {
    border-radius: 50%;
  }

  p {
    margin: 0;
  }
}
</style>
