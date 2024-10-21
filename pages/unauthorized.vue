<script lang="ts" setup></script>

<template>
  <div class="container">
    <main>
      <div>
        <h2>Unauthorized</h2>
        <p>Your session has expired. Please authenticate again.</p>
      </div>
      <BaseLink to="/auth">Log in</BaseLink>
    </main>
  </div>
</template>

<style lang="postcss" scoped>
a {
  display: block;
  padding-top: 32px;
}
</style>
