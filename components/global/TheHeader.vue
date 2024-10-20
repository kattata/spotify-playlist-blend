<script lang="ts" setup></script>

<template>
  <div class="container container--no-padding">
    <header>
      <div class="divider divider--horizontal"></div>
      <BaseLink to="/"> Playlist Blend </BaseLink>

      <ul class="navigation-items-desktop"></ul>

      <ul class="navigation-items-mobile"></ul>
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
    background-color: var(--color-background);
    padding-inline: 16px;
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
}
</style>
