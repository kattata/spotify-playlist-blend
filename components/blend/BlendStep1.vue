<script lang="ts" setup>
import type { BlendItem } from '~/types';

interface Props {
  modelValue: BlendItem;
  myPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  friendPlaylists: SpotifyApi.ListOfUsersPlaylistsResponse | null;
  friendName: string | undefined;
}

const props = defineProps<Props>();

const { isMobile } = useBreakpoints();

const internalBlendItem = defineModel<BlendItem>({
  required: true,
  get: () => props.modelValue
});

const isMeListExpanded = ref<boolean>(false);
const isFriendListExpanded = ref<boolean>(false);

function handleViewMore(scope: 'me' | 'friend') {
  if (scope === 'me') {
    isMeListExpanded.value = !isMeListExpanded.value;
  } else {
    isFriendListExpanded.value = !isFriendListExpanded.value;
  }
}
</script>

<template>
  <div class="blend-step">
    <section>
      <template v-if="props.myPlaylists">
        <div class="playlists-wrapper">
          <h2>Your playlists</h2>

          <div class="playlists" :class="{ 'playlists--expanded': isMeListExpanded }">
            <template v-for="item in props.myPlaylists?.items" :key="`my-playlist__${item.id}`">
              <BasePlaylistSelect
                :id="item.id"
                v-model="internalBlendItem.me.playlistIds"
                :image="item.images?.[0].url"
                :name="item.name"
              />
            </template>
          </div>
          <div v-if="isMobile()" class="playlists-view-more">
            <BaseButton class="playlists-view-more-button" variant="ghost" @click="handleViewMore('me')">
              <span>{{ isMeListExpanded ? 'See less' : 'See more' }}</span>
            </BaseButton>
          </div>
        </div>
      </template>

      <template v-if="props.friendPlaylists">
        <div class="playlists-wrapper">
          <h2>
            <template v-if="props.friendName"> {{ props.friendName }}'s playlists </template>
            <template v-else> Their playlists </template>
          </h2>
          <div class="playlists" :class="{ 'playlists--expanded': isFriendListExpanded }">
            <template v-for="item in props.friendPlaylists?.items" :key="`friend-playlist__${item.id}`">
              <BasePlaylistSelect
                :id="item.id"
                v-model="internalBlendItem.friend.playlistIds"
                :image="item.images?.[0].url"
                :name="item.name"
              />
            </template>
          </div>
          <div v-if="isMobile()" class="playlists-view-more">
            <BaseButton class="playlists-view-more-button" variant="ghost" @click="handleViewMore('friend')">
              <span>{{ isFriendListExpanded ? 'See less' : 'See more' }}</span>
            </BaseButton>
          </div>
        </div>
      </template>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
section {
  display: grid;
  grid-template-columns: 1fr @(min-width: 900px) 1fr 1fr;
  gap: 40px;
}

.playlists {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 200px @(min-width: 900px) none;
  overflow-y: hidden;

  :deep(.icon) {
    font-size: 24px;
  }

  &-view-more {
    background: linear-gradient(to top, var(--color-background), transparent);
    height: 90px;
    margin-top: -70px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &-view-more-button {
    margin-inline: auto;
    display: block;
  }

  &--expanded {
    max-height: none;

    .playlists-view-more {
      background: transparent;
    }
  }
}
</style>
