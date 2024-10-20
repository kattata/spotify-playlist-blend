<script lang="ts" setup>
useHead({
  title: 'Playlist Blend | Artist'
});

const accessToken = useCookie('accessToken');

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

if (accessToken.value) {
  fetchArtist();
}
</script>

<template>
  <div v-if="artistData" class="container">
    <h2>{{ artistData.name }}</h2>

    <BaseImage :src="artistData.images?.[0].url" :width="artistData.images?.[0].width" />
  </div>
</template>

<style lang="postcss" scoped></style>
