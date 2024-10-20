<script lang="ts" setup>
import type { BlendItem } from '~/types';

useHead({
  title: 'Spotify Playlist Blend'
});

const route = useRoute();
const code = route.query.code;
// const error = route.query.error; // TODO: Handle error
const accessToken = useCookie('accessToken', { maxAge: 60 * 60 });

const readyToCreate = ref<boolean>(false);
const readyToDisplayBlend = ref<boolean>(false);

const blendItem = ref<BlendItem>({
  me: null,
  friend: null
});
const commonTracks = ref<SpotifyApi.PlaylistTrackObject[] | null>(null);

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

async function fetchPlaylistTracks(endpoint: string) {
  try {
    const { data } = await useFetch<SpotifyApi.PlaylistTrackResponse>(endpoint, {
      headers: { Authorization: `Bearer ${accessToken.value}` }
    });

    return data.value;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function handleAddToBlend(endpoint: string, scope: 'me' | 'friend') {
  if (scope === 'me') {
    blendItem.value.me = endpoint;
  } else {
    blendItem.value.friend = endpoint;
  }

  if (blendItem.value.me && blendItem.value.friend) {
    readyToCreate.value = true;
  }
}

async function handleCreateBlend() {
  if (!blendItem.value.me || !blendItem.value.friend) {
    return;
  }

  const myTracks = await fetchPlaylistTracks(blendItem.value.me);
  const friendTracks = await fetchPlaylistTracks(blendItem.value.friend);

  const matchingTracks = myTracks?.items.filter(meItem => {
    return friendTracks?.items.find(friendItem => meItem.track?.id === friendItem.track?.id);
  });

  if (matchingTracks?.length) {
    commonTracks.value = matchingTracks;

    readyToDisplayBlend.value = true;
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

        <template v-if="readyToCreate">
          <div>Selected playlists:</div>
          <div>Me: {{ blendItem.me }}</div>
          <div>Friend: {{ blendItem.friend }}</div>
          <BaseButton @click="handleCreateBlend"> Create blend </BaseButton>

          <template v-if="readyToDisplayBlend">
            <h2>Your new blend</h2>
            <div class="playlists">
              <template v-for="item in commonTracks" :key="`blend-playlist__${item.track.id}`">
                <div class="playlists-item">
                  <div class="playlists-item-details">
                    <div>{{ item.track?.name }}</div>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </template>

        <template v-else>
          <section class="playlist-section">
            <div class="playlists-wrapper">
              <h2>Your playlists</h2>
              <div class="playlists">
                <template v-for="item in myPlaylistData?.items" :key="`my-playlist__${item.id}`">
                  <div v-if="item.images?.[0].url" class="playlists-item">
                    <div class="playlists-item-details">
                      <BaseImage :src="item.images?.[0].url" width="50px" />
                      <div>{{ item.name }}</div>
                    </div>
                    <BaseButton @click="handleAddToBlend(item.tracks.href, 'me')"> Add to blend </BaseButton>
                  </div>
                </template>
              </div>
            </div>

            <div class="playlists-wrapper">
              <h2>Their playlists</h2>
              <div class="playlists">
                <template v-for="item in myPlaylistData?.items" :key="`my-playlist__${item.id}`">
                  <div v-if="item.images?.[0].url" class="playlists-item">
                    <div class="playlists-item-details">
                      <BaseImage :src="item.images?.[0].url" width="50px" />
                      <div>{{ item.name }}</div>
                    </div>
                    <BaseButton @click="handleAddToBlend(item.tracks.href, 'friend')"> Add to blend </BaseButton>
                  </div>
                </template>
              </div>
            </div>
          </section>
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

  .playlist-section {
    display: flex;
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
}
</style>
