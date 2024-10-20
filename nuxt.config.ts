// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      'postcss-nested': {},
      'postcss-preset-env': {},
      'postcss-inline-media': {}
    }
  },

  components: [
    { path: '~/components' },
    { path: '~/components/base' },
    { path: '~/components/front-page' },
    { path: '~/components/global' }
  ],

  modules: ['nuxt-icons', '@nuxt/image', '@nuxtjs/i18n'],

  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => ['swiper-container', 'swiper-slide'].includes(tag)
    }
  },

  i18n: {
    compilation: {
      strictMessage: false
    },
    locales: [
      {
        name: 'English',
        code: 'en',
        file: 'en.yaml',
        iso: 'en',
        dir: 'ltr'
      }
    ],
    lazy: true,
    langDir: './locales',
    defaultLocale: 'en'
  }
});
