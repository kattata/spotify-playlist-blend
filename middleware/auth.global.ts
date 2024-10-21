import type { UserCookie } from '~/types';

export default defineNuxtRouteMiddleware(to => {
  const user = useCookie<UserCookie>('user');

  if (to.path === '/' && !user.value) {
    return navigateTo('/auth');
  }
});
