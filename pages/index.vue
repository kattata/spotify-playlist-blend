<script lang="ts" setup>
useHead({
  title: 'Spotify Playlist Blend'
});

const route = useRoute();
const code = route.query.code;
// const error = route.query.error; // TODO: Handle error
const accessToken = useCookie('accessToken');

onMounted(async () => {
  if (code) {
    if (!accessToken.value) {
      await useAuth().signinCallback();
      const user = await useAuth().getUser();

      accessToken.value = user?.access_token;
    }
  }

  fetchProfile();
});

async function handleAuth() {
  await useAuth().signinRedirect();
}

const profileData = ref();

async function fetchProfile(): Promise<any> {
  const { data } = await useFetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken.value}` }
  });

  if (data.value) {
    profileData.value = data.value;
  }

  // navigateTo('/');
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
      </template>
      <template v-else>
        <button @click="handleAuth">Authenticate</button>
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
  }

  img {
    border-radius: 50%;
  }

  p {
    margin: 0;
  }

  button {
    margin-top: 32px;
  }
}
</style>
