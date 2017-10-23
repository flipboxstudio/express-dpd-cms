<!-- TODO improve below components -->

<template>
    <div>
        <input type="file" id="input-file-upload" name="fileupload" class="form-control-file" :disabled="readonly" v-if="!readonly" v-on:change="setFiles"/>
        <v-btn :loading="loadingUpload" @click="uploadFile" outline :disabled="readonly" v-if="!readonly">Upload</v-btn>
        <div class="form-group">
            <img :src="uploadedImageUrl.thumbnail" height="200px" v-if="uploadedImageUrl"/>
        </div>
    </div>
</template>

<script>
export default {
  props: ['imageData', 'maxFileSize', 'readonly'],
  data () {
    return {
      loadingUpload: false,
      files: [],
      uploadedImageUrl: {
        original: '',
        thumbnail: ''
      }
    }
  },
  watch: {
    imageData (val) {
      this.uploadedImageUrl = val || {}
    }
  },
  methods: {
    setFiles (event) {
      this.files = event.target.files || event.dataTransfer.files
      // size validation
      if (!this.files.length) { } else {
        for (let i in this.files) {
          if (this.maxFileSize && this.files[i].size / 1000 > this.maxFileSize) { // file size is in byts, max file size is ini kilobytes
            alert(`file cannot be larger than ${this.maxFileSize / 1024} MB`)
            document.getElementById('input-file-upload').value = ''
          }
        }
      }
    },
    uploadFile () {
      let vm = this
      let subdir = ''
      let comments = ''
      let uniqueFilename = ''
      let thumbnail = true
      let thumbnailWidth = 400

      let fd = new FormData()
      for (let i in this.files) {
        fd.append('uploadedFile', this.files[i])
      }

      vm.loadingUpload = true
      let xhr = new XMLHttpRequest()
      xhr.open('POST', `${process.env.backendUrl}/files?subdir=${subdir}&comments=${comments}&uniqueFilename=${uniqueFilename}&thumbnail=${thumbnail}&thumbnailWidth=${thumbnailWidth}`)
      xhr.onload = function () {
        vm.loadingUpload = false
        let response = JSON.parse(this.responseText)
        vm.uploadedImageUrl.original = process.env.backendUrl + '/upload/' + response[0].filename
        vm.uploadedImageUrl.thumbnail = process.env.backendUrl + '/upload/' + response[0].thumbnail
        vm.$emit('update:imageData', vm.uploadedImageUrl)
        document.getElementById('input-file-upload').value = ''
      }
      xhr.onerror = function (err) {
        vm.loadingUpload = false
        console.log(err)
      }
      xhr.send(fd)
    }
  }

}
</script>