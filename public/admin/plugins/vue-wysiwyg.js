import Vue from 'vue'
import wysiwyg from 'vue-wysiwyg'

if (process.browser) {
  Vue.use(wysiwyg, {
    hideModules: {'image': true, 'table': true},
    image: {
      uploadURL: '/',
      dropzoneOptions: {

      }
    }
  })
}
