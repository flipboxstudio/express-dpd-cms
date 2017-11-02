<template>
    <no-ssr>
        <v-card class="pl-3 pr-3 pt-3 pb-3 mt-3" :class="{disabled: readonly}">
            <div class="quill-editor" 
                :content="content"
                @change="updateContent($event)"
                v-quill:myQuillEditor="editorOption"
                placeholder="Your content here..." required :rules="rules">
            </div>
            <image-upload title="Insert Image" :imageData.sync="contentImage" :maxFileSize="2048" :readonly="readonly" class="mt-3"></image-upload>  
        </v-card>
    </no-ssr>
</template>

<script>
import ImageUpload from '~/components/ImageUpload'

export default {
  props: ['content', 'readonly', 'rules'],
  components: {ImageUpload},
  data () {
    return {
      localContent: '',
      contentImage: '',
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', {'color': []}],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'script': 'sub'}, {'script': 'super'}], // superscript/subscript
            [{'indent': '-1'}, {'indent': '+1'}, {'align': []}], // outdent/indent
            ['clean'],

            [{'header': [1, 2, 3, 4, 5, 6, false]}],
            [{'font': []}]
          ],
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          imageImport: true,
          imageResize: {
            displaySize: true
          }
        }
      }
    }
  },
  watch: {
    'contentImage': {
      handler: function (val, oldVal) {
        this.localContent += `<img src="${val.original}"/>`
        this.$emit('update', this.localContent)
      },
      deep: true
    }
  },
  methods: {
    updateContent (val) {
      this.localContent = val.html
      this.$emit('update', this.localContent)
    }
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none,
}
.disabled .ql-toolbar {
    display: none;
}
</style>

