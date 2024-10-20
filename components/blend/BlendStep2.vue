<script lang="ts" setup>
import type { UserCookie } from '~/types';

const query = useRoute().query;
const mePlaylistId = String(query.mePlaylistId);
const mePlaylistName = String(query.mePlaylistName);
const friendPlaylistId = String(query.friendPlaylistId);
const friendPlaylistName = String(query.friendPlaylistName);

const user = useCookie<UserCookie>('user');

const commonTracks = ref<SpotifyApi.PlaylistTrackObject[] | null>(null);

const readyToDisplayBlend = ref<boolean>(false);
const newBlendPlaylist = ref<SpotifyApi.CreatePlaylistResponse | null>(null);

async function fetchPlaylistTracks(playlistId: string) {
  try {
    const { data } = await useFetch<SpotifyApi.PlaylistTrackResponse>(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${user.value?.accessToken}` }
    });

    return data.value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function handleCreateBlend() {
  const myTracks = await fetchPlaylistTracks(mePlaylistId);
  const friendTracks = await fetchPlaylistTracks(friendPlaylistId);

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

async function handleCreatePlaylist() {
  try {
    const { data } = await useFetch<SpotifyApi.CreatePlaylistResponse>(`https://api.spotify.com/v1/users/${user.value.id}/playlists`, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${user.value?.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: {
        name: 'Blend',
        description: `Created by Playlist Blend based on ${mePlaylistName} and ${friendPlaylistName}`,
        public: false
      }
    });

    newBlendPlaylist.value = data.value;

    return data.value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } finally {
    if (newBlendPlaylist.value?.id) {
      addTracksToPlaylist();
    }
  }
}

async function addTracksToPlaylist() {
  try {
    const { data } = await useFetch<SpotifyApi.AddTracksToPlaylistResponse>(
      `https://api.spotify.com/v1/playlists/${newBlendPlaylist.value?.id}/tracks`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${user.value?.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: {
          uris: commonTracks.value?.map(track => track.track?.uri)
        }
      }
    );

    return data.value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
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

              <div class="create-playlist">
                <p>If you like the new blend, go ahead and save it as a new playlist!</p>
                <BaseButton @click="handleCreatePlaylist"> Create playlist </BaseButton>

                <div class="create-playlist-success">
                  <template v-if="newBlendPlaylist">
                    All done. Your
                    <BaseLink :to="newBlendPlaylist.external_urls.spotify" target="_blank"> new playlist </BaseLink>
                    has been created!
                  </template>
                </div>
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

button {
  margin-top: 12px;
}

.create-playlist {
  margin-top: 40px;

  &-success {
    margin-top: 12px;
  }
}
</style>
