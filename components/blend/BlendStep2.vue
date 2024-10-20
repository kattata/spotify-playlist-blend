<script lang="ts" setup>
const query = useRoute().query;
const mePlaylistId = String(query.mePlaylistId);
const mePlaylistName = String(query.mePlaylistName);
const friendPlaylistId = String(query.friendPlaylistId);
const friendPlaylistName = String(query.friendPlaylistName);

const accessToken = useCookie('accessToken');

const commonTracks = ref<SpotifyApi.PlaylistTrackObject[] | null>(null);

const readyToDisplayBlend = ref<boolean>(false);

async function fetchPlaylistTracks(playlistId: string) {
  try {
    const { data } = await useFetch<SpotifyApi.PlaylistTrackResponse>(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    });

    return data.value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

const myTracks = await fetchPlaylistTracks(mePlaylistId);
const friendTracks = await fetchPlaylistTracks(friendPlaylistId);

function handleCreateBlend() {
  if (!mePlaylistId || !friendPlaylistId) {
    return;
  }

  const matchingTracks = myTracks?.items.filter(meItem => {
    return friendTracks?.items.find(friendItem => meItem.track?.id === friendItem.track?.id);
  });

  if (matchingTracks?.length) {
    commonTracks.value = matchingTracks;
  }

  readyToDisplayBlend.value = true;
}

function handleNoBlendClick() {
  navigateTo('/');
}
</script>

<template>
  <div class="blend-step">
    <div class="container">
      <section>
        <!-- TODO: Display users' names -->
        <!-- <div>Kasia & [name]</div> -->
        <h2>{{ mePlaylistName }} & {{ friendPlaylistName }}</h2>
        <BaseButton @click="handleCreateBlend"> Create blend </BaseButton>

        <template v-if="readyToDisplayBlend">
          <template v-if="commonTracks?.length">
            <div class="playlist-blend">
              <h3>Your new blend</h3>

              <div class="playlists">
                <template v-for="item in commonTracks" :key="`blend-playlist__${item.track?.id}`">
                  <template v-if="item.track?.name">
                    <BaseItemPreview
                      :name="item.track.name"
                      :image="item.track.album.images?.[0]?.url"
                      :description="item.track.artists.map(artist => artist.name).join(', ')"
                    />
                  </template>
                </template>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="no-results">
              <div>Unfortunately, you have no common songs :(</div>
              <BaseButton @click="handleNoBlendClick"> Try a different blend </BaseButton>
            </div>
          </template>
        </template>
      </section>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.playlist-blend {
  margin-top: 40px;
}

.no-results {
  margin-top: 40px;
}
</style>
