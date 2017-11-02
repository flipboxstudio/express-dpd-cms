<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
    <v-form ref="eventForm">
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
        <image-upload title="Featured Image" :imageData.sync="event.featuredImage" :maxFileSize="2048" :readonly="readonly" :preview="true"/>
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
import TextEditor from '~/components/TextEditor'
import DpdQuery from '~/helpers/dpd-query'
import form from '~/mixins/form'

export default {
  layout: 'admin',
  mixins: [form],
  components: {ImageUpload, FormAction, DateTimePicker, TextEditor},
  data () {
    return {
      loadingCategory: true,
      categories: [],
      event: {
        title: '',
        slug: '',
        category: {
          id: '',
          name: ''
        },
        featuredImage: '',
        content: {
          startDate: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
          endDate: `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}`,
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
      this.event.lang = 'en'
      this.event.type = 'event'
      this.fetchCategories()
      if (this.$route.query.view || this.$route.query.edit) {
        this.fetchData(this.$route.query.view || this.$route.query.edit)
      }
      this.checkReadOnly()
    },
    defaultDate () {
      let date = new Date()
      this.event.content.startDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      this.event.content.endDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    },
    updateStartDate (ev) {
      this.event.content.startDate = ev
    },
    updateEndDate (ev) {
      this.event.content.endDate = ev
    },
    fetchCategories () {
      this.loadingCategory = true
      /* eslint-disable */
      dpd.categories.get((res, err) => {
        this.loadingCategory = false
        if(err) {
          this.showError(err)
        } else {
          if(this.validResponse(res)) {
            this.categories = res
          } else {
            this.showError(res)
          }
        }
      })
      /* eslint-enable */
    },
    fetchData (id) {
      this.loading = true
      let query = new DpdQuery().filterBy('id', id).filterBy('type', 'event')
      /* eslint-disable */
      dpd.posts.get(query.get(), (res, err) => {
        this.loading = false
        if(err) {
          this.showError(err)
        } else {
          if(this.validResponse(res)) {
            this.event = res
          } else {
            this.showError(res)
          }
        }
      })
      /* eslint-enable */
    },
    submitData () {
      if (this.$refs.eventForm.validate()) {
        this.loading = true
        this.event.isActive = true
        this.event.category = this.event.category.id
        /* eslint-disable */
        dpd.posts.post(this.event, (res, err) => {
          this.loading = false
          if(err) {
            this.showError(err)
          } else {
            if(this.validResponse(res)) {
              this.backToList()
            } else {
              this.showError(res)
            }
          }
        })
        /* eslint-enable */
      }
    },
    deleteData (id = this.$route.query.view) {
      this.loading = true
      /* eslint-disable */
        dpd.posts.del(id,  (res, err) => {
          this.loading =false
            if(err) {
              this.showError(err)
            } else {
              if(this.validResponse(res)) {
                  this.backToList()
              } else {
                  this.showError(res)
              }
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

