<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-flex md3 xs4>
      <locale-dropdown @changed="switchLocale($event)"></locale-dropdown>
    </v-flex>
    <v-form ref="articleForm">
      <v-card class="pl-3 pr-3 pt-3 pb-3">
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
          <image-upload title="Featured Image" :imageData.sync="article.featuredImage" :maxFileSize="2048" :readonly="readonly" :preview="true"></image-upload>  
        </v-layout>

        <v-layout row wrap>
          <v-checkbox label="Featured" v-model="article.isFeatured" light :disabled="readonly"></v-checkbox>
          <v-checkbox label="Active" v-model="article.isActive" light :disabled="readonly"></v-checkbox>
        </v-layout>

      </v-card>

      <text-editor :content="article.content.content" @update="article.content.content = $event" :readonly="readonly" :rules="requiredField"/>  

      <form-action @submit="submitData" @cancel="cancel" @edit="edit" @remove="deleteData" :state="state" :readonly="readonly" :loading="loading"></form-action>
    </v-form>
  </div>
</template>

<script>
import ImageUpload from '~/components/ImageUpload'
import FormAction from '~/components/FormAction'
import DateTimePicker from '~/components/DateTimePicker'
import LocaleDropdown from '~/components/LocaleDropdown'
import TextEditor from '~/components/TextEditor'
import DpdQuery from '~/helpers/dpd-query'
import form from '~/mixins/form'

export default {
  layout: 'admin',
  mixins: [form],
  components: {ImageUpload, FormAction, DateTimePicker, TextEditor, LocaleDropdown},
  data () {
    return {
      loadingCategory: true,
      categories: [],
      lang: process.env.defaultLocale,
      article: {
        title: '',
        slug: '',
        type: 'article',
        lang: process.env.defaultLocale,
        featuredImage: '',
        category: {
          id: '',
          name: ''
        },
        isFeatured: false,
        isActive: false,
        content: {
          date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} : 00:00`,
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
    switchLocale (lang) {
      this.lang = lang
      this.article.lang = lang
      this.initData()
    },
    initData () {
      this.fetchPostCategories()
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    defaultDate () {
      let date = new Date()
      this.article.content.date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 00:00`
    },
    updateDate (ev) {
      this.article.content.date = ev
    },
    fetchPostCategories () {
      this.loadingCategory = true
      this.$axios.get(`/post/category`)
        .then((res) => {
          this.loadingCategory = false
          if (this.validResponse(res.data)) {
            this.categories = res.data
          } else {
            this.showError(res.data)
          }
        }).catch((err) => {
          this.loadingCategory = false
          this.showError(err.response.data)
        })
    },
    fetchData (id) {
      this.loading = true
      let query = new DpdQuery().filterBy('translationId', id).filterBy('type', 'article').filterBy('lang', this.lang)

      this.$axios.get(`/post?${query.toString()}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res.data[0])) {
            this.article = res.data[0]
          } else {
            this.article.id = ''
            this.article.title = ''
            this.article.lang = this.lang
            this.article.content = {
              date: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} : 00:00`,
              location: '',
              content: ''
            }
            this.article.meta = { visit: 0 }
            this.showError({message: `No translation found (${this.lang})`})
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    },
    submitData () {
      if (this.$refs.articleForm.validate()) {
        this.loading = true
        this.article.category = this.article.category.id

        this.$axios.post('/post', this.article)
          .then((res) => {
            this.loading = false
            if (this.validResponse(res)) {
              this.backToList()
            } else {
              this.showError(res)
            }
          }).catch((err) => {
            this.loading = false
            this.showError(err.response.data)
          })
      }
    },
    deleteData (id = this.$route.query.view) {
      this.loading = true
      this.$axios.delete(`/post/${id}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res)) {
            this.backToList()
          } else {
            this.showError(res)
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
        })
    }
  }
}
</script>

<style scoped>
.disabled {
  pointer-events: none
}
</style>
