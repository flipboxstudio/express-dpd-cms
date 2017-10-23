const config = require('config')

module.exports = {
  // for deployment npm run generate-staging
  router: {
    base: config.get('routerBase')
  },
  env: config.get('env'),
  /*
  ** Headers of the page
  */
  head: {
    title: 'fbx-cms-starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Admin Panel for Flipbox CMS' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/no-ssr.js',
    {src: '~/plugins/vue-wysiwyg.js', ssr: false}
  ],
  css: [
    '~/assets/style/app.styl',
    '~/node_modules/vue-wysiwyg/dist/vueWysiwyg.css'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    vendor: ['vuetify'],
    extractCSS: true,
    /*
    ** Run ESLINT on save
    */
    extend (config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
