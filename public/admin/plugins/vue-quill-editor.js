import Vue from 'vue'
import Quill from 'quill'
import { ImageImport } from '~/quill-modules/ImageImport.js'
import { ImageResize } from '~/quill-modules/ImageResize.js'

Quill.register('modules/imageImport', ImageImport)
Quill.register('modules/imageResize', ImageResize)
if (process.browser) {
  const VueQuillEditor = require('vue-quill-editor/ssr')
  Vue.use(VueQuillEditor)
}
