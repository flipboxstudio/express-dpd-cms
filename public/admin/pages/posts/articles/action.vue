<!-- type of form : view/id, edit/id, create -->
<template>
  <div>
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
          <image-upload title="Featured Image" :imageData.sync="article.featuredImage" :maxFileSize="2048" :readonly="readonly" :preview="true"/>
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
      let query = new DpdQuery().filterBy('id', id).filterBy('type', 'article')
      /* eslint-disable */
      dpd.posts.get(query.get(), (res, err) => {
        this.loading = false
        if(err) {
          this.showError(err)
        } else {
          if(this.validResponse(res)) {
            this.article = res
          } else {
            this.showError(res)
          }
        }
      })
      /* eslint-enable */
    },
    submitData () {
      if (this.$refs.articleForm.validate()) {
        this.loading = true
        this.article.category = this.article.category.id
        /* eslint-disable */
        dpd.posts.post(this.article, (res, err) => {
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

