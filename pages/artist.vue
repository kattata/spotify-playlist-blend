<script lang="ts" setup>
useHead({
  title: 'Spotify Playlist Blend | Artist'
});

const { spotifyClientId, spotifyClientSecret } = useRuntimeConfig().public;

const accessToken = useCookie('accessToken');

async function fetchAccessToken() {
  const { data } = await useFetch('https://accounts.spotify.com/api/token', {
    onRequest({ request, options }) {
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      options.method = 'post';
      options.body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: spotifyClientId,
        client_secret: spotifyClientSecret
      });
    }
  });

  accessToken.value = data.value?.access_token;
}

if (!accessToken.value) {
  fetchAccessToken();
}

const artistData = ref();

async function fetchArtist() {
  const { data } = await useFetch('https://api.spotify.com/v1/artists/4Z8W4fKeB5YxbusRsdQVPb', {
    onRequest({ request, options }) {
      options.method = 'get';
      options.headers = {
        Authorization: `Bearer ${accessToken.value}`
      };
    }
  });
  if (data.value) {
    artistData.value = data.value;
  }
}

fetchArtist();
</script>

<template>
  <div v-if="artistData" class="container">
    <h2>{{ artistData.name }}</h2>

    <BaseImage :src="artistData.images?.[0].url" :width="artistData.images?.[0].width" />
  </div>
</template>

<style lang="postcss" scoped></style>
