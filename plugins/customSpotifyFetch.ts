import type { UserCookie } from '~/types';

export default defineNuxtPlugin(nuxtApp => {
  const user = useCookie<UserCookie>('user');

  const spotifyApi = $fetch.create({
    baseURL: 'https://api.spotify.com',
    onRequest({ options }) {
      if (user.value?.accessToken) {
        options.headers = {
          Authorization: `Bearer ${user.value.accessToken}`
        };
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/unauthorized'));
      }
    }
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      spotifyApi
    }
  };
});
