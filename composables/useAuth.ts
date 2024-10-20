import { User, UserManager, type UserManagerSettings } from 'oidc-client-ts';

export default function () {
  const { spotifyClientId, spotifyClientSecret } = useRuntimeConfig().public;

  const settings: UserManagerSettings = {
    authority: 'a',
    client_id: spotifyClientId,
    client_secret: spotifyClientSecret,
    response_type: 'code',
    scope: 'user-read-private user-read-email playlist-read-private',
    redirect_uri: 'http://localhost:3000',
    metadata: {
      authorization_endpoint: 'https://accounts.spotify.com/authorize',
      token_endpoint: 'https://accounts.spotify.com/api/token'
    },
    automaticSilentRenew: true
  };

  const userManager = new UserManager(settings);

  function signinRedirect() {
    return userManager.signinRedirect();
  }

  function signinCallback(): Promise<User | void> {
    return userManager.signinRedirectCallback();
  }

  function signinSilent() {
    return userManager.signinSilent();
  }

  function signout() {
    return userManager.signoutRedirect({
      post_logout_redirect_uri: '/'
    });
  }

  function signoutCallback() {
    return userManager.signoutRedirectCallback();
  }

  async function isLoggedIn() {
    const user = await userManager.getUser();

    return !!user;
  }

  function getUser() {
    return userManager.getUser();
  }

  async function getProfile() {
    const user = await userManager.getUser();

    if (!user?.profile) {
      return null;
    }

    return user?.profile;
  }

  return {
    signinSilent,
    signinRedirect,
    signinCallback,
    signout,
    signoutCallback,
    isLoggedIn,
    getUser,
    getProfile
  };
}
