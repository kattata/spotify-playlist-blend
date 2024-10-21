<script lang="ts" setup>
import type { UserCookie } from '~/types';

const user = useCookie<UserCookie>('user');
</script>

<template>
  <div class="container container--no-padding">
    <header>
      <div class="divider divider--horizontal"></div>
      <BaseLink class="navigation-item" to="/">Playlist Blend</BaseLink>

      <ul class="navigation-items-desktop">
        <li v-if="user?.displayName" class="navigation-item profile">
          <BaseImage v-if="user?.profileImage" :src="user.profileImage" width="30px" />
          <div>{{ user.displayName }}</div>
        </li>
      </ul>

      <ul class="navigation-items-mobile">
        <li v-if="user?.profileImage" class="navigation-item profile">
          <BaseImage v-if="user?.profileImage" :src="user.profileImage" width="30px" />
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
    }
  }

  a {
    text-decoration: none;
  }

  .divider {
    z-index: -1;
    position: absolute;
    left: 0 @(min-width: 1400px) calc((100vw - var(--container-width-m) + var(--container-padding)) / 2 * -1);
    top: 50%;
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
  }

  .profile {
    display: flex;
    gap: 12px;
    align-items: center;

    img {
      border-radius: 50%;
    }
  }
}
</style>
