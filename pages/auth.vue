<script lang="ts" setup>
import type { UserCookie } from '~/types';

useHead({
  title: 'Playlist Blend'
});

async function handleAuth() {
  await useAuth().signinRedirect();
}

const route = useRoute();
const code = route.query.code;
const error = route.query.error;
const user = useCookie<UserCookie>('user', { maxAge: 60 * 60 });

onMounted(async () => {
  if (code) {
    if (!user.value) {
      await useAuth().signinCallback();

      const authUser = await useAuth().getUser();

      if (authUser?.access_token) {
        user.value = {
          accessToken: authUser.access_token
        };
      }

      navigateTo('/');
    }
  }
});
</script>

<template>
  <div class="page">
    <div class="container">
      <div class="intro">
        <h2>What is Playlist Blend?</h2>
        <p>
          Playlist Blend is a fun and simple way to combine your favorite playlists with a friend’s! Whether you’re creating the perfect
          soundtrack for a hangout, road trip, or just want to see how your music styles fit together, Playlist Blend makes it easy.
        </p>
        <p>All you have to do it connect your Spotify account and choose playlists you want to blend.</p>
        <BaseButton @click="handleAuth">Log in with Spotify</BaseButton>
      </div>

      <template v-if="error">
        <div class="auth-error">Authentication unsuccessful. Please try again.</div>
      </template>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.intro {
  max-width: 600px;

  button {
    margin-top: 16px;
  }
}

.auth-error {
  color: var(--color-danger);
  margin-top: 32px;
  width: fit-content;
  font-size: var(--font-size-s);
}
</style>
