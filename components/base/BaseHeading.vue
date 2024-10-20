<script lang="ts" setup>
interface Props {
  text: string;
  tagHx?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  styleHx?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

const props = defineProps<Props>();
</script>

<template>
  <div class="heading">
    <div class="divider divider--horizontal"></div>
    <component :is="props.tagHx || 'h1'" :class="props.styleHx || 'h1'">
      {{ props.text }}
    </component>
  </div>
</template>

<style lang="postcss" scoped>
.heading {
  position: relative;

  .divider {
    z-index: -2;
    width: calc(100vw - 35px) @(min-width: 900px) 100vw;
    position: absolute;
    left: unset @(min-width: 900px) calc(((100vw - var(--container-width-s)) / 2) * -1);
    top: 50%;
    transform: translateY(-50%);
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    background-color: var(--color-secondary-100);
    width: fit-content;
    padding-inline: 24px;
    margin-left: -24px;
  }
}
</style>
