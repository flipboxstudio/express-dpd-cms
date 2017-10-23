<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form ref="articleForm">
      <v-text-field label="Title" v-model="article.title" required :readonly="readonly" :rules="requiredField"></v-text-field>
      <v-text-field label="Slug" v-model="article.slug" required :readonly="readonly" :rules="requiredField"></v-text-field>
      <v-select label="Category" :async-loading="loadingCategory" :items="categories" v-model="article.category" item-text="name" item-value="id" return-object :readonly="readonly"></v-select>
      <v-layout row wrap>
        <v-flex xs12 md6 :class="{disabled: readonly}">
          <date-time-picker
            label="Date"
            :datetime="article.content.date"
            @input="updateDate">
          </date-time-picker>
        </v-flex>
        <image-upload :imageData.sync="article.featuredImage" :maxFileSize="2048" :readonly="readonly"></image-upload>  
      </v-layout>

      <v-layout row wrap>
        <v-checkbox label="Featured" v-model="article.isFeatured" light :disabled="readonly"></v-checkbox>
        <v-checkbox label="Active" v-model="article.isActive" light :disabled="readonly"></v-checkbox>
      </v-layout>

      <no-ssr>
        <wysiwyg label="Content" v-model="article.content.content" :class="{disabled: readonly}" placeholder="Your content here..." required :rules="requiredField"/>
      </no-ssr>

      <form-action @submit="submitData" @cancel="cancel" @edit="edit" @remove="deleteData" :state="state" :readonly="readonly" :loading="loading"></form-action>
    </v-form>
  </div>
</template>

<script>
import ImageUpload from '~/components/ImageUpload'
import FormAction from '~/components/FormAction'
import DateTimePicker from '~/components/DateTimePicker'
import DpdQuery from '~/helpers/dpd-query'
import form from '~/mixins/form'

export default {
  layout: 'admin',
  mixins: [form],
  components: {ImageUpload, FormAction, DateTimePicker},
  data () {
    return {
      loadingCategory: true,
      categories: [],
      article: {
        title: '',
        slug: '',
        featuredImage: '',
        category: {
          id: '',
          name: ''
        },
        isFeatured: false,
        isActive: false,
        content: {
          date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          location: '',
          content: ''
        },
        meta: {
          visit: 0
        }
      }
    }
  },
  mounted () {
    this.defaultDate()
  },
  methods: {
    initData () {
      this.article.lang = 'en'
      this.article.type = 'article'
      this.fetchCategories()
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    defaultDate () {
      let date = new Date()
      this.article.content.data = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    },
    updateDate (ev) {
      this.article.content.date = ev
    },
    fetchCategories () {
      let vm = this
      vm.loadingCategory = true
      /* eslint-disable */
      dpd.categories.get(function(res, err) {
        vm.loadingCategory = false
        if(res) {
          vm.categories = res
        } else {
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    fetchData (id) {
      let vm = this
      vm.loading = true
      let query = new DpdQuery().filterBy('id', id).filterBy('type', 'article')
      /* eslint-disable */
      dpd.posts.get(query.get(), function(res, err) {
        vm.loading = false
        if(res) {
          vm.article = res
        } else {
          alert(err.message || JSON.stringify(err.errors))
        }
      })
      /* eslint-enable */
    },
    submitData () {
      let vm = this

      if (this.$refs.articleForm.validate()) {
        vm.loading = true
        vm.article.category = vm.article.category.id
        /* eslint-disable */
        dpd.posts.post(vm.article, function(res, err) {
          vm.loading = false
          if(res) {
            vm.backToList()
          } else {
            // enabling below line result in double execution (??)
            // var error = err.message || res.message || 'Unknown Error'
            alert(err.message || JSON.stringify(err.errors))
          }
        })
        /* eslint-enable */
      }
    },
    deleteData (id = this.$route.query.view) {
      let vm = this
      vm.loading = true
      /* eslint-disable */
        dpd.posts.del(id, function (res, err) {
          vm.loading =false
            if(res) {
                vm.backToList()
            } else {
                alert(err.message || JSON.stringify(err.errors))
            }
        })
        /* eslint-enable */
    }
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none
}
</style>

