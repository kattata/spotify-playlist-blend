<script lang="ts" setup>
import type { UserCookie } from '~/types';

const user = useCookie<UserCookie>('user');

function handleSignOut() {
  user.value = undefined;
  navigateTo('/auth');
}
</script>

<template>
  <div class="container container--no-padding">
    <header>
      <div class="divider divider--horizontal"></div>
      <BaseLink class="navigation-item" to="/">Playlist Blend</BaseLink>

      <ul class="navigation-items-desktop">
        <li v-if="user?.displayName" class="navigation-item navigation-item-profile">
          <div class="profile">
            <BaseImage v-if="user?.profileImage" :src="user.profileImage" width="30px" />
            <div>{{ user.displayName }}</div>
          </div>
          <div class="profile-sign-out">
            <BaseButton @click="handleSignOut">Sign out</BaseButton>
          </div>
        </li>
      </ul>

      <ul class="navigation-items-mobile">
        <li v-if="user?.profileImage" class="navigation-item navigation-item-profile">
          <div class="profile">
            <BaseImage v-if="user?.profileImage" :src="user.profileImage" width="30px" />
          </div>
          <div class="profile-sign-out">
            <BaseButton @click="handleSignOut">Sign out</BaseButton>
          </div>
        </li>
      </ul>
    </header>
  </div>
</template>

<style lang="postcss" scoped>
header {
  display: flex;
  justify-content: space-between;
  padding-block: 40px;
  position: relative;

  ul {
    margin: 0;
    display: flex;
    gap: 32px;

    li {
      list-style-type: none;

      .navigation-item {
        margin-top: -5px;
      }
    }
  }

  a {
    text-decoration: none;
  }

  .divider {
    z-index: -1;
    position: absolute;
    left: 0 @(min-width: 1400px) calc((100vw - var(--container-width-m) + var(--container-padding)) / 2 * -1);
    top: 50px;
    width: 100vw;
  }

  .navigation-items-desktop {
    display: none @(min-width: 900px) flex;
  }

  .navigation-items-mobile {
    display: flex @(min-width: 900px) none;
  }

  .navigation-item {
    background-color: var(--color-background);
    padding-inline: 16px;
    position: relative;
  }

  .profile-sign-out {
    display: none;
    position: absolute;
    right: 0;
  }

  .navigation-item-profile {
    &:hover {
      & > .profile-sign-out {
        display: block;
        margin-right: 12px;
      }
    }
  }

  .profile {
    display: flex;
    gap: 12px;
    align-items: center;
    padding-bottom: 12px;

    img {
      border-radius: 50%;
    }
  }
}
</style>
