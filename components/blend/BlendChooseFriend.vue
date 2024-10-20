<script lang="ts" setup>
const emit = defineEmits<{
  'user-selected': [data: SpotifyApi.UserObjectPublic, id: string];
}>();

const { $spotifyApi } = useNuxtApp();

const friendValue = ref<string>('');

async function fetchUser(userId: string) {
  try {
    const data = await $spotifyApi<SpotifyApi.UserProfileResponse>(`/v1/users/${userId}`);

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

async function handleChooseFriendSubmit() {
  const regex = /(?:https?:\/\/open\.spotify\.com\/user\/)?([^/?]+)/; // Find ID from Spotify profile sharing link
  const match = friendValue.value.match(regex);

  const friendId = match?.[1];

  if (!friendId) {
    return;
  }

  const userData = await fetchUser(friendId);

  if (!userData) {
    return;
  }

  emit('user-selected', userData, friendId);
}
</script>

<template>
  <div class="choose-friend">
    <h2>Choose a friend to blend with</h2>
    <p>To create a blend, you need to find your friend's profile ID.</p>
    <p>Go to their profile, click 'Copy link to profile' and paste it below</p>

    <form @submit.prevent="handleChooseFriendSubmit">
      <BaseInput v-model="friendValue" label="Profile ID or profile share link" />
      <BaseButton type="submit"> Submit </BaseButton>
    </form>
  </div>
</template>

<style lang="postcss" scoped>
.choose-friend {
  form {
    margin-top: 24px;
    display: flex;
    gap: 16px;
    align-items: flex-end;
  }

  :deep(.input-wrapper) {
    width: 500px;
  }
}
</style>
