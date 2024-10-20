<script lang="ts" setup>
const query = useRoute().query;

if (!query.mePlaylistId || !query.friendPlaylistId) {
  navigateTo('/');
}

useHead({
  title: 'Create blend | Playlist Blend'
});
</script>

<template>
  <div class="page">
    <BlendStep2 />
  </div>
</template>

<style lang="postcss" scoped></style>
