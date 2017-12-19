<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form ref="eventForm">
      <v-flex md3 xs4>
        <locale-dropdown @changed="switchLocale($event)"></locale-dropdown>
      </v-flex>
      <v-card class="pl-3 pr-3 pt-3 pb-3">
        <v-text-field label="Title" v-model="event.title" required :readonly="readonly" :rules="requiredField"></v-text-field>
        <v-text-field label="Slug" v-model="event.slug" required :readonly="readonly" :rules="requiredField"></v-text-field>
        <v-select label="Category" :async-loading="loadingCategory" :items="categories" v-model="event.category" item-text="name" item-value="id" return-object :readonly="readonly"></v-select>
        <v-text-field label="Location" v-model="event.content.location" required :readonly="readonly" :rules="requiredField"></v-text-field>
        <v-layout row wrap>
          <v-flex xs12 md6 :class="{disabled: readonly}">
            <date-time-picker
              label="Start Date"
              :datetime="event.content.startDate"
              @input="updateStartDate">
            </date-time-picker>
          </v-flex>
          <v-flex xs12 md6 :class="{disabled: readonly}">
            <date-time-picker
              label="End Date"
              :datetime="event.content.endDate"
              @input="updateEndDate">
            </date-time-picker>
          </v-flex>
        </v-layout>
        <image-upload title="Featured Image" :imageData.sync="event.featuredImage" :maxFileSize="2048" :readonly="readonly" :preview="true"></image-upload>
      </v-card>

      <text-editor :content="event.content.content" @update="event.content.content = $event" :readonly="readonly" :rules="requiredField"/>

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
      event: {
        title: '',
        slug: '',
        category: {
          id: '',
          name: ''
        },
        type: 'event',
        lang: process.env.defaultLocale,
        featuredImage: '',
        content: {
          startDate: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} : 00:00`,
          endDate: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} : 00:00`,
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
      this.event.lang = lang
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
      this.event.content.startDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 00:00`
      this.event.content.endDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 00:00`
    },
    updateStartDate (ev) {
      this.event.content.startDate = ev
    },
    updateEndDate (ev) {
      this.event.content.endDate = ev
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
      let query = new DpdQuery().filterBy('translationId', id).filterBy('type', 'event').filterBy('lang', this.lang)
      this.$axios.get(`/post?${query.toString()}`)
        .then((res) => {
          this.loading = false
          if (this.validResponse(res.data[0])) {
            this.event = res.data[0]
          } else {
            this.event.id = ''
            this.event.title = ''
            this.event.lang = this.lang
            this.event.content.content = ''
            this.event.meta = { visit: 0 }
            this.showError('No translation available')
          }
        }).catch((err) => {
          this.loading = false
          this.showError(err.response.data)
          this.event.id = ''
          this.event.title = ''
          this.event.lang = this.lang
          this.event.content.content = ''
          this.event.meta = { visit: 0 }
        })
    },
    submitData () {
      if (this.$refs.eventForm.validate()) {
        this.loading = true
        this.event.isActive = true
        this.event.category = this.event.category.id
        this.$axios.post('/post', this.event)
          .then((res) => {
            this.loading = false
            if (this.validResponse(res)) {
              this.backToList()
            } else {
              console.log(res)
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
